"""
Compliance engine service for B2B HR immigration compliance.
"""

import logging
from datetime import UTC, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.company import ComplianceAlert, Employee

logger = logging.getLogger(__name__)


async def calculate_compliance_score(company_id, db: AsyncSession) -> int:
    """Calculate a 0-100 compliance score for a company."""
    now = datetime.now(UTC)

    total_active = (
        await db.execute(
            select(func.count())
            .select_from(Employee)
            .where(
                Employee.company_id == company_id,
                Employee.status == "active",
            )
        )
    ).scalar() or 0

    if total_active == 0:
        return 100

    # Count expired permits
    expired = (
        await db.execute(
            select(func.count())
            .select_from(Employee)
            .where(
                Employee.company_id == company_id,
                Employee.status == "active",
                Employee.permit_expiry.isnot(None),
                Employee.permit_expiry <= now,
            )
        )
    ).scalar() or 0

    # Count expiring within 30 days
    expiring_30 = (
        await db.execute(
            select(func.count())
            .select_from(Employee)
            .where(
                Employee.company_id == company_id,
                Employee.status == "active",
                Employee.permit_expiry.isnot(None),
                Employee.permit_expiry <= now + timedelta(days=30),
                Employee.permit_expiry > now,
            )
        )
    ).scalar() or 0

    # Count unresolved critical alerts
    critical_alerts = (
        await db.execute(
            select(func.count())
            .select_from(ComplianceAlert)
            .where(
                ComplianceAlert.company_id == company_id,
                ComplianceAlert.severity == "critical",
                ComplianceAlert.resolved_at.is_(None),
            )
        )
    ).scalar() or 0

    # Score deductions
    deduction = 0
    deduction += expired * 25  # Each expired permit is -25
    deduction += expiring_30 * 10  # Each expiring-soon is -10
    deduction += critical_alerts * 15  # Each critical alert is -15

    return max(0, 100 - min(100, deduction))


async def generate_permit_expiry_alerts(company_id, db: AsyncSession) -> int:
    """Generate alerts for permits expiring soon. Returns number of new alerts."""
    now = datetime.now(UTC)
    new_alerts = 0

    alert_windows = [
        (90, "low"),
        (60, "medium"),
        (30, "high"),
        (14, "critical"),
        (7, "critical"),
    ]

    for days, severity in alert_windows:
        cutoff = now + timedelta(days=days)

        result = await db.execute(
            select(Employee).where(
                Employee.company_id == company_id,
                Employee.permit_expiry <= cutoff,
                Employee.permit_expiry > now,
                Employee.status == "active",
            )
        )
        employees = result.scalars().all()

        for emp in employees:
            # Check if similar alert already exists
            existing = await db.execute(
                select(ComplianceAlert).where(
                    ComplianceAlert.employee_id == emp.id,
                    ComplianceAlert.alert_type == "permit_expiry",
                    ComplianceAlert.severity == severity,
                    ComplianceAlert.resolved_at.is_(None),
                )
            )
            if existing.scalar_one_or_none():
                continue

            days_left = (emp.permit_expiry - now).days
            alert = ComplianceAlert(
                company_id=emp.company_id,
                employee_id=emp.id,
                alert_type="permit_expiry",
                severity=severity,
                message=f"Permit for {emp.first_name} {emp.last_name} ({emp.permit_type}) expires in {days_left} days",
                due_date=emp.permit_expiry,
            )
            db.add(alert)
            new_alerts += 1

    return new_alerts


async def get_ai_compliance_summary(company_id, db: AsyncSession) -> str:
    """Generate an AI-powered compliance summary for a company."""
    now = datetime.now(UTC)

    # Gather stats
    total = (
        await db.execute(
            select(func.count())
            .select_from(Employee)
            .where(Employee.company_id == company_id, Employee.status == "active")
        )
    ).scalar() or 0

    expiring = (
        await db.execute(
            select(func.count())
            .select_from(Employee)
            .where(
                Employee.company_id == company_id,
                Employee.status == "active",
                Employee.permit_expiry.isnot(None),
                Employee.permit_expiry <= now + timedelta(days=90),
                Employee.permit_expiry > now,
            )
        )
    ).scalar() or 0

    open_alerts = (
        await db.execute(
            select(func.count())
            .select_from(ComplianceAlert)
            .where(
                ComplianceAlert.company_id == company_id,
                ComplianceAlert.resolved_at.is_(None),
            )
        )
    ).scalar() or 0

    score = await calculate_compliance_score(company_id, db)

    # Use AI service if available
    try:
        from app.services.ai_service import get_chatbot_response

        prompt = (
            f"Generate a brief compliance summary for a Swiss company with {total} foreign employees. "
            f"Current compliance score: {score}/100. "
            f"{expiring} permits expiring within 90 days. "
            f"{open_alerts} open compliance alerts. "
            "Be concise and actionable. Focus on Swiss immigration law requirements."
        )
        result = await get_chatbot_response(prompt, language="en")
        return result.get("response", "")
    except Exception as e:
        logger.warning("AI summary unavailable: %s", e)
        return (
            f"Compliance Score: {score}/100. "
            f"{total} active employees, {expiring} permits expiring soon, "
            f"{open_alerts} open alerts."
        )

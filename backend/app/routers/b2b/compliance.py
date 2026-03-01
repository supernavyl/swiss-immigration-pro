"""
B2B Compliance dashboard router.
"""

import uuid
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user
from app.models.company import ComplianceAlert, Employee
from app.routers.b2b.companies import get_company_member

router = APIRouter(prefix="/compliance", tags=["b2b-compliance"])


@router.get("/{company_id}/dashboard")
async def compliance_dashboard(
    company_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get compliance dashboard overview."""
    await get_company_member(user, company_id, db)
    cid = uuid.UUID(company_id)
    now = datetime.now(UTC)

    # Total employees
    total_employees = (
        await db.execute(
            select(func.count()).select_from(Employee).where(
                Employee.company_id == cid,
                Employee.status == "active",
            )
        )
    ).scalar() or 0

    # Expiring permits (within 90 days)
    expiring_soon = (
        await db.execute(
            select(func.count()).select_from(Employee).where(
                Employee.company_id == cid,
                Employee.status == "active",
                Employee.permit_expiry.isnot(None),
                Employee.permit_expiry <= now + timedelta(days=90),
                Employee.permit_expiry > now,
            )
        )
    ).scalar() or 0

    # Expired permits
    expired = (
        await db.execute(
            select(func.count()).select_from(Employee).where(
                Employee.company_id == cid,
                Employee.status == "active",
                Employee.permit_expiry.isnot(None),
                Employee.permit_expiry <= now,
            )
        )
    ).scalar() or 0

    # Active alerts by severity
    alert_counts = {}
    for severity in ["critical", "high", "medium", "low"]:
        count = (
            await db.execute(
                select(func.count()).select_from(ComplianceAlert).where(
                    ComplianceAlert.company_id == cid,
                    ComplianceAlert.severity == severity,
                    ComplianceAlert.resolved_at.is_(None),
                )
            )
        ).scalar() or 0
        alert_counts[severity] = count

    total_alerts = sum(alert_counts.values())

    # Compliance score (0-100)
    if total_employees == 0:
        score = 100
    else:
        risk_points = (
            expired * 25
            + expiring_soon * 5
            + alert_counts.get("critical", 0) * 15
            + alert_counts.get("high", 0) * 8
        )
        score = max(0, 100 - min(100, risk_points))

    # Permit type distribution
    permit_dist_result = await db.execute(
        select(Employee.permit_type, func.count())
        .where(Employee.company_id == cid, Employee.status == "active")
        .group_by(Employee.permit_type)
    )
    permit_distribution = {row[0] or "Unknown": row[1] for row in permit_dist_result.all()}

    return {
        "complianceScore": score,
        "totalEmployees": total_employees,
        "expiringSoon": expiring_soon,
        "expired": expired,
        "alerts": alert_counts,
        "totalAlerts": total_alerts,
        "permitDistribution": permit_distribution,
    }


@router.get("/{company_id}/alerts")
async def list_alerts(
    company_id: str,
    severity: str | None = Query(None),
    resolved: bool = Query(False),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List compliance alerts."""
    await get_company_member(user, company_id, db)
    cid = uuid.UUID(company_id)

    query = select(ComplianceAlert).where(ComplianceAlert.company_id == cid)

    if severity:
        query = query.where(ComplianceAlert.severity == severity)
    if not resolved:
        query = query.where(ComplianceAlert.resolved_at.is_(None))
    else:
        query = query.where(ComplianceAlert.resolved_at.isnot(None))

    # Count
    count_q = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_q)).scalar() or 0

    # Sort: critical first, then by due_date
    severity_order = case(
        (ComplianceAlert.severity == "critical", 0),
        (ComplianceAlert.severity == "high", 1),
        (ComplianceAlert.severity == "medium", 2),
        else_=3,
    )
    query = query.order_by(severity_order, ComplianceAlert.due_date.asc().nulls_last())
    query = query.offset((page - 1) * limit).limit(limit)

    result = await db.execute(query)
    alerts = result.scalars().all()

    return {
        "alerts": [
            {
                "id": str(a.id),
                "employeeId": str(a.employee_id) if a.employee_id else None,
                "alertType": a.alert_type,
                "severity": a.severity,
                "message": a.message,
                "dueDate": a.due_date.isoformat() if a.due_date else None,
                "acknowledgedAt": a.acknowledged_at.isoformat() if a.acknowledged_at else None,
                "resolvedAt": a.resolved_at.isoformat() if a.resolved_at else None,
                "createdAt": a.created_at.isoformat() if a.created_at else None,
            }
            for a in alerts
        ],
        "total": total,
        "page": page,
    }


@router.post("/{company_id}/alerts/{alert_id}/acknowledge")
async def acknowledge_alert(
    company_id: str,
    alert_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Acknowledge a compliance alert."""
    await get_company_member(user, company_id, db)

    result = await db.execute(
        select(ComplianceAlert).where(
            ComplianceAlert.id == uuid.UUID(alert_id),
            ComplianceAlert.company_id == uuid.UUID(company_id),
        )
    )
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.acknowledged_at = datetime.now(UTC)
    alert.acknowledged_by = uuid.UUID(user.user_id)
    await db.flush()
    return {"success": True}


@router.post("/{company_id}/alerts/{alert_id}/resolve")
async def resolve_alert(
    company_id: str,
    alert_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Resolve a compliance alert."""
    await get_company_member(user, company_id, db, roles=["owner", "admin", "hr_manager"])

    result = await db.execute(
        select(ComplianceAlert).where(
            ComplianceAlert.id == uuid.UUID(alert_id),
            ComplianceAlert.company_id == uuid.UUID(company_id),
        )
    )
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.resolved_at = datetime.now(UTC)
    alert.resolved_by = uuid.UUID(user.user_id)
    await db.flush()
    return {"success": True}

"""
B2B Compliance reports router.
"""

import io
import uuid
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user
from app.models.company import AuditLog, ComplianceAlert, Employee
from app.routers.b2b.companies import get_company_member

router = APIRouter(prefix="/reports", tags=["b2b-reports"])


def _sanitize_csv(value: str) -> str:
    """Prevent CSV formula injection by prefixing dangerous characters."""
    if value and value[0] in ("=", "+", "-", "@", "\t", "\r"):
        return "'" + value
    return value


@router.get("/{company_id}/compliance-summary")
async def compliance_summary_report(
    company_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate compliance summary data for reporting."""
    await get_company_member(user, company_id, db, roles=["owner", "admin", "hr_manager"])
    cid = uuid.UUID(company_id)
    now = datetime.now(UTC)

    # Employees by permit type
    result = await db.execute(
        select(Employee.permit_type, func.count())
        .where(Employee.company_id == cid, Employee.status == "active")
        .group_by(Employee.permit_type)
    )
    by_permit = {row[0] or "None": row[1] for row in result.all()}

    # Employees by department
    result = await db.execute(
        select(Employee.department, func.count())
        .where(Employee.company_id == cid, Employee.status == "active")
        .group_by(Employee.department)
    )
    by_department = {row[0] or "Unassigned": row[1] for row in result.all()}

    # Upcoming expirations
    windows = [
        ("next_30_days", 30),
        ("next_60_days", 60),
        ("next_90_days", 90),
        ("next_180_days", 180),
    ]
    upcoming = {}
    for label, days in windows:
        count = (
            await db.execute(
                select(func.count())
                .select_from(Employee)
                .where(
                    Employee.company_id == cid,
                    Employee.status == "active",
                    Employee.permit_expiry.isnot(None),
                    Employee.permit_expiry <= now + timedelta(days=days),
                    Employee.permit_expiry > now,
                )
            )
        ).scalar() or 0
        upcoming[label] = count

    # Alert history (last 30 days)
    recent_alerts = (
        await db.execute(
            select(func.count())
            .select_from(ComplianceAlert)
            .where(
                ComplianceAlert.company_id == cid,
                ComplianceAlert.created_at >= now - timedelta(days=30),
            )
        )
    ).scalar() or 0

    resolved_alerts = (
        await db.execute(
            select(func.count())
            .select_from(ComplianceAlert)
            .where(
                ComplianceAlert.company_id == cid,
                ComplianceAlert.created_at >= now - timedelta(days=30),
                ComplianceAlert.resolved_at.isnot(None),
            )
        )
    ).scalar() or 0

    return {
        "generatedAt": now.isoformat(),
        "byPermitType": by_permit,
        "byDepartment": by_department,
        "upcomingExpirations": upcoming,
        "alertsLast30Days": recent_alerts,
        "resolvedLast30Days": resolved_alerts,
    }


@router.get("/{company_id}/export-csv")
async def export_employees_csv(
    company_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Export employees as CSV."""
    await get_company_member(user, company_id, db, roles=["owner", "admin", "hr_manager"])
    cid = uuid.UUID(company_id)

    result = await db.execute(
        select(Employee).where(Employee.company_id == cid).order_by(Employee.last_name, Employee.first_name)
    )
    employees = result.scalars().all()

    # Build CSV
    output = io.StringIO()
    output.write(
        "First Name,Last Name,Email,Nationality,Permit Type,Permit Number,Permit Expiry,Department,Position,Status\n"
    )
    for e in employees:
        row = [
            e.first_name,
            e.last_name,
            e.email or "",
            e.nationality or "",
            e.permit_type or "",
            e.permit_number or "",
            e.permit_expiry.strftime("%Y-%m-%d") if e.permit_expiry else "",
            e.department or "",
            e.position or "",
            e.status,
        ]
        output.write(",".join(f'"{_sanitize_csv(v)}"' for v in row) + "\n")

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=employees_{company_id[:8]}.csv"},
    )


@router.get("/{company_id}/audit-log")
async def get_audit_log(
    company_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get company audit log."""
    await get_company_member(user, company_id, db, roles=["owner", "admin"])
    cid = uuid.UUID(company_id)

    query = select(AuditLog).where(AuditLog.company_id == cid).order_by(AuditLog.created_at.desc())

    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar() or 0
    query = query.offset((page - 1) * limit).limit(limit)

    result = await db.execute(query)
    logs = result.scalars().all()

    return {
        "logs": [
            {
                "id": str(link.id),
                "actorId": str(link.actor_id),
                "action": link.action,
                "entityType": link.entity_type,
                "entityId": link.entity_id,
                "details": link.details,
                "createdAt": link.created_at.isoformat() if link.created_at else None,
            }
            for link in logs
        ],
        "total": total,
        "page": page,
    }

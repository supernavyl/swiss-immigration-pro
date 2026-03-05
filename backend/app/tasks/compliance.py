"""
Compliance check background tasks.
"""

from datetime import UTC

from app.celery_app import celery


@celery.task(name="app.tasks.compliance.check_all_compliance")
def check_all_compliance():
    """
    Daily task to check all employee permit expirations
    and generate compliance alerts.
    Runs synchronously in Celery worker context.
    """
    import asyncio

    asyncio.run(_check_compliance_async())


async def _check_compliance_async():
    from datetime import datetime, timedelta

    from sqlalchemy import select
    from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

    from app.config import get_settings
    from app.models.company import ComplianceAlert, Employee

    settings = get_settings()
    engine = create_async_engine(settings.database_url)
    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    alert_windows = [
        (90, "low"),
        (60, "medium"),
        (30, "high"),
        (14, "critical"),
        (7, "critical"),
    ]

    async with session_factory() as db:
        try:
            now = datetime.now(UTC)

            for days, severity in alert_windows:
                cutoff = now + timedelta(days=days)

                # Find employees with permits expiring within window
                result = await db.execute(
                    select(Employee).where(
                        Employee.permit_expiry <= cutoff,
                        Employee.permit_expiry > now,
                        Employee.status == "active",
                    )
                )
                employees = result.scalars().all()

                for emp in employees:
                    # Check if alert already exists for this employee/window
                    existing = await db.execute(
                        select(ComplianceAlert).where(
                            ComplianceAlert.employee_id == emp.id,
                            ComplianceAlert.alert_type == "permit_expiry",
                            ComplianceAlert.due_date == emp.permit_expiry,
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
                        message=(
                            f"Permit for {emp.first_name} {emp.last_name} "
                            f"expires in {days_left} days ({emp.permit_type})"
                        ),
                        due_date=emp.permit_expiry,
                    )
                    db.add(alert)

            await db.commit()
        except Exception as e:
            await db.rollback()
            raise e
        finally:
            await engine.dispose()

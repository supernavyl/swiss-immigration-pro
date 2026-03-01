"""
B2B Employee management router.
"""

import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user
from app.models.company import AuditLog, Company, Employee
from app.routers.b2b.companies import get_company_member
from app.schemas import CamelModel

router = APIRouter(prefix="/employees", tags=["b2b-employees"])


# --- Schemas ---
class CreateEmployeeRequest(CamelModel):
    first_name: str
    last_name: str
    email: str | None = None
    nationality: str | None = None
    permit_type: str | None = None
    permit_number: str | None = None
    permit_expiry: str | None = None
    employment_start: str | None = None
    department: str | None = None
    position: str | None = None
    notes: str | None = None


class UpdateEmployeeRequest(CamelModel):
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    nationality: str | None = None
    permit_type: str | None = None
    permit_number: str | None = None
    permit_expiry: str | None = None
    employment_start: str | None = None
    department: str | None = None
    position: str | None = None
    status: str | None = None
    notes: str | None = None


# --- Endpoints ---
@router.get("/{company_id}")
async def list_employees(
    company_id: str,
    search: str | None = Query(None),
    permit_type: str | None = Query(None, alias="permitType"),
    status: str | None = Query(None),
    department: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List employees with filters."""
    await get_company_member(user, company_id, db)

    query = select(Employee).where(Employee.company_id == uuid.UUID(company_id))

    if search:
        query = query.where(
            or_(
                Employee.first_name.ilike(f"%{search}%"),
                Employee.last_name.ilike(f"%{search}%"),
                Employee.email.ilike(f"%{search}%"),
            )
        )
    if permit_type:
        query = query.where(Employee.permit_type == permit_type)
    if status:
        query = query.where(Employee.status == status)
    if department:
        query = query.where(Employee.department == department)

    # Count
    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar() or 0

    # Paginate
    query = query.order_by(Employee.last_name, Employee.first_name)
    query = query.offset((page - 1) * limit).limit(limit)

    result = await db.execute(query)
    employees = result.scalars().all()

    return {
        "employees": [_serialize_employee(e) for e in employees],
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
    }


@router.post("/{company_id}")
async def create_employee(
    company_id: str,
    body: CreateEmployeeRequest,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Add a new employee."""
    await get_company_member(user, company_id, db, roles=["owner", "admin", "hr_manager"])

    # Check employee limit
    company = (await db.execute(select(Company).where(Company.id == uuid.UUID(company_id)))).scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    emp_count = (
        await db.execute(
            select(func.count()).select_from(Employee).where(
                Employee.company_id == company.id,
                Employee.status == "active",
            )
        )
    ).scalar() or 0

    if emp_count >= company.max_employees:
        raise HTTPException(
            status_code=400,
            detail=f"Employee limit reached ({company.max_employees}). Upgrade your plan to add more.",
        )

    employee = Employee(
        company_id=uuid.UUID(company_id),
        first_name=body.first_name,
        last_name=body.last_name,
        email=body.email,
        nationality=body.nationality,
        permit_type=body.permit_type,
        permit_number=body.permit_number,
        permit_expiry=datetime.fromisoformat(body.permit_expiry) if body.permit_expiry else None,
        employment_start=datetime.fromisoformat(body.employment_start) if body.employment_start else None,
        department=body.department,
        position=body.position,
        notes=body.notes,
    )
    db.add(employee)
    await db.flush()

    db.add(AuditLog(
        company_id=uuid.UUID(company_id),
        actor_id=uuid.UUID(user.user_id),
        action="created",
        entity_type="employee",
        entity_id=str(employee.id),
        details={"name": f"{body.first_name} {body.last_name}"},
    ))

    await db.flush()
    return {"success": True, "employeeId": str(employee.id)}


@router.get("/{company_id}/{employee_id}")
async def get_employee(
    company_id: str,
    employee_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get employee details."""
    await get_company_member(user, company_id, db)

    result = await db.execute(
        select(Employee).where(
            Employee.id == uuid.UUID(employee_id),
            Employee.company_id == uuid.UUID(company_id),
        )
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    return _serialize_employee(employee)


@router.put("/{company_id}/{employee_id}")
async def update_employee(
    company_id: str,
    employee_id: str,
    body: UpdateEmployeeRequest,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an employee."""
    await get_company_member(user, company_id, db, roles=["owner", "admin", "hr_manager"])

    result = await db.execute(
        select(Employee).where(
            Employee.id == uuid.UUID(employee_id),
            Employee.company_id == uuid.UUID(company_id),
        )
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    fields = {
        "first_name": "first_name",
        "last_name": "last_name",
        "email": "email",
        "nationality": "nationality",
        "permit_type": "permit_type",
        "permit_number": "permit_number",
        "department": "department",
        "position": "position",
        "status": "status",
        "notes": "notes",
    }

    for body_field, model_field in fields.items():
        val = getattr(body, body_field, None)
        if val is not None:
            setattr(employee, model_field, val)

    if body.permit_expiry is not None:
        employee.permit_expiry = datetime.fromisoformat(body.permit_expiry) if body.permit_expiry else None
    if body.employment_start is not None:
        employee.employment_start = datetime.fromisoformat(body.employment_start) if body.employment_start else None

    db.add(AuditLog(
        company_id=uuid.UUID(company_id),
        actor_id=uuid.UUID(user.user_id),
        action="updated",
        entity_type="employee",
        entity_id=str(employee.id),
    ))

    await db.flush()
    return {"success": True}


@router.delete("/{company_id}/{employee_id}")
async def delete_employee(
    company_id: str,
    employee_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete an employee record."""
    await get_company_member(user, company_id, db, roles=["owner", "admin"])

    result = await db.execute(
        select(Employee).where(
            Employee.id == uuid.UUID(employee_id),
            Employee.company_id == uuid.UUID(company_id),
        )
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    db.add(AuditLog(
        company_id=uuid.UUID(company_id),
        actor_id=uuid.UUID(user.user_id),
        action="deleted",
        entity_type="employee",
        entity_id=str(employee.id),
        details={"name": f"{employee.first_name} {employee.last_name}"},
    ))

    await db.delete(employee)
    await db.flush()
    return {"success": True}


def _serialize_employee(e: Employee) -> dict:
    return {
        "id": str(e.id),
        "firstName": e.first_name,
        "lastName": e.last_name,
        "email": e.email,
        "nationality": e.nationality,
        "permitType": e.permit_type,
        "permitNumber": e.permit_number,
        "permitExpiry": e.permit_expiry.isoformat() if e.permit_expiry else None,
        "employmentStart": e.employment_start.isoformat() if e.employment_start else None,
        "department": e.department,
        "position": e.position,
        "status": e.status,
        "notes": e.notes,
        "createdAt": e.created_at.isoformat() if e.created_at else None,
        "updatedAt": e.updated_at.isoformat() if e.updated_at else None,
    }

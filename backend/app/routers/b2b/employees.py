"""
B2B Employee management router.

Manages employees within a company, including CRUD operations,
bulk CSV import, and permit expiry tracking.
"""

import csv
import io
import logging
import uuid
from datetime import UTC, date, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
from pydantic import EmailStr
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user
from app.models.company import AuditLog, Company, Employee
from app.routers.b2b.companies import get_company_member
from app.schemas import CamelModel

logger = logging.getLogger(__name__)

DbSession = Annotated[AsyncSession, Depends(get_db)]
AuthUser = Annotated[CurrentUser, Depends(get_current_user)]

router = APIRouter(prefix="/companies", tags=["b2b-employees"])

WRITE_ROLES = ["owner", "admin", "hr_manager"]
DELETE_ROLES = ["owner", "admin"]

VALID_PERMIT_TYPES = {"B", "C", "L", "G", "S"}
VALID_STATUSES = {"active", "inactive"}


# --- Schemas ---
class CreateEmployeeRequest(CamelModel):
    """Schema for adding a new employee."""

    full_name: str
    email: EmailStr | None = None
    nationality: str | None = None
    permit_type: str | None = None
    permit_number: str | None = None
    permit_expiry: date | None = None
    permit_issued: date | None = None
    department: str | None = None
    canton: str | None = None
    notes: str | None = None


class UpdateEmployeeRequest(CamelModel):
    """Schema for updating an existing employee."""

    full_name: str | None = None
    email: EmailStr | None = None
    nationality: str | None = None
    permit_type: str | None = None
    permit_number: str | None = None
    permit_expiry: date | None = None
    permit_issued: date | None = None
    department: str | None = None
    canton: str | None = None
    status: str | None = None
    notes: str | None = None


class EmployeeResponse(CamelModel):
    """Serialized employee response."""

    id: str
    company_id: str
    first_name: str
    last_name: str
    full_name: str
    email: str | None = None
    nationality: str | None = None
    permit_type: str | None = None
    permit_number: str | None = None
    permit_expiry: date | None = None
    permit_issued: date | None = None
    department: str | None = None
    canton: str | None = None
    position: str | None = None
    status: str
    notes: str | None = None
    created_at: str | None = None
    updated_at: str | None = None


class EmployeeListResponse(CamelModel):
    """Paginated list of employees."""

    employees: list[EmployeeResponse]
    total: int
    page: int
    pages: int


class BulkImportResult(CamelModel):
    """Result of a bulk CSV import."""

    imported: int
    skipped: int
    errors: list[str]


# --- Helpers ---
def _split_full_name(full_name: str) -> tuple[str, str]:
    """Split a full name into first and last name."""
    parts = full_name.strip().split(maxsplit=1)
    first_name = parts[0]
    last_name = parts[1] if len(parts) > 1 else ""
    return first_name, last_name


def _serialize_employee(e: Employee) -> dict[str, str | None]:
    """Convert an Employee ORM instance to a camelCase dict."""
    return {
        "id": str(e.id),
        "companyId": str(e.company_id),
        "firstName": e.first_name,
        "lastName": e.last_name,
        "fullName": f"{e.first_name} {e.last_name}".strip(),
        "email": e.email,
        "nationality": e.nationality,
        "permitType": e.permit_type,
        "permitNumber": e.permit_number,
        "permitExpiry": e.permit_expiry.date().isoformat() if e.permit_expiry else None,
        "permitIssued": e.permit_issued.date().isoformat() if e.permit_issued else None,
        "department": e.department,
        "canton": e.canton,
        "position": e.position,
        "status": e.status,
        "notes": e.notes,
        "createdAt": e.created_at.isoformat() if e.created_at else None,
        "updatedAt": e.updated_at.isoformat() if e.updated_at else None,
    }


def _validate_permit_type(permit_type: str | None) -> None:
    """Raise HTTPException if permit type is invalid."""
    if permit_type and permit_type.upper() not in VALID_PERMIT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid permit type '{permit_type}'. Must be one of: {', '.join(sorted(VALID_PERMIT_TYPES))}",
        )


def _validate_status(status: str | None) -> None:
    """Raise HTTPException if status is invalid."""
    if status and status not in VALID_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{status}'. Must be one of: {', '.join(sorted(VALID_STATUSES))}",
        )


async def _get_company_or_404(db: AsyncSession, company_id: str) -> Company:
    """Fetch a company by ID or raise 404."""
    result = await db.execute(select(Company).where(Company.id == uuid.UUID(company_id)))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


async def _get_employee_or_404(
    db: AsyncSession,
    company_id: str,
    employee_id: str,
) -> Employee:
    """Fetch an employee by ID within a company, or raise 404."""
    result = await db.execute(
        select(Employee).where(
            Employee.id == uuid.UUID(employee_id),
            Employee.company_id == uuid.UUID(company_id),
        )
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


async def _count_active_employees(db: AsyncSession, company_id: uuid.UUID) -> int:
    """Count active employees for a company."""
    result = await db.execute(
        select(func.count())
        .select_from(Employee)
        .where(
            Employee.company_id == company_id,
            Employee.status == "active",
        )
    )
    return result.scalar() or 0


async def _enforce_employee_limit(
    db: AsyncSession,
    company: Company,
    count: int = 1,
) -> None:
    """Raise HTTPException if adding employees would exceed the plan limit."""
    current = await _count_active_employees(db, company.id)
    if current + count > company.max_employees:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Employee limit reached ({company.max_employees}). "
                f"Currently {current} active employees. "
                f"Upgrade your plan to add more."
            ),
        )


def _date_to_datetime(d: date | None) -> datetime | None:
    """Convert a date to a timezone-aware datetime for DB storage."""
    if d is None:
        return None
    return datetime(d.year, d.month, d.day, tzinfo=UTC)


# --- Endpoints ---


@router.get("/{company_id}/employees")
async def list_employees(
    company_id: str,
    user: AuthUser,
    db: DbSession,
    search: str | None = Query(None, description="Search by name or email"),
    permit_type: str | None = Query(None, alias="permitType"),
    status: str | None = Query(None),
    department: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
) -> dict:
    """List all employees for a company with optional filters and pagination."""
    await get_company_member(user, company_id, db)

    query = select(Employee).where(Employee.company_id == uuid.UUID(company_id))

    if search:
        pattern = f"%{search}%"
        query = query.where(
            or_(
                Employee.first_name.ilike(pattern),
                Employee.last_name.ilike(pattern),
                Employee.email.ilike(pattern),
            )
        )
    if permit_type:
        query = query.where(Employee.permit_type == permit_type.upper())
    if status:
        query = query.where(Employee.status == status)
    if department:
        query = query.where(Employee.department == department)

    # Total count
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
        "pages": max(1, (total + limit - 1) // limit),
    }


@router.post("/{company_id}/employees")
async def create_employee(
    company_id: str,
    body: CreateEmployeeRequest,
    user: AuthUser,
    db: DbSession,
) -> dict:
    """Add a new employee to a company. Enforces plan employee limits."""
    await get_company_member(user, company_id, db, roles=WRITE_ROLES)

    _validate_permit_type(body.permit_type)

    company = await _get_company_or_404(db, company_id)
    await _enforce_employee_limit(db, company)

    first_name, last_name = _split_full_name(body.full_name)

    employee = Employee(
        company_id=uuid.UUID(company_id),
        first_name=first_name,
        last_name=last_name,
        email=body.email,
        nationality=body.nationality,
        permit_type=body.permit_type.upper() if body.permit_type else None,
        permit_number=body.permit_number,
        permit_expiry=_date_to_datetime(body.permit_expiry),
        permit_issued=_date_to_datetime(body.permit_issued),
        department=body.department,
        canton=body.canton,
        notes=body.notes,
    )
    db.add(employee)
    await db.flush()

    db.add(
        AuditLog(
            company_id=uuid.UUID(company_id),
            actor_id=uuid.UUID(user.user_id),
            action="created",
            entity_type="employee",
            entity_id=str(employee.id),
            details={"name": body.full_name},
        )
    )

    await db.flush()
    return {"success": True, "employeeId": str(employee.id)}


@router.get("/{company_id}/employees/expiring")
async def list_expiring_permits(
    company_id: str,
    user: AuthUser,
    db: DbSession,
    days: int = Query(90, ge=1, le=365, description="Look-ahead window in days"),
) -> dict:
    """List employees with permits expiring within the next N days (default 90)."""
    await get_company_member(user, company_id, db)

    now = datetime.now(UTC)
    cutoff = now + timedelta(days=days)

    query = (
        select(Employee)
        .where(
            Employee.company_id == uuid.UUID(company_id),
            Employee.status == "active",
            Employee.permit_expiry.isnot(None),
            Employee.permit_expiry <= cutoff,
            Employee.permit_expiry > now,
        )
        .order_by(Employee.permit_expiry.asc())
    )

    result = await db.execute(query)
    employees = result.scalars().all()

    # Also count already-expired for context
    expired_count = (
        await db.execute(
            select(func.count())
            .select_from(Employee)
            .where(
                Employee.company_id == uuid.UUID(company_id),
                Employee.status == "active",
                Employee.permit_expiry.isnot(None),
                Employee.permit_expiry <= now,
            )
        )
    ).scalar() or 0

    return {
        "expiring": [_serialize_employee(e) for e in employees],
        "total": len(employees),
        "days": days,
        "alreadyExpired": expired_count,
    }


@router.get("/{company_id}/employees/{employee_id}")
async def get_employee(
    company_id: str,
    employee_id: str,
    user: AuthUser,
    db: DbSession,
) -> dict:
    """Get detailed information for a single employee."""
    await get_company_member(user, company_id, db)

    employee = await _get_employee_or_404(db, company_id, employee_id)
    return _serialize_employee(employee)


@router.put("/{company_id}/employees/{employee_id}")
async def update_employee(
    company_id: str,
    employee_id: str,
    body: UpdateEmployeeRequest,
    user: AuthUser,
    db: DbSession,
) -> dict:
    """Update an existing employee's information."""
    await get_company_member(user, company_id, db, roles=WRITE_ROLES)

    _validate_permit_type(body.permit_type)
    _validate_status(body.status)

    employee = await _get_employee_or_404(db, company_id, employee_id)

    if body.full_name is not None:
        first_name, last_name = _split_full_name(body.full_name)
        employee.first_name = first_name
        employee.last_name = last_name

    simple_fields: dict[str, str] = {
        "email": "email",
        "nationality": "nationality",
        "permit_number": "permit_number",
        "department": "department",
        "canton": "canton",
        "status": "status",
        "notes": "notes",
    }
    for body_field, model_field in simple_fields.items():
        val = getattr(body, body_field, None)
        if val is not None:
            setattr(employee, model_field, val)

    if body.permit_type is not None:
        employee.permit_type = body.permit_type.upper() if body.permit_type else None

    if body.permit_expiry is not None:
        employee.permit_expiry = _date_to_datetime(body.permit_expiry)

    if body.permit_issued is not None:
        employee.permit_issued = _date_to_datetime(body.permit_issued)

    db.add(
        AuditLog(
            company_id=uuid.UUID(company_id),
            actor_id=uuid.UUID(user.user_id),
            action="updated",
            entity_type="employee",
            entity_id=str(employee.id),
        )
    )

    await db.flush()
    return {"success": True}


@router.delete("/{company_id}/employees/{employee_id}")
async def delete_employee(
    company_id: str,
    employee_id: str,
    user: AuthUser,
    db: DbSession,
) -> dict:
    """Remove an employee record. Requires owner or admin role."""
    await get_company_member(user, company_id, db, roles=DELETE_ROLES)

    employee = await _get_employee_or_404(db, company_id, employee_id)

    db.add(
        AuditLog(
            company_id=uuid.UUID(company_id),
            actor_id=uuid.UUID(user.user_id),
            action="deleted",
            entity_type="employee",
            entity_id=str(employee.id),
            details={"name": f"{employee.first_name} {employee.last_name}"},
        )
    )

    await db.delete(employee)
    await db.flush()
    return {"success": True}


@router.post("/{company_id}/employees/import")
async def import_employees_csv(
    company_id: str,
    file: UploadFile,
    user: AuthUser,
    db: DbSession,
) -> dict:
    """
    Bulk import employees from a CSV file.

    Expected CSV columns (header row required):
        name, email, nationality, permit_type, permit_number,
        permit_expiry, department, canton

    - permit_expiry format: YYYY-MM-DD
    - permit_type: B, C, L, G, or S
    - Rows with errors are skipped and reported in the response.
    """
    await get_company_member(user, company_id, db, roles=WRITE_ROLES)

    company = await _get_company_or_404(db, company_id)

    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a .csv file")

    # Read file content
    try:
        raw = await file.read()
        content = raw.decode("utf-8-sig")  # Handle BOM from Excel exports
    except UnicodeDecodeError as exc:
        raise HTTPException(status_code=400, detail="File must be UTF-8 encoded") from exc

    reader = csv.DictReader(io.StringIO(content))

    if not reader.fieldnames:
        raise HTTPException(status_code=400, detail="CSV file is empty or has no header row")

    # Normalize header names (strip whitespace, lowercase)
    normalized_headers = {h.strip().lower().replace(" ", "_"): h for h in reader.fieldnames}

    # Require at minimum a name column
    name_col = normalized_headers.get("name") or normalized_headers.get("full_name")
    if not name_col:
        raise HTTPException(
            status_code=400,
            detail="CSV must have a 'name' or 'full_name' column",
        )

    rows = list(reader)
    if not rows:
        raise HTTPException(status_code=400, detail="CSV file contains no data rows")

    # Enforce employee limit upfront
    await _enforce_employee_limit(db, company, count=len(rows))

    imported = 0
    skipped = 0
    errors: list[str] = []

    for row_num, row in enumerate(rows, start=2):  # Row 1 is headers
        try:
            # Normalize keys
            normalized_row = {k.strip().lower().replace(" ", "_"): v.strip() if v else "" for k, v in row.items()}

            full_name = normalized_row.get("name") or normalized_row.get("full_name", "")
            if not full_name:
                errors.append(f"Row {row_num}: missing name")
                skipped += 1
                continue

            first_name, last_name = _split_full_name(full_name)

            # Parse optional permit_expiry
            permit_expiry_raw = normalized_row.get("permit_expiry", "")
            permit_expiry_dt: datetime | None = None
            if permit_expiry_raw:
                try:
                    parsed_date = date.fromisoformat(permit_expiry_raw)
                    permit_expiry_dt = _date_to_datetime(parsed_date)
                except ValueError:
                    errors.append(f"Row {row_num}: invalid permit_expiry '{permit_expiry_raw}', expected YYYY-MM-DD")
                    skipped += 1
                    continue

            # Validate permit_type
            raw_permit = normalized_row.get("permit_type", "")
            permit_type: str | None = None
            if raw_permit:
                permit_type = raw_permit.upper()
                if permit_type not in VALID_PERMIT_TYPES:
                    errors.append(
                        f"Row {row_num}: invalid permit_type '{raw_permit}'. "
                        f"Must be one of: {', '.join(sorted(VALID_PERMIT_TYPES))}"
                    )
                    skipped += 1
                    continue

            employee = Employee(
                company_id=company.id,
                first_name=first_name,
                last_name=last_name,
                email=normalized_row.get("email") or None,
                nationality=normalized_row.get("nationality") or None,
                permit_type=permit_type,
                permit_number=normalized_row.get("permit_number") or None,
                permit_expiry=permit_expiry_dt,
                department=normalized_row.get("department") or None,
                canton=normalized_row.get("canton") or None,
            )
            db.add(employee)
            imported += 1

        except Exception as exc:
            logger.warning("CSV import row %d error: %s", row_num, exc)
            errors.append(f"Row {row_num}: {exc}")
            skipped += 1

    if imported > 0:
        await db.flush()

        db.add(
            AuditLog(
                company_id=company.id,
                actor_id=uuid.UUID(user.user_id),
                action="bulk_imported",
                entity_type="employee",
                details={"imported": imported, "skipped": skipped},
            )
        )
        await db.flush()

    return {
        "success": True,
        "imported": imported,
        "skipped": skipped,
        "errors": errors,
    }

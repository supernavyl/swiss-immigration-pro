"""
B2B Company management router.
"""

import uuid
from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user
from app.models.company import AuditLog, Company, CompanyMember, Employee
from app.schemas import CamelModel

DbSession = Annotated[AsyncSession, Depends(get_db)]
AuthUser = Annotated[CurrentUser, Depends(get_current_user)]

router = APIRouter(prefix="/companies", tags=["b2b-companies"])


# --- Schemas ---
class CreateCompanyRequest(CamelModel):
    name: str
    domain: str | None = None
    canton: str | None = None
    industry: str | None = None
    billing_email: EmailStr


class UpdateCompanyRequest(CamelModel):
    name: str | None = None
    domain: str | None = None
    canton: str | None = None
    industry: str | None = None
    billing_email: str | None = None


class InviteMemberRequest(BaseModel):
    email: EmailStr
    role: str = "viewer"


# --- Helpers ---
async def get_company_member(
    user: CurrentUser,
    company_id: str,
    db: AsyncSession,
    roles: list[str] | None = None,
) -> CompanyMember:
    """Get and validate company membership."""
    result = await db.execute(
        select(CompanyMember).where(
            CompanyMember.company_id == uuid.UUID(company_id),
            CompanyMember.user_id == uuid.UUID(user.user_id),
        )
    )
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=403, detail="Not a member of this company")
    if roles and member.role not in roles:
        raise HTTPException(status_code=403, detail=f"Requires role: {', '.join(roles)}")
    return member


# --- Endpoints ---
@router.post("")
async def create_company(
    body: CreateCompanyRequest,
    user: AuthUser,
    db: DbSession,
):
    """Create a new company and set current user as owner."""
    company = Company(
        name=body.name,
        domain=body.domain,
        canton=body.canton,
        industry=body.industry,
        billing_email=body.billing_email,
    )
    db.add(company)
    await db.flush()

    # Add creator as owner
    member = CompanyMember(
        company_id=company.id,
        user_id=uuid.UUID(user.user_id),
        role="owner",
        accepted_at=datetime.now(UTC),
    )
    db.add(member)

    # Audit log
    db.add(
        AuditLog(
            company_id=company.id,
            actor_id=uuid.UUID(user.user_id),
            action="created",
            entity_type="company",
            entity_id=str(company.id),
            details={"name": body.name},
        )
    )

    await db.flush()
    return {"success": True, "companyId": str(company.id)}


@router.get("")
async def list_companies(
    user: AuthUser,
    db: DbSession,
):
    """List all companies the current user belongs to."""
    result = await db.execute(
        select(Company)
        .join(CompanyMember, CompanyMember.company_id == Company.id)
        .where(CompanyMember.user_id == uuid.UUID(user.user_id))
    )
    companies = result.scalars().all()

    return [
        {
            "id": str(c.id),
            "name": c.name,
            "domain": c.domain,
            "canton": c.canton,
            "industry": c.industry,
            "planId": c.plan_id,
            "isActive": c.is_active,
            "createdAt": c.created_at.isoformat() if c.created_at else None,
        }
        for c in companies
    ]


@router.get("/{company_id}")
async def get_company(
    company_id: str,
    user: AuthUser,
    db: DbSession,
):
    """Get company details."""
    await get_company_member(user, company_id, db)

    result = await db.execute(select(Company).where(Company.id == uuid.UUID(company_id)))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # Count employees
    emp_count = (
        await db.execute(select(func.count()).select_from(Employee).where(Employee.company_id == company.id))
    ).scalar() or 0

    # Count members
    member_count = (
        await db.execute(select(func.count()).select_from(CompanyMember).where(CompanyMember.company_id == company.id))
    ).scalar() or 0

    return {
        "id": str(company.id),
        "name": company.name,
        "domain": company.domain,
        "canton": company.canton,
        "industry": company.industry,
        "billingEmail": company.billing_email,
        "planId": company.plan_id,
        "maxEmployees": company.max_employees,
        "isActive": company.is_active,
        "employeeCount": emp_count,
        "memberCount": member_count,
        "createdAt": company.created_at.isoformat() if company.created_at else None,
    }


@router.put("/{company_id}")
async def update_company(
    company_id: str,
    body: UpdateCompanyRequest,
    user: AuthUser,
    db: DbSession,
):
    """Update company details (owner/admin only)."""
    await get_company_member(user, company_id, db, roles=["owner", "admin"])

    result = await db.execute(select(Company).where(Company.id == uuid.UUID(company_id)))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    if body.name is not None:
        company.name = body.name
    if body.domain is not None:
        company.domain = body.domain
    if body.canton is not None:
        company.canton = body.canton
    if body.industry is not None:
        company.industry = body.industry
    if body.billing_email is not None:
        company.billing_email = body.billing_email

    db.add(
        AuditLog(
            company_id=company.id,
            actor_id=uuid.UUID(user.user_id),
            action="updated",
            entity_type="company",
            entity_id=str(company.id),
        )
    )

    await db.flush()
    return {"success": True}


@router.get("/{company_id}/members")
async def list_members(
    company_id: str,
    user: AuthUser,
    db: DbSession,
):
    """List company members."""
    await get_company_member(user, company_id, db)

    result = await db.execute(select(CompanyMember).where(CompanyMember.company_id == uuid.UUID(company_id)))
    members = result.scalars().all()

    return [
        {
            "id": str(m.id),
            "userId": str(m.user_id),
            "role": m.role,
            "invitedEmail": m.invited_email,
            "acceptedAt": m.accepted_at.isoformat() if m.accepted_at else None,
            "createdAt": m.created_at.isoformat() if m.created_at else None,
        }
        for m in members
    ]


@router.post("/{company_id}/members")
async def invite_member(
    company_id: str,
    body: InviteMemberRequest,
    user: AuthUser,
    db: DbSession,
):
    """Invite a new member to the company (owner/admin only)."""
    await get_company_member(user, company_id, db, roles=["owner", "admin"])

    if body.role not in ["admin", "hr_manager", "viewer"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    # Check if user exists
    from app.models.user import User

    result = await db.execute(select(User).where(User.email == body.email))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        # Check not already member
        existing_member = await db.execute(
            select(CompanyMember).where(
                CompanyMember.company_id == uuid.UUID(company_id),
                CompanyMember.user_id == existing_user.id,
            )
        )
        if existing_member.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="User is already a member")

        member = CompanyMember(
            company_id=uuid.UUID(company_id),
            user_id=existing_user.id,
            role=body.role,
            invited_email=body.email,
            accepted_at=datetime.now(UTC),
        )
    else:
        # Create pending invite (user_id will be a placeholder)
        member = CompanyMember(
            company_id=uuid.UUID(company_id),
            user_id=uuid.UUID(user.user_id),  # placeholder, updated on accept
            role=body.role,
            invited_email=body.email,
        )

    db.add(member)

    db.add(
        AuditLog(
            company_id=uuid.UUID(company_id),
            actor_id=uuid.UUID(user.user_id),
            action="invited",
            entity_type="member",
            details={"email": body.email, "role": body.role},
        )
    )

    await db.flush()
    return {"success": True, "message": f"Invitation sent to {body.email}"}


@router.delete("/{company_id}/members/{member_id}")
async def remove_member(
    company_id: str,
    member_id: str,
    user: AuthUser,
    db: DbSession,
):
    """Remove a member from the company (owner only)."""
    await get_company_member(user, company_id, db, roles=["owner"])

    result = await db.execute(
        select(CompanyMember).where(
            CompanyMember.id == uuid.UUID(member_id),
            CompanyMember.company_id == uuid.UUID(company_id),
        )
    )
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    if member.role == "owner":
        raise HTTPException(status_code=400, detail="Cannot remove the owner")

    await db.delete(member)
    await db.flush()
    return {"success": True}

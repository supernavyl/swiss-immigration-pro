"""
Marketplace lead referral router.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user, get_optional_user
from app.models.marketplace import AgencyProfile, LawyerProfile, LeadReferral
from app.schemas import CamelModel

router = APIRouter(prefix="/referrals", tags=["marketplace-referrals"])

# Platform referral fee (15%)
PLATFORM_FEE_PERCENT = 15


class CreateReferralRequest(CamelModel):
    provider_id: str
    provider_type: str  # "lawyer" or "agency"
    listing_id: str | None = None
    email: str | None = None
    name: str | None = None
    message: str | None = None
    source: str = "marketplace"  # marketplace, quiz, chatbot, calculator


@router.post("")
async def create_referral(
    body: CreateReferralRequest,
    user: CurrentUser | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a lead referral to a provider (from user tools or marketplace)."""
    referral = LeadReferral(
        listing_id=uuid.UUID(body.listing_id) if body.listing_id else None,
        user_id=uuid.UUID(user.user_id) if user else None,
        provider_id=uuid.UUID(body.provider_id),
        provider_type=body.provider_type,
        user_email=body.email or (user.email if user else None),
        user_name=body.name,
        message=body.message,
        source=body.source,
        status="pending",
    )
    db.add(referral)
    await db.flush()
    return {"success": True, "referralId": str(referral.id)}


@router.get("/provider")
async def get_provider_referrals(
    status: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get referrals for the logged-in provider."""
    uid = uuid.UUID(user.user_id)

    # Find provider profile
    stmt = select(LawyerProfile).where(LawyerProfile.user_id == uid)
    lawyer = (await db.execute(stmt)).scalar_one_or_none()
    stmt = select(AgencyProfile).where(AgencyProfile.user_id == uid)
    agency = (await db.execute(stmt)).scalar_one_or_none()

    if not lawyer and not agency:
        raise HTTPException(status_code=403, detail="Not a registered provider")

    provider_id = lawyer.id if lawyer else agency.id

    query = select(LeadReferral).where(LeadReferral.provider_id == provider_id)
    if status:
        query = query.where(LeadReferral.status == status)

    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar() or 0
    query = query.order_by(LeadReferral.created_at.desc())
    query = query.offset((page - 1) * limit).limit(limit)

    result = await db.execute(query)
    referrals = result.scalars().all()

    return {
        "referrals": [
            {
                "id": str(r.id),
                "userEmail": r.user_email,
                "userName": r.user_name,
                "message": r.message,
                "source": r.source,
                "status": r.status,
                "referralFee": r.referral_fee,
                "createdAt": r.created_at.isoformat() if r.created_at else None,
            }
            for r in referrals
        ],
        "total": total,
        "page": page,
    }


@router.post("/{referral_id}/accept")
async def accept_referral(
    referral_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Accept a lead referral."""
    uid = uuid.UUID(user.user_id)
    stmt = select(LeadReferral).where(
        LeadReferral.id == uuid.UUID(referral_id),
    )
    referral = (await db.execute(stmt)).scalar_one_or_none()
    if not referral:
        raise HTTPException(status_code=404, detail="Referral not found")

    # Verify ownership
    stmt = select(LawyerProfile).where(
        LawyerProfile.user_id == uid,
        LawyerProfile.id == referral.provider_id,
    )
    lawyer = (await db.execute(stmt)).scalar_one_or_none()
    stmt = select(AgencyProfile).where(
        AgencyProfile.user_id == uid,
        AgencyProfile.id == referral.provider_id,
    )
    agency = (await db.execute(stmt)).scalar_one_or_none()

    if not lawyer and not agency:
        raise HTTPException(status_code=403, detail="Not your referral")

    referral.status = "accepted"
    await db.flush()
    return {"success": True}


@router.post("/{referral_id}/complete")
async def complete_referral(
    referral_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mark a referral as completed."""
    uid = uuid.UUID(user.user_id)
    stmt = select(LeadReferral).where(
        LeadReferral.id == uuid.UUID(referral_id),
    )
    referral = (await db.execute(stmt)).scalar_one_or_none()
    if not referral:
        raise HTTPException(status_code=404, detail="Referral not found")

    stmt = select(LawyerProfile).where(
        LawyerProfile.user_id == uid,
        LawyerProfile.id == referral.provider_id,
    )
    lawyer = (await db.execute(stmt)).scalar_one_or_none()
    stmt = select(AgencyProfile).where(
        AgencyProfile.user_id == uid,
        AgencyProfile.id == referral.provider_id,
    )
    agency = (await db.execute(stmt)).scalar_one_or_none()

    if not lawyer and not agency:
        raise HTTPException(status_code=403, detail="Not your referral")

    referral.status = "completed"
    await db.flush()
    return {"success": True}

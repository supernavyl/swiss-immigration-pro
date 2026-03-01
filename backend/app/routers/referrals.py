"""
User referral system endpoints.
"""

import logging
import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user
from app.models.user import Profile, Referral

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/referral", tags=["referral"])


def _generate_referral_code() -> str:
    return secrets.token_urlsafe(6)


@router.get("/code")
async def get_referral_code(
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get or generate the current user's referral code."""
    result = await db.execute(select(Profile).where(Profile.id == user.user_id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if not profile.referral_code:
        code = _generate_referral_code()
        # Ensure uniqueness
        while True:
            existing = await db.execute(select(Profile).where(Profile.referral_code == code))
            if not existing.scalar_one_or_none():
                break
            code = _generate_referral_code()

        profile.referral_code = code
        await db.commit()

    return {
        "referralCode": profile.referral_code,
        "referralLink": f"/auth/register?ref={profile.referral_code}",
    }


@router.get("/stats")
async def get_referral_stats(
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get referral statistics for the current user."""
    total_result = await db.execute(
        select(func.count()).select_from(Referral).where(Referral.referrer_id == user.user_id)
    )
    total = total_result.scalar() or 0

    converted_result = await db.execute(
        select(func.count())
        .select_from(Referral)
        .where(Referral.referrer_id == user.user_id)
        .where(Referral.status.in_(["converted", "rewarded"]))
    )
    converted = converted_result.scalar() or 0

    return {
        "totalReferrals": total,
        "convertedReferrals": converted,
    }


@router.post("/validate/{code}")
async def validate_referral_code(
    code: str,
    db: AsyncSession = Depends(get_db),
):
    """Validate a referral code (public, no auth required)."""
    result = await db.execute(select(Profile).where(Profile.referral_code == code))
    profile = result.scalar_one_or_none()

    if not profile:
        raise HTTPException(status_code=404, detail="Invalid referral code")

    return {"valid": True, "referrerName": profile.full_name or "A Swiss Immigration Pro member"}

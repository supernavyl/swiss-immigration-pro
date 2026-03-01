"""
Marketplace reviews router.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user
from app.models.marketplace import AgencyProfile, LawyerProfile, Review
from app.schemas import CamelModel

router = APIRouter(prefix="/reviews", tags=["marketplace-reviews"])


class CreateReviewRequest(CamelModel):
    provider_id: str
    provider_type: str  # "lawyer" or "agency"
    rating: int  # 1-5
    comment: str | None = None


@router.get("/{provider_type}/{provider_id}")
async def get_reviews(
    provider_type: str,
    provider_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """Get reviews for a provider (public)."""
    query = select(Review).where(
        Review.provider_id == uuid.UUID(provider_id),
        Review.provider_type == provider_type,
        Review.is_approved == True,  # noqa: E712
    )

    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar() or 0
    avg_rating = (
        await db.execute(
            select(func.avg(Review.rating)).where(
                Review.provider_id == uuid.UUID(provider_id),
                Review.provider_type == provider_type,
                Review.is_approved == True,  # noqa: E712
            )
        )
    ).scalar()

    query = query.order_by(Review.created_at.desc())
    query = query.offset((page - 1) * limit).limit(limit)

    result = await db.execute(query)
    reviews = result.scalars().all()

    return {
        "reviews": [
            {
                "id": str(r.id),
                "rating": r.rating,
                "comment": r.comment,
                "createdAt": r.created_at.isoformat() if r.created_at else None,
            }
            for r in reviews
        ],
        "total": total,
        "averageRating": round(float(avg_rating), 1) if avg_rating else 0,
        "page": page,
    }


@router.post("")
async def create_review(
    body: CreateReviewRequest,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a review for a provider."""
    if body.rating < 1 or body.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    # Check if user already reviewed this provider
    existing = await db.execute(
        select(Review).where(
            Review.provider_id == uuid.UUID(body.provider_id),
            Review.provider_type == body.provider_type,
            Review.user_id == uuid.UUID(user.user_id),
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="You have already reviewed this provider")

    review = Review(
        provider_id=uuid.UUID(body.provider_id),
        provider_type=body.provider_type,
        user_id=uuid.UUID(user.user_id),
        rating=body.rating,
        comment=body.comment,
    )
    db.add(review)
    await db.flush()

    # Update provider rating
    avg_result = await db.execute(
        select(func.avg(Review.rating), func.count()).where(
            Review.provider_id == uuid.UUID(body.provider_id),
            Review.provider_type == body.provider_type,
            Review.is_approved == True,  # noqa: E712
        )
    )
    row = avg_result.first()
    avg_rating = float(row[0]) if row[0] else 0
    count = row[1] or 0

    if body.provider_type == "lawyer":
        stmt = select(LawyerProfile).where(
            LawyerProfile.id == uuid.UUID(body.provider_id),
        )
        provider = (await db.execute(stmt)).scalar_one_or_none()
        if provider:
            provider.rating = avg_rating
            provider.review_count = count
    elif body.provider_type == "agency":
        stmt = select(AgencyProfile).where(
            AgencyProfile.id == uuid.UUID(body.provider_id),
        )
        provider = (await db.execute(stmt)).scalar_one_or_none()
        if provider:
            provider.rating = avg_rating
            provider.review_count = count

    await db.flush()
    return {"success": True, "reviewId": str(review.id)}

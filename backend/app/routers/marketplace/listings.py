"""
Marketplace service listings router.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user
from app.models.marketplace import AgencyProfile, LawyerProfile, ServiceListing
from app.schemas import CamelModel

router = APIRouter(prefix="/listings", tags=["marketplace-listings"])


class CreateListingRequest(CamelModel):
    title: str
    description: str | None = None
    price: int | None = None
    price_type: str = "fixed"
    category: str


class UpdateListingRequest(CamelModel):
    title: str | None = None
    description: str | None = None
    price: int | None = None
    price_type: str | None = None
    is_active: bool | None = None


@router.get("")
async def list_services(
    category: str | None = Query(None),
    canton: str | None = Query(None),
    price_max: int | None = Query(None, alias="priceMax"),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """List active service listings (public)."""
    query = select(ServiceListing).where(ServiceListing.is_active == True)  # noqa: E712

    if category:
        query = query.where(ServiceListing.category == category)
    if price_max:
        query = query.where(ServiceListing.price <= price_max)
    if search:
        query = query.where(
            or_(
                ServiceListing.title.ilike(f"%{search}%"),
                ServiceListing.description.ilike(f"%{search}%"),
            )
        )

    count_q = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_q)).scalar() or 0
    query = query.order_by(ServiceListing.created_at.desc())
    query = query.offset((page - 1) * limit).limit(limit)

    result = await db.execute(query)
    listings = result.scalars().all()

    # Enrich with provider info
    enriched = []
    for link in listings:
        data = _serialize_listing(link)
        if link.provider_type == "lawyer":
            stmt = select(LawyerProfile).where(LawyerProfile.id == link.provider_id)
            provider = (await db.execute(stmt)).scalar_one_or_none()
            if provider:
                data["providerName"] = provider.firm_name
                data["providerSlug"] = provider.slug
                data["providerVerified"] = provider.verified
                data["providerRating"] = provider.rating
        elif link.provider_type == "agency":
            stmt = select(AgencyProfile).where(AgencyProfile.id == link.provider_id)
            provider = (await db.execute(stmt)).scalar_one_or_none()
            if provider:
                data["providerName"] = provider.agency_name
                data["providerSlug"] = provider.slug
                data["providerVerified"] = provider.verified
                data["providerRating"] = provider.rating
        enriched.append(data)

    return {"listings": enriched, "total": total, "page": page}


@router.post("")
async def create_listing(
    body: CreateListingRequest,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a service listing (provider only)."""
    uid = uuid.UUID(user.user_id)

    # Find provider profile
    stmt = select(LawyerProfile).where(LawyerProfile.user_id == uid)
    lawyer = (await db.execute(stmt)).scalar_one_or_none()
    stmt = select(AgencyProfile).where(AgencyProfile.user_id == uid)
    agency = (await db.execute(stmt)).scalar_one_or_none()

    if not lawyer and not agency:
        raise HTTPException(
            status_code=403,
            detail="You must be a registered provider to create listings",
        )

    provider_id = lawyer.id if lawyer else agency.id
    provider_type = "lawyer" if lawyer else "agency"

    listing = ServiceListing(
        provider_id=provider_id,
        provider_type=provider_type,
        title=body.title,
        description=body.description,
        price=body.price,
        price_type=body.price_type,
        category=body.category,
    )
    db.add(listing)
    await db.flush()
    return {"success": True, "listingId": str(listing.id)}


@router.put("/{listing_id}")
async def update_listing(
    listing_id: str,
    body: UpdateListingRequest,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a listing (owner only)."""
    uid = uuid.UUID(user.user_id)
    stmt = select(ServiceListing).where(
        ServiceListing.id == uuid.UUID(listing_id),
    )
    listing = (await db.execute(stmt)).scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    # Verify ownership
    stmt = select(LawyerProfile).where(
        LawyerProfile.user_id == uid,
        LawyerProfile.id == listing.provider_id,
    )
    lawyer = (await db.execute(stmt)).scalar_one_or_none()
    stmt = select(AgencyProfile).where(
        AgencyProfile.user_id == uid,
        AgencyProfile.id == listing.provider_id,
    )
    agency = (await db.execute(stmt)).scalar_one_or_none()

    if not lawyer and not agency:
        raise HTTPException(status_code=403, detail="Not your listing")

    if body.title is not None:
        listing.title = body.title
    if body.description is not None:
        listing.description = body.description
    if body.price is not None:
        listing.price = body.price
    if body.price_type is not None:
        listing.price_type = body.price_type
    if body.is_active is not None:
        listing.is_active = body.is_active

    await db.flush()
    return {"success": True}


@router.delete("/{listing_id}")
async def delete_listing(
    listing_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a listing."""
    uid = uuid.UUID(user.user_id)
    stmt = select(ServiceListing).where(
        ServiceListing.id == uuid.UUID(listing_id),
    )
    listing = (await db.execute(stmt)).scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    stmt = select(LawyerProfile).where(
        LawyerProfile.user_id == uid,
        LawyerProfile.id == listing.provider_id,
    )
    lawyer = (await db.execute(stmt)).scalar_one_or_none()
    stmt = select(AgencyProfile).where(
        AgencyProfile.user_id == uid,
        AgencyProfile.id == listing.provider_id,
    )
    agency = (await db.execute(stmt)).scalar_one_or_none()

    if not lawyer and not agency:
        raise HTTPException(status_code=403, detail="Not your listing")

    await db.delete(listing)
    await db.flush()
    return {"success": True}


def _serialize_listing(link: ServiceListing) -> dict:
    return {
        "id": str(link.id),
        "providerId": str(link.provider_id),
        "providerType": link.provider_type,
        "title": link.title,
        "description": link.description,
        "price": link.price,
        "priceType": link.price_type,
        "category": link.category,
        "isActive": link.is_active,
        "createdAt": link.created_at.isoformat() if link.created_at else None,
    }

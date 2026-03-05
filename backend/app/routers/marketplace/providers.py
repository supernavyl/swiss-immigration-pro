"""
Marketplace provider (lawyer/agency) management router.
"""

import re
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user
from app.models.marketplace import AgencyProfile, LawyerProfile
from app.schemas import CamelModel

router = APIRouter(prefix="/providers", tags=["marketplace-providers"])


# --- Schemas ---
class ApplyLawyerRequest(CamelModel):
    firm_name: str
    specializations: list[str] = []
    cantons_served: list[str] = []
    languages: list[str] = []
    hourly_rate: int | None = None
    bio: str | None = None
    website: str | None = None
    phone: str | None = None
    address: str | None = None


class ApplyAgencyRequest(CamelModel):
    agency_name: str
    services: list[str] = []
    regions: list[str] = []
    languages: list[str] = []
    bio: str | None = None
    website: str | None = None
    phone: str | None = None


def make_slug(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug + "-" + uuid.uuid4().hex[:6]


# --- Public endpoints ---
@router.get("/lawyers")
async def list_lawyers(
    canton: str | None = Query(None),
    specialization: str | None = Query(None),
    language: str | None = Query(None),
    search: str | None = Query(None),
    featured: bool = Query(False),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """List verified lawyers (public)."""
    query = select(LawyerProfile).where(
        LawyerProfile.is_active == True,  # noqa: E712
        LawyerProfile.verified == True,  # noqa: E712
    )

    if canton:
        query = query.where(LawyerProfile.cantons_served.contains([canton]))
    if specialization:
        query = query.where(LawyerProfile.specializations.contains([specialization]))
    if language:
        query = query.where(LawyerProfile.languages.contains([language]))
    if search:
        query = query.where(
            or_(
                LawyerProfile.firm_name.ilike(f"%{search}%"),
                LawyerProfile.bio.ilike(f"%{search}%"),
            )
        )
    if featured:
        query = query.where(LawyerProfile.is_featured == True)  # noqa: E712

    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar() or 0

    query = query.order_by(
        LawyerProfile.is_featured.desc(),
        LawyerProfile.rating.desc(),
        LawyerProfile.review_count.desc(),
    )
    query = query.offset((page - 1) * limit).limit(limit)

    result = await db.execute(query)
    lawyers = result.scalars().all()

    return {
        "providers": [_serialize_lawyer(link) for link in lawyers],
        "total": total,
        "page": page,
    }


@router.get("/agencies")
async def list_agencies(
    region: str | None = Query(None),
    service: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """List verified agencies (public)."""
    query = select(AgencyProfile).where(
        AgencyProfile.is_active == True,  # noqa: E712
        AgencyProfile.verified == True,  # noqa: E712
    )

    if region:
        query = query.where(AgencyProfile.regions.contains([region]))
    if service:
        query = query.where(AgencyProfile.services.contains([service]))

    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar() or 0

    query = query.order_by(AgencyProfile.rating.desc())
    query = query.offset((page - 1) * limit).limit(limit)

    result = await db.execute(query)
    agencies = result.scalars().all()

    return {
        "providers": [_serialize_agency(a) for a in agencies],
        "total": total,
        "page": page,
    }


@router.get("/lawyers/{slug}")
async def get_lawyer(slug: str, db: AsyncSession = Depends(get_db)):
    """Get a lawyer profile by slug (public)."""
    result = await db.execute(
        select(LawyerProfile).where(LawyerProfile.slug == slug, LawyerProfile.is_active == True)  # noqa: E712
    )
    lawyer = result.scalar_one_or_none()
    if not lawyer:
        raise HTTPException(status_code=404, detail="Lawyer not found")
    return _serialize_lawyer(lawyer)


@router.get("/agencies/{slug}")
async def get_agency(slug: str, db: AsyncSession = Depends(get_db)):
    """Get an agency profile by slug (public)."""
    result = await db.execute(
        select(AgencyProfile).where(AgencyProfile.slug == slug, AgencyProfile.is_active == True)  # noqa: E712
    )
    agency = result.scalar_one_or_none()
    if not agency:
        raise HTTPException(status_code=404, detail="Agency not found")
    return _serialize_agency(agency)


# --- Provider application ---
@router.post("/apply/lawyer")
async def apply_as_lawyer(
    body: ApplyLawyerRequest,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Apply to be listed as a lawyer."""
    # Check if already a provider
    existing = await db.execute(select(LawyerProfile).where(LawyerProfile.user_id == uuid.UUID(user.user_id)))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="You already have a lawyer profile")

    profile = LawyerProfile(
        user_id=uuid.UUID(user.user_id),
        firm_name=body.firm_name,
        slug=make_slug(body.firm_name),
        specializations=body.specializations,
        cantons_served=body.cantons_served,
        languages=body.languages,
        hourly_rate=body.hourly_rate,
        bio=body.bio,
        website=body.website,
        phone=body.phone,
        address=body.address,
        verified=False,  # Requires admin verification
    )
    db.add(profile)
    await db.flush()
    return {"success": True, "profileId": str(profile.id), "slug": profile.slug}


@router.post("/apply/agency")
async def apply_as_agency(
    body: ApplyAgencyRequest,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Apply to be listed as an agency."""
    existing = await db.execute(select(AgencyProfile).where(AgencyProfile.user_id == uuid.UUID(user.user_id)))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="You already have an agency profile")

    profile = AgencyProfile(
        user_id=uuid.UUID(user.user_id),
        agency_name=body.agency_name,
        slug=make_slug(body.agency_name),
        services=body.services,
        regions=body.regions,
        languages=body.languages,
        bio=body.bio,
        website=body.website,
        phone=body.phone,
        verified=False,
    )
    db.add(profile)
    await db.flush()
    return {"success": True, "profileId": str(profile.id), "slug": profile.slug}


# --- Provider dashboard ---
@router.get("/me")
async def get_my_profile(
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current user's provider profile."""
    uid = uuid.UUID(user.user_id)

    lawyer = (await db.execute(select(LawyerProfile).where(LawyerProfile.user_id == uid))).scalar_one_or_none()
    if lawyer:
        return {"type": "lawyer", "profile": _serialize_lawyer(lawyer)}

    agency = (await db.execute(select(AgencyProfile).where(AgencyProfile.user_id == uid))).scalar_one_or_none()
    if agency:
        return {"type": "agency", "profile": _serialize_agency(agency)}

    return {"type": None, "profile": None}


def _serialize_lawyer(link: LawyerProfile) -> dict:
    return {
        "id": str(link.id),
        "firmName": link.firm_name,
        "slug": link.slug,
        "specializations": link.specializations,
        "cantonsServed": link.cantons_served,
        "languages": link.languages,
        "hourlyRate": link.hourly_rate,
        "bio": link.bio,
        "photoUrl": link.photo_url,
        "website": link.website,
        "phone": link.phone,
        "address": link.address,
        "verified": link.verified,
        "rating": link.rating,
        "reviewCount": link.review_count,
        "isFeatured": link.is_featured,
        "type": "lawyer",
    }


def _serialize_agency(a: AgencyProfile) -> dict:
    return {
        "id": str(a.id),
        "agencyName": a.agency_name,
        "slug": a.slug,
        "services": a.services,
        "regions": a.regions,
        "languages": a.languages,
        "bio": a.bio,
        "photoUrl": a.photo_url,
        "website": a.website,
        "phone": a.phone,
        "verified": a.verified,
        "rating": a.rating,
        "reviewCount": a.review_count,
        "type": "agency",
    }

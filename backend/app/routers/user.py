import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user
from app.models.content import ChatMessage
from app.models.user import Profile, UserLimit
from app.schemas import CamelModel

router = APIRouter(prefix="/api/user", tags=["user"])


class UpdateProfileRequest(CamelModel):
    full_name: str | None = None
    language: str | None = None


class SaveLayerRequest(BaseModel):
    layer: str  # eu, us, other


@router.get("/profile")
async def get_profile(
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Profile).where(Profile.id == uuid.UUID(user.user_id)))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return {
        "id": str(profile.id),
        "email": profile.email,
        "fullName": profile.full_name,
        "packId": profile.pack_id,
        "isAdmin": profile.is_admin,
        "metadata": profile.metadata_,
        "createdAt": profile.created_at.isoformat() if profile.created_at else None,
    }


@router.put("/profile")
async def update_profile(
    body: UpdateProfileRequest,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Profile).where(Profile.id == uuid.UUID(user.user_id)))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if body.full_name is not None:
        profile.full_name = body.full_name
    if body.language is not None:
        meta = profile.metadata_ or {}
        meta["language"] = body.language
        profile.metadata_ = meta

    await db.flush()
    return {"success": True}


@router.post("/save-layer")
async def save_layer(
    body: SaveLayerRequest,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if body.layer not in ("eu", "us", "other"):
        raise HTTPException(status_code=400, detail="Invalid layer. Must be eu, us, or other.")

    result = await db.execute(select(Profile).where(Profile.id == uuid.UUID(user.user_id)))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    meta = profile.metadata_ or {}
    meta["selected_layer"] = body.layer
    profile.metadata_ = meta
    await db.flush()

    return {"success": True, "layer": body.layer}


@router.get("/messages")
async def get_messages(
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.user_id == uuid.UUID(user.user_id))
        .order_by(ChatMessage.created_at.desc())
        .limit(10)
    )
    messages = result.scalars().all()

    return [
        {
            "id": str(m.id),
            "message": m.message,
            "response": m.response,
            "createdAt": m.created_at.isoformat() if m.created_at else None,
        }
        for m in messages
    ]


@router.get("/limits")
async def get_limits(
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(UserLimit).where(UserLimit.user_id == uuid.UUID(user.user_id)))
    limits = result.scalar_one_or_none()

    result2 = await db.execute(select(Profile).where(Profile.id == uuid.UUID(user.user_id)))
    profile = result2.scalar_one_or_none()

    return {
        "packId": profile.pack_id if profile else "free",
        "messagesToday": limits.messages_today if limits else 0,
    }

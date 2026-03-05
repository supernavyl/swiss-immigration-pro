import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user
from app.models.content import CvTemplate, UserCv
from app.schemas import CamelModel

router = APIRouter(prefix="/api/cv", tags=["cv"])


class SaveCvRequest(CamelModel):
    cv_data: dict
    name: str
    cv_id: str | None = None


@router.get("/templates")
async def get_templates(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CvTemplate).where(CvTemplate.is_active == True))  # noqa: E712
    templates = result.scalars().all()
    return [
        {
            "id": str(t.id),
            "name": t.name,
            "category": t.category,
            "description": t.description,
            "template_data": t.template_data,
        }
        for t in templates
    ]


@router.post("/save")
async def save_cv(
    body: SaveCvRequest,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user_uuid = uuid.UUID(user.user_id)

    if body.cv_id:
        # Update existing
        result = await db.execute(select(UserCv).where(UserCv.id == uuid.UUID(body.cv_id), UserCv.user_id == user_uuid))
        cv = result.scalar_one_or_none()
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")
        cv.cv_data = body.cv_data
        cv.name = body.name
    else:
        # Create new
        cv = UserCv(user_id=user_uuid, name=body.name, cv_data=body.cv_data)
        db.add(cv)

    await db.flush()
    return {"success": True, "id": str(cv.id)}


@router.get("/list")
async def list_cvs(
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UserCv).where(UserCv.user_id == uuid.UUID(user.user_id)).order_by(UserCv.updated_at.desc())
    )
    cvs = result.scalars().all()
    return [
        {
            "id": str(c.id),
            "name": c.name,
            "cv_data": c.cv_data,
            "created_at": c.created_at.isoformat() if c.created_at else None,
            "updated_at": c.updated_at.isoformat() if c.updated_at else None,
        }
        for c in cvs
    ]


@router.get("/{cv_id}")
async def get_cv(
    cv_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UserCv).where(UserCv.id == uuid.UUID(cv_id), UserCv.user_id == uuid.UUID(user.user_id))
    )
    cv = result.scalar_one_or_none()
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")

    return {
        "id": str(cv.id),
        "name": cv.name,
        "cv_data": cv.cv_data,
        "created_at": cv.created_at.isoformat() if cv.created_at else None,
        "updated_at": cv.updated_at.isoformat() if cv.updated_at else None,
    }


@router.delete("/{cv_id}")
async def delete_cv(
    cv_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UserCv).where(UserCv.id == uuid.UUID(cv_id), UserCv.user_id == uuid.UUID(user.user_id))
    )
    cv = result.scalar_one_or_none()
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")

    await db.delete(cv)
    return {"success": True}

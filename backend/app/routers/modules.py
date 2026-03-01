import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user
from app.middleware.paywall import check_module_access, get_required_pack_for_module
from app.models.content import MasterclassProgress
from app.schemas import CamelModel

router = APIRouter(prefix="/api/modules", tags=["modules"])


class ProgressUpdateRequest(CamelModel):
    module_id: str
    section_id: str | None = None
    completed: bool = False


@router.post("/progress")
async def update_progress(
    body: ProgressUpdateRequest,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    check_module_access(user, body.module_id)
    user_uuid = uuid.UUID(user.user_id)

    # Get existing progress
    result = await db.execute(
        select(MasterclassProgress).where(
            MasterclassProgress.user_id == user_uuid,
            MasterclassProgress.module_id == body.module_id,
        )
    )
    progress = result.scalar_one_or_none()

    if progress:
        metadata = progress.metadata_ or {}
        sections = metadata.get("completed_sections", [])

        if body.section_id:
            if body.completed and body.section_id not in sections:
                sections.append(body.section_id)
            elif not body.completed and body.section_id in sections:
                sections.remove(body.section_id)

        metadata["completed_sections"] = sections
        progress.metadata_ = metadata
        progress.progress_percent = len(sections) * 10  # rough estimate

        if body.completed and not progress.completed_at:
            progress.completed_at = datetime.now(UTC)
    else:
        sections = [body.section_id] if body.section_id and body.completed else []
        progress = MasterclassProgress(
            user_id=user_uuid,
            module_id=body.module_id,
            progress_percent=len(sections) * 10,
            metadata_={"completed_sections": sections},
            completed_at=datetime.now(UTC) if body.completed else None,
        )
        db.add(progress)

    await db.flush()

    return {
        "success": True,
        "progress": progress.progress_percent,
        "sections": (progress.metadata_ or {}).get("completed_sections", []),
        "completed": progress.completed_at is not None,
        "completedAt": progress.completed_at.isoformat() if progress.completed_at else None,
    }


@router.get("/{module_id}/access")
async def check_access(
    module_id: str,
    user: CurrentUser = Depends(get_current_user),
):
    """Check if the current user can access a module. Returns 200 if allowed, 403 if not."""
    required = get_required_pack_for_module(module_id)
    check_module_access(user, module_id)
    return {
        "allowed": True,
        "moduleId": module_id,
        "requiredPack": required,
        "userPack": user.pack_id,
    }


@router.get("/progress")
async def get_progress(
    module_id: str = Query(..., alias="moduleId"),
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    check_module_access(user, module_id)
    result = await db.execute(
        select(MasterclassProgress).where(
            MasterclassProgress.user_id == uuid.UUID(user.user_id),
            MasterclassProgress.module_id == module_id,
        )
    )
    progress = result.scalar_one_or_none()

    if not progress:
        return {"progress": 0, "sections": [], "completed": False, "completedAt": None}

    return {
        "progress": progress.progress_percent,
        "sections": (progress.metadata_ or {}).get("completed_sections", []),
        "completed": progress.completed_at is not None,
        "completedAt": progress.completed_at.isoformat() if progress.completed_at else None,
    }

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.content import LiveStat

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("")
async def get_live_stats(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(LiveStat)
        .where(LiveStat.is_active == True)  # noqa: E712
        .order_by(LiveStat.display_order)
    )
    stats = result.scalars().all()

    return [
        {
            "id": str(s.id),
            "key": s.stat_key,
            "label": s.stat_label,
            "value": s.stat_value,
            "source": s.stat_source,
        }
        for s in stats
    ]

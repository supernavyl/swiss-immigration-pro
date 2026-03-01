import hashlib
import hmac
import logging

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, EmailStr
from sqlalchemy import select, update
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.middleware.auth import CurrentUser, require_admin
from app.models.content import EmailLead
from app.services.email_service import send_newsletter_email, send_newsletter_welcome_email

router = APIRouter(prefix="/api/newsletter", tags=["newsletter"])
settings = get_settings()
logger = logging.getLogger(__name__)


def _generate_unsub_token(email: str) -> str:
    return hmac.new(settings.secret_key.encode(), email.encode(), hashlib.sha256).hexdigest()[:32]


def _verify_unsub_token(email: str, token: str) -> bool:
    expected = _generate_unsub_token(email)
    return hmac.compare_digest(expected, token)


def generate_unsubscribe_url(email: str) -> str:
    token = _generate_unsub_token(email)
    return f"{settings.app_url}/api/newsletter/unsubscribe?email={email}&token={token}"


class SubscribeRequest(BaseModel):
    email: EmailStr


class UnsubscribeRequest(BaseModel):
    email: EmailStr


class SendNewsletterRequest(BaseModel):
    subject: str
    content: str


@router.post("/subscribe")
async def subscribe(body: SubscribeRequest, db: AsyncSession = Depends(get_db)):
    stmt = pg_insert(EmailLead).values(email=body.email, source="newsletter", subscribed=True)
    stmt = stmt.on_conflict_do_update(
        index_elements=["email"],
        set_={"subscribed": True, "source": "newsletter"},
    )
    await db.execute(stmt)
    await db.flush()

    try:
        await send_newsletter_welcome_email(body.email)
    except Exception:
        logger.warning("Failed to send newsletter welcome to %s", body.email, exc_info=True)

    return {"success": True, "message": "Successfully subscribed"}


@router.post("/unsubscribe")
async def unsubscribe_post(body: UnsubscribeRequest, db: AsyncSession = Depends(get_db)):
    await db.execute(update(EmailLead).where(EmailLead.email == body.email).values(subscribed=False))
    return {"success": True, "message": "Successfully unsubscribed"}


@router.get("/unsubscribe")
async def unsubscribe_get(
    email: str = Query(...),
    token: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    if not _verify_unsub_token(email, token):
        raise HTTPException(403, "Invalid or expired unsubscribe link")
    await db.execute(update(EmailLead).where(EmailLead.email == email).values(subscribed=False))
    return {"success": True, "message": "Successfully unsubscribed"}


# Admin subscribers endpoint (for admin panel)
# Registered as separate router in main.py for /api/admin/newsletter/subscribers path
admin_subscribers_router = APIRouter(prefix="/api/admin/newsletter", tags=["admin-newsletter"])


@admin_subscribers_router.get("/subscribers", dependencies=[Depends(require_admin)])
async def get_admin_subscribers(db: AsyncSession = Depends(get_db)):
    """Get all newsletter subscribers for admin panel"""
    try:
        result = await db.execute(select(EmailLead).order_by(EmailLead.created_at.desc()))
        subscribers = result.scalars().all()

        # Format response
        subscriber_list = [
            {
                "id": str(sub.id) if hasattr(sub, "id") else "",
                "email": sub.email,
                "source": sub.source or "unknown",
                "subscribed": sub.subscribed,
                "created_at": sub.created_at.isoformat() if sub.created_at else "",
                "unsubscribed_at": sub.unsubscribed_at.isoformat() if sub.unsubscribed_at else None,
                "lead_magnet": getattr(sub, "lead_magnet", None),
            }
            for sub in subscribers
        ]

        return {
            "success": True,
            "subscribers": subscriber_list,
            "total": len(subscriber_list),
        }
    except Exception as e:
        logger.error("Error fetching subscribers: %s", str(e), exc_info=True)
        raise HTTPException(500, f"Failed to fetch subscribers: {str(e)}")


@router.post("/send")
async def send_newsletter(
    body: SendNewsletterRequest,
    admin: CurrentUser = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(EmailLead).where(EmailLead.subscribed == True))  # noqa: E712
    subscribers = result.scalars().all()

    sent_count = 0
    for sub in subscribers:
        unsub_link = generate_unsubscribe_url(sub.email)
        try:
            await send_newsletter_email(sub.email, body.subject, body.content, unsub_link)
            sent_count += 1
        except Exception:
            logger.warning("Failed to send newsletter to %s", sub.email, exc_info=True)
            continue

    return {"success": True, "sent": sent_count, "total": len(subscribers)}

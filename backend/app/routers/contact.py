import html
import logging

from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models.content import EmailLead
from app.schemas import CamelModel
from app.services.email_service import send_email, send_newsletter_welcome_email

router = APIRouter(prefix="/api", tags=["contact"])
settings = get_settings()
logger = logging.getLogger(__name__)


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class EmailCaptureRequest(CamelModel):
    email: EmailStr
    source: str = "website"
    lead_magnet: str | None = None
    name: str | None = None
    download_id: str | None = None
    download_name: str | None = None


@router.post("/contact")
async def contact(body: ContactRequest):
    safe_name = html.escape(body.name)
    safe_email = html.escape(body.email)
    safe_subject = html.escape(body.subject)
    safe_message = html.escape(body.message)

    admin_html = f"""
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> {safe_name}</p>
    <p><strong>Email:</strong> {safe_email}</p>
    <p><strong>Subject:</strong> {safe_subject}</p>
    <p><strong>Message:</strong></p>
    <p>{safe_message}</p>
    """

    await send_email(settings.admin_email, f"Contact Form: {safe_subject}", admin_html)

    confirm_html = f"""
    <p>Hello {safe_name},</p>
    <p>Thank you for reaching out! We've received your message and will get back to you within 24-48 hours.</p>
    <p>Best regards,<br>{settings.app_firm}</p>
    """
    await send_email(body.email, "We Received Your Message - Swiss Immigration Pro", confirm_html)

    return {"success": True, "message": "Message sent successfully"}


@router.post("/email/capture")
async def email_capture(body: EmailCaptureRequest, db: AsyncSession = Depends(get_db)):
    stmt = pg_insert(EmailLead).values(
        email=body.email, source=body.source, lead_magnet=body.lead_magnet, subscribed=True
    )
    stmt = stmt.on_conflict_do_update(
        index_elements=["email"],
        set_={"source": body.source},
    )
    await db.execute(stmt)
    return {"success": True}


@router.post("/email-capture")
async def email_capture_alt(body: EmailCaptureRequest, db: AsyncSession = Depends(get_db)):
    """Alternative endpoint for backwards compatibility."""
    stmt = pg_insert(EmailLead).values(
        email=body.email, source="website", lead_magnet=body.lead_magnet, subscribed=True
    )
    stmt = stmt.on_conflict_do_update(
        index_elements=["email"],
        set_={"source": "website"},
    )
    await db.execute(stmt)

    try:
        await send_newsletter_welcome_email(body.email)
    except Exception:
        logger.warning("Failed to send newsletter welcome to %s", body.email, exc_info=True)

    return {"success": True}


@router.post("/downloads/capture")
async def downloads_capture(body: EmailCaptureRequest, db: AsyncSession = Depends(get_db)):
    stmt = pg_insert(EmailLead).values(
        email=body.email,
        source="download",
        lead_magnet=body.download_name or body.download_id,
        subscribed=True,
    )
    stmt = stmt.on_conflict_do_update(
        index_elements=["email"],
        set_={"lead_magnet": body.download_name or body.download_id},
    )
    await db.execute(stmt)

    try:
        await send_newsletter_welcome_email(body.email)
    except Exception:
        logger.warning("Failed to send newsletter welcome to %s", body.email, exc_info=True)

    return {"success": True}

import logging
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import MarketingCapture
from app.services.email_service import send_email

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/marketing", tags=["marketing"])


class EmailCaptureRequest(BaseModel):
    email: EmailStr
    source: str = "unknown"
    discount_code: str | None = None
    referrer: str | None = None


class EmailCaptureResponse(BaseModel):
    success: bool
    message: str


@router.post("/capture", response_model=EmailCaptureResponse)
async def capture_email(
    request: EmailCaptureRequest,
    db: AsyncSession = Depends(get_db),
) -> EmailCaptureResponse:
    """
    Capture email from marketing activities (exit intent, lead magnets, etc.)
    """
    try:
        # Check if email already exists in captures
        result = await db.execute(
            select(MarketingCapture).where(
                MarketingCapture.email == request.email,
                MarketingCapture.source == request.source,
            )
        )
        existing = result.scalar_one_or_none()

        if existing:
            # Update existing capture
            existing.capture_count += 1
            existing.last_captured_at = datetime.now(UTC)
            if request.discount_code and not existing.discount_code:
                existing.discount_code = request.discount_code
        else:
            # Create new capture
            capture = MarketingCapture(
                email=request.email,
                source=request.source,
                discount_code=request.discount_code,
                referrer=request.referrer,
                captured_at=datetime.now(UTC),
                last_captured_at=datetime.now(UTC),
                capture_count=1,
                converted=False,
            )
            db.add(capture)

        await db.commit()

        # Send welcome email with discount code
        if request.discount_code:
            await send_exit_intent_email(request.email, request.discount_code)
        else:
            await send_general_capture_email(request.email, request.source)

        logger.info(
            f"Email captured: {request.email} from {request.source}"
            + (f" with code {request.discount_code}" if request.discount_code else "")
        )

        return EmailCaptureResponse(
            success=True,
            message="Email captured successfully",
        )

    except Exception as e:
        logger.error(f"Email capture error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to capture email",
        ) from e


async def send_exit_intent_email(email: str, discount_code: str) -> None:
    """Send email with discount code for exit intent captures"""
    try:
        subject = f"Your {discount_code} Discount is Ready! 🎁"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 28px;">Your Exclusive Discount is Here!</h1>
            </div>

            <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; margin-bottom: 20px;">
                    Hi there! 👋
                </p>

                <p style="font-size: 16px; margin-bottom: 20px;">
                    Thanks for your interest in Swiss Immigration Pro. We're excited to help you on your journey to Switzerland!
                </p>

                <div style="background: #fef2f2; border: 2px dashed #dc2626; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Your Discount Code</p>
                    <p style="font-size: 36px; font-weight: bold; color: #dc2626; margin: 0; letter-spacing: 2px;">{discount_code}</p>
                    <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">Get 15% off your first 3 months</p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://swissimmigrationpro.com/pricing?discount={discount_code}"
                       style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        Claim My Discount
                    </a>
                </div>

                <div style="background: #f9fafb; border-left: 4px solid #dc2626; padding: 20px; margin: 30px 0; border-radius: 4px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #dc2626;">What You'll Get:</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">✓ Unlimited AI chatbot assistance</li>
                        <li style="margin-bottom: 10px;">✓ 25+ professional Swiss CV templates</li>
                        <li style="margin-bottom: 10px;">✓ Complete work permit checklists</li>
                        <li style="margin-bottom: 10px;">✓ Priority email support</li>
                        <li style="margin-bottom: 10px;">✓ And much more...</li>
                    </ul>
                </div>

                <p style="font-size: 14px; color: #666; margin-top: 30px;">
                    ⏰ <strong>This offer expires in 24 hours.</strong> Don't miss out on this exclusive discount!
                </p>

                <p style="font-size: 16px; margin-top: 30px;">
                    Ready to start your Swiss journey?
                </p>

                <p style="font-size: 16px; margin: 0;">
                    Best regards,<br>
                    <strong>The Swiss Immigration Pro Team</strong>
                </p>
            </div>

            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                <p style="margin: 5px 0;">Swiss Immigration Pro by Alpine Legal Partners</p>
                <p style="margin: 5px 0;">
                    <a href="https://swissimmigrationpro.com" style="color: #dc2626; text-decoration: none;">Visit our website</a> ·
                    <a href="https://swissimmigrationpro.com/pricing" style="color: #dc2626; text-decoration: none;">View plans</a>
                </p>
            </div>
        </body>
        </html>
        """

        await send_email(email, subject, html_content)
    except Exception as e:
        logger.error(f"Failed to send exit intent email to {email}: {e}", exc_info=True)


async def send_general_capture_email(email: str, source: str) -> None:
    """Send general welcome email for non-discount captures"""
    try:
        subject = "Welcome to Swiss Immigration Pro! 🇨🇭"
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 28px;">Welcome to Swiss Immigration Pro!</h1>
            </div>

            <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; margin-bottom: 20px;">
                    Hi there! 👋
                </p>

                <p style="font-size: 16px; margin-bottom: 20px;">
                    Thanks for your interest in Swiss Immigration Pro. We're here to make your Swiss immigration journey as smooth as possible.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://swissimmigrationpro.com/auth/register"
                       style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        Get Started Free
                    </a>
                </div>

                <div style="background: #f9fafb; border-left: 4px solid #dc2626; padding: 20px; margin: 30px 0; border-radius: 4px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #dc2626;">What You Can Do:</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">✓ Take our free eligibility quiz</li>
                        <li style="margin-bottom: 10px;">✓ Chat with our AI immigration assistant</li>
                        <li style="margin-bottom: 10px;">✓ Access free guide modules</li>
                        <li style="margin-bottom: 10px;">✓ Explore Swiss cantons & cities</li>
                    </ul>
                </div>

                <p style="font-size: 16px; margin-top: 30px;">
                    Ready to start your Swiss journey?
                </p>

                <p style="font-size: 16px; margin: 0;">
                    Best regards,<br>
                    <strong>The Swiss Immigration Pro Team</strong>
                </p>
            </div>

            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                <p style="margin: 5px 0;">Swiss Immigration Pro by Alpine Legal Partners</p>
                <p style="margin: 5px 0;">
                    <a href="https://swissimmigrationpro.com" style="color: #dc2626; text-decoration: none;">Visit our website</a>
                </p>
            </div>
        </body>
        </html>
        """

        await send_email(email, subject, html_content)
    except Exception as e:
        logger.error(f"Failed to send general capture email to {email}: {e}", exc_info=True)

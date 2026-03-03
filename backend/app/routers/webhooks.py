"""
Stripe webhook handler with signature verification.
"""

import logging
from datetime import UTC, datetime

import stripe as stripe_lib
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models.company import Company
from app.models.subscription import Payment, Subscription
from app.models.user import Profile
from app.services.email_service import (
    send_abandoned_checkout_email,
    send_consultation_confirmation_email,
    send_subscription_confirmation_email,
)

logger = logging.getLogger(__name__)
settings = get_settings()

PACK_DISPLAY_NAMES = {
    "immigration": "Immigration Pack",
    "advanced": "Advanced Pack",
    "citizenship": "Citizenship Pro",
}

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])


@router.post("/stripe")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle Stripe webhook events with signature verification."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing stripe-signature header")

    if not settings.stripe_webhook_secret:
        logger.error("STRIPE_WEBHOOK_SECRET not configured")
        raise HTTPException(status_code=500, detail="Webhook secret not configured")

    try:
        event = stripe_lib.Webhook.construct_event(payload, sig_header, settings.stripe_webhook_secret)
    except stripe_lib.error.SignatureVerificationError:
        logger.warning("Stripe webhook signature verification failed")
        raise HTTPException(status_code=400, detail="Invalid signature") from None
    except Exception as e:
        logger.error("Stripe webhook error: %s", e)
        raise HTTPException(status_code=400, detail="Webhook verification failed") from None

    event_type = event["type"]
    data = event["data"]["object"]

    logger.info("Stripe webhook: %s", event_type)

    email_task = None
    try:
        if event_type == "checkout.session.completed":
            email_task = await handle_checkout_completed(data, db)
        elif event_type == "checkout.session.expired":
            await handle_checkout_expired(data)
        elif event_type == "customer.subscription.updated":
            await handle_subscription_updated(data, db)
        elif event_type == "customer.subscription.deleted":
            await handle_subscription_deleted(data, db)
        elif event_type == "invoice.payment_failed":
            await handle_payment_failed(data, db)
        elif event_type == "charge.refunded":
            await handle_charge_refunded(data, db)
        else:
            logger.info("Unhandled Stripe event: %s", event_type)

        await db.flush()
    except Exception as e:
        logger.error("Error handling %s: %s", event_type, e, exc_info=True)
        raise HTTPException(status_code=500, detail="Webhook processing failed") from None

    # Send confirmation emails after successful commit (best-effort)
    if email_task:
        try:
            await _send_checkout_emails(email_task)
        except Exception as e:
            logger.error("Failed to send confirmation email: %s", e)

    return {"received": True}


async def _send_checkout_emails(task: dict):
    """Send confirmation emails based on checkout type."""
    email = task.get("customer_email")
    if not email:
        return

    session_type = task.get("session_type")
    if session_type == "subscription":
        pack_id = task.get("pack_id", "immigration")
        pack_name = PACK_DISPLAY_NAMES.get(pack_id, pack_id.title())
        amount = (task.get("amount", 0) or 0) / 100
        await send_subscription_confirmation_email(email, pack_name, amount)
    elif session_type == "consultation":
        consultation_id = task.get("consultation_id")
        await send_consultation_confirmation_email(email, consultation_id)


async def handle_checkout_expired(session: dict) -> None:
    """Handle expired (abandoned) checkout — send a recovery email with a discount code."""
    customer_email = session.get("customer_details", {}).get("email") or session.get("customer_email", "")
    metadata = session.get("metadata", {})
    pack_id = metadata.get("pack_id")

    pack_name: str | None = None
    if pack_id:
        pack_name = PACK_DISPLAY_NAMES.get(pack_id, pack_id.title())

    logger.info("Checkout expired (abandoned): email=%s pack=%s", customer_email, pack_id)

    if customer_email:
        try:
            await send_abandoned_checkout_email(customer_email, pack_name)
        except Exception as exc:  # best-effort — never fail the webhook
            logger.error("Failed to send abandoned checkout email: %s", exc)


async def handle_checkout_completed(session: dict, db: AsyncSession):
    """Handle successful checkout -- create/update subscription or record payment."""
    metadata = session.get("metadata", {})
    customer_email = session.get("customer_details", {}).get("email", "")
    customer_id = session.get("customer", "")
    session_type = metadata.get("type", "")

    # Find user by email, fallback to stripe_customer_id via Subscription
    profile = None
    if customer_email:
        result = await db.execute(select(Profile).where(Profile.email == customer_email))
        profile = result.scalar_one_or_none()

    if not profile and customer_id:
        result = await db.execute(
            select(Subscription).where(Subscription.stripe_customer_id == customer_id)
        )
        sub = result.scalar_one_or_none()
        if sub:
            result = await db.execute(select(Profile).where(Profile.id == sub.user_id))
            profile = result.scalar_one_or_none()

    if not profile:
        logger.warning(
            "Checkout completed but no profile found: email=%s customer=%s type=%s",
            customer_email, customer_id, session_type,
        )

    if session_type == "subscription":
        pack_id = metadata.get("pack_id", "immigration")
        subscription_id = session.get("subscription", "")

        if profile:
            # Update profile pack
            profile.pack_id = pack_id
            profile.pack_expires_at = None  # Subscription handles this

            # Create/update subscription record
            existing_sub = None
            if subscription_id:
                result = await db.execute(
                    select(Subscription).where(Subscription.stripe_subscription_id == subscription_id)
                )
                existing_sub = result.scalar_one_or_none()

            if existing_sub:
                existing_sub.status = "active"
                existing_sub.pack_id = pack_id
            else:
                sub = Subscription(
                    user_id=profile.id,
                    stripe_customer_id=customer_id,
                    stripe_subscription_id=subscription_id,
                    pack_id=pack_id,
                    status="active",
                    current_period_start=datetime.now(UTC),
                )
                db.add(sub)

        # Record payment
        if profile:
            amount = session.get("amount_total", 0)
            payment = Payment(
                user_id=profile.id,
                stripe_payment_intent_id=session.get("payment_intent"),
                pack_id=pack_id,
                amount=amount,
                currency=session.get("currency", "chf"),
                status="succeeded",
            )
            db.add(payment)

    elif session_type == "one_time":
        product_id = metadata.get("product_id", "")
        if profile:
            amount = session.get("amount_total", 0)
            payment = Payment(
                user_id=profile.id,
                stripe_payment_intent_id=session.get("payment_intent"),
                pack_id=product_id,
                amount=amount,
                currency=session.get("currency", "chf"),
                status="succeeded",
            )
            db.add(payment)

            # Grant product access in profile metadata
            current_meta = dict(profile.metadata_ or {})
            purchased = list(current_meta.get("purchased_products", []))
            if product_id and product_id not in purchased:
                purchased.append(product_id)
                current_meta["purchased_products"] = purchased
                profile.metadata_ = current_meta
            logger.info("One-time product access granted: user=%s product=%s", profile.id, product_id)

    elif session_type == "consultation":
        consultation_id = metadata.get("consultation_id")
        if consultation_id:
            from app.models.content import Consultation

            result = await db.execute(select(Consultation).where(Consultation.id == consultation_id))
            consultation = result.scalar_one_or_none()
            if consultation:
                consultation.status = "paid"
                consultation.stripe_payment_intent_id = session.get("payment_intent")

    elif session_type == "b2b_subscription":
        company_id = metadata.get("company_id")
        plan_id = metadata.get("plan_id", "b2b_starter")
        b2b_max = {"b2b_starter": 25, "b2b_business": 100, "b2b_enterprise": 10000}
        if company_id:
            result = await db.execute(select(Company).where(Company.id == company_id))
            company = result.scalar_one_or_none()
            if company:
                company.plan_id = plan_id
                company.max_employees = b2b_max.get(plan_id, 25)

    await db.flush()
    logger.info("Checkout completed: type=%s email=%s", session_type, customer_email)

    return {
        "customer_email": customer_email,
        "session_type": session_type,
        "pack_id": metadata.get("pack_id"),
        "amount": session.get("amount_total", 0),
        "consultation_id": metadata.get("consultation_id"),
    }


async def handle_subscription_updated(subscription: dict, db: AsyncSession):
    """Handle subscription changes (upgrade, downgrade, renewal)."""
    sub_id = subscription.get("id", "")
    status = subscription.get("status", "")

    result = await db.execute(select(Subscription).where(Subscription.stripe_subscription_id == sub_id))
    existing = result.scalar_one_or_none()

    if existing:
        existing.status = status
        if subscription.get("current_period_start"):
            existing.current_period_start = datetime.fromtimestamp(subscription["current_period_start"], tz=UTC)
        if subscription.get("current_period_end"):
            existing.current_period_end = datetime.fromtimestamp(subscription["current_period_end"], tz=UTC)

        # Update profile if subscription is active
        if status == "active":
            result = await db.execute(select(Profile).where(Profile.id == existing.user_id))
            profile = result.scalar_one_or_none()
            if profile:
                profile.pack_id = existing.pack_id

        await db.flush()
    logger.info("Subscription updated: %s status=%s", sub_id, status)


async def handle_subscription_deleted(subscription: dict, db: AsyncSession):
    """Handle subscription cancellation -- downgrade user to free."""
    sub_id = subscription.get("id", "")

    result = await db.execute(select(Subscription).where(Subscription.stripe_subscription_id == sub_id))
    existing = result.scalar_one_or_none()

    if existing:
        existing.status = "cancelled"

        # Downgrade user to free
        result = await db.execute(select(Profile).where(Profile.id == existing.user_id))
        profile = result.scalar_one_or_none()
        if profile:
            profile.pack_id = "free"
            profile.pack_expires_at = None

        await db.flush()
    logger.info("Subscription deleted: %s, user downgraded to free", sub_id)


async def handle_payment_failed(invoice: dict, db: AsyncSession):
    """Handle failed payment -- mark past_due and trigger dunning emails."""
    sub_id = invoice.get("subscription", "")
    customer_email = invoice.get("customer_email", "")

    logger.warning("Payment failed: subscription=%s email=%s", sub_id, customer_email)

    if sub_id:
        result = await db.execute(select(Subscription).where(Subscription.stripe_subscription_id == sub_id))
        existing = result.scalar_one_or_none()
        if existing:
            existing.status = "past_due"
            await db.flush()

    # Trigger dunning immediately so step 1 fires within minutes
    try:
        from app.tasks.email import process_dunning_emails
        process_dunning_emails.delay()
    except Exception:
        pass  # Celery unavailable — daily beat will catch it

    logger.info("Payment failed handled: subscription=%s", sub_id)


async def handle_charge_refunded(charge: dict, db: AsyncSession):
    """Handle refund — downgrade user if full refund on subscription payment."""
    payment_intent_id = charge.get("payment_intent", "")
    refunded = charge.get("refunded", False)

    if not payment_intent_id:
        return

    # Find payment record
    result = await db.execute(
        select(Payment).where(Payment.stripe_payment_intent_id == payment_intent_id)
    )
    payment = result.scalar_one_or_none()

    if payment and refunded:
        payment.status = "refunded"

        # If this was a subscription payment, downgrade user to free
        result = await db.execute(select(Profile).where(Profile.id == payment.user_id))
        profile = result.scalar_one_or_none()
        if profile and profile.pack_id != "free":
            logger.info("Refund processed: downgrading user %s from %s to free", profile.id, profile.pack_id)
            profile.pack_id = "free"

        await db.flush()

    logger.info("Charge refunded: payment_intent=%s full_refund=%s", payment_intent_id, refunded)

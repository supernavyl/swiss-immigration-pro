import asyncio
import logging

import stripe as stripe_lib

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

if settings.stripe_secret_key:
    stripe_lib.api_key = settings.stripe_secret_key

# Subscription price IDs
SUBSCRIPTION_PRICE_IDS = {
    "immigration": {
        "monthly": settings.stripe_price_immigration_monthly,
        "annual": settings.stripe_price_immigration_annual,
    },
    "advanced": {
        "monthly": settings.stripe_price_advanced_monthly,
        "annual": settings.stripe_price_advanced_annual,
    },
    "citizenship": {
        "monthly": settings.stripe_price_citizenship_monthly,
        "annual": settings.stripe_price_citizenship_annual,
    },
}

# Pricing packs metadata
PRICING_PACKS = {
    "free": {"id": "free", "name": "Free", "price": 0},
    "immigration": {"id": "immigration", "name": "Immigration Pack", "price": 9},
    "advanced": {"id": "advanced", "name": "Advanced Pack", "price": 29},
    "citizenship": {"id": "citizenship", "name": "Citizenship Pro Pack", "price": 79},
}

# One-time products
ONE_TIME_PRODUCTS = {
    "masterclass": {
        "id": "masterclass",
        "name": "Swiss Immigration Masterclass",
        "price": 49700,  # CHF 497 in cents
        "type": "course",
    },
    "citizenship_roadmap": {
        "id": "citizenship_roadmap",
        "name": "Citizenship Roadmap PDF",
        "price": 9700,  # CHF 97 in cents
        "type": "pdf",
    },
    "application_support": {
        "id": "application_support",
        "name": "Application Support Package",
        "price": 150000,  # CHF 1500 in cents
        "type": "service",
    },
}

CONSULTATION_TYPES = {
    "quick": {"name": "Quick Consultation", "price": 8000, "duration": "30 min"},
    "full": {"name": "Full Consultation", "price": 20000, "duration": "60 min"},
    "support": {"name": "Support Package", "price": 60000, "duration": "Package"},
}


# Valid discount codes → Stripe coupon config
# These coupons are created on-demand in Stripe if they don't exist yet.
DISCOUNT_CODES: dict[str, dict] = {
    "QUIZ25": {
        "coupon_id": "sip_quiz25",
        "percent_off": 25,
        "duration": "repeating",
        "duration_in_months": 3,
        "name": "Quiz Assessment — 25% off for 3 months",
    },
    "SAVE15": {
        "coupon_id": "sip_save15",
        "percent_off": 15,
        "duration": "repeating",
        "duration_in_months": 3,
        "name": "Exit Intent — 15% off for 3 months",
    },
    "WELCOME10": {
        "coupon_id": "sip_welcome10",
        "percent_off": 10,
        "duration": "repeating",
        "duration_in_months": 2,
        "name": "Welcome — 10% off for 2 months",
    },
}


async def _resolve_stripe_coupon(discount_code: str) -> str | None:
    """Validate a discount code and ensure the Stripe coupon exists.

    Returns the Stripe coupon ID if valid, None otherwise.
    """
    code_upper = discount_code.upper().strip()
    config = DISCOUNT_CODES.get(code_upper)
    if not config:
        return None

    coupon_id = config["coupon_id"]

    # Try to retrieve existing coupon first
    try:
        await asyncio.to_thread(stripe_lib.Coupon.retrieve, coupon_id)
        return coupon_id
    except stripe_lib.error.InvalidRequestError:
        pass  # Coupon doesn't exist yet — create it

    # Create the coupon
    try:
        await asyncio.to_thread(
            stripe_lib.Coupon.create,
            id=coupon_id,
            percent_off=config["percent_off"],
            duration=config["duration"],
            duration_in_months=config.get("duration_in_months"),
            currency="chf",
            name=config["name"],
        )
        logger.info("Created Stripe coupon: %s", coupon_id)
        return coupon_id
    except Exception as e:
        logger.error("Failed to create Stripe coupon %s: %s", coupon_id, e)
        return None


def get_subscription_price_id(pack_id: str, cycle: str = "monthly") -> str | None:
    pack = SUBSCRIPTION_PRICE_IDS.get(pack_id)
    if not pack:
        return None
    return pack.get(cycle)


async def create_checkout_session(
    pack_id: str | None = None,
    cycle: str = "monthly",
    one_time_product_id: str | None = None,
    success_url: str | None = None,
    cancel_url: str | None = None,
    customer_email: str | None = None,
    discount_code: str | None = None,
) -> dict:
    if not settings.stripe_secret_key:
        return {"error": "Stripe not configured"}

    base_url = settings.app_url
    s_url = success_url or f"{base_url}/dashboard?payment=success"
    c_url = cancel_url or f"{base_url}/pricing?payment=cancelled"

    try:
        # Resolve discount code to Stripe coupon
        coupon_id: str | None = None
        if discount_code:
            coupon_id = await _resolve_stripe_coupon(discount_code)
            if coupon_id:
                logger.info("Applying coupon %s for code %s", coupon_id, discount_code)

        discount_kwargs: dict = {}
        if coupon_id:
            discount_kwargs["discounts"] = [{"coupon": coupon_id}]

        if one_time_product_id:
            product = ONE_TIME_PRODUCTS.get(one_time_product_id)
            if not product:
                return {"error": "Invalid product ID"}

            session = await asyncio.to_thread(
                stripe_lib.checkout.Session.create,
                mode="payment",
                payment_method_types=["card", "twint", "sepa_debit"],
                line_items=[
                    {
                        "price_data": {
                            "currency": "chf",
                            "product_data": {"name": product["name"]},
                            "unit_amount": product["price"],
                        },
                        "quantity": 1,
                    }
                ],
                success_url=s_url,
                cancel_url=c_url,
                customer_email=customer_email,
                metadata={"product_id": one_time_product_id, "type": "one_time"},
                **discount_kwargs,
            )
        else:
            price_id = get_subscription_price_id(pack_id or "", cycle)
            if not price_id:
                return {"error": "Invalid pack or cycle"}

            session = await asyncio.to_thread(
                stripe_lib.checkout.Session.create,
                mode="subscription",
                payment_method_types=["card", "sepa_debit"],
                line_items=[{"price": price_id, "quantity": 1}],
                subscription_data={"trial_period_days": 7},
                success_url=s_url,
                cancel_url=c_url,
                customer_email=customer_email,
                metadata={
                    "pack_id": pack_id,
                    "cycle": cycle,
                    "type": "subscription",
                    **({"discount_code": discount_code} if discount_code else {}),
                },
                **discount_kwargs,
            )

        return {"checkout_url": session.url, "session_id": session.id}
    except Exception as e:
        logger.error("Stripe checkout error: %s", e)
        return {"error": str(e)}


async def create_consultation_checkout(
    consultation_type: str,
    consultation_id: str,
    customer_email: str,
) -> dict:
    if not settings.stripe_secret_key:
        return {"error": "Stripe not configured"}

    ctype = CONSULTATION_TYPES.get(consultation_type)
    if not ctype:
        return {"error": "Invalid consultation type"}

    try:
        session = await asyncio.to_thread(
            stripe_lib.checkout.Session.create,
            mode="payment",
            payment_method_types=["card", "twint", "sepa_debit"],
            line_items=[
                {
                    "price_data": {
                        "currency": "chf",
                        "product_data": {"name": ctype["name"]},
                        "unit_amount": ctype["price"],
                    },
                    "quantity": 1,
                }
            ],
            success_url=f"{settings.app_url}/consultation/success?id={consultation_id}",
            cancel_url=f"{settings.app_url}/consultation?cancelled=true",
            customer_email=customer_email,
            metadata={
                "consultation_id": consultation_id,
                "consultation_type": consultation_type,
                "type": "consultation",
            },
        )
        return {"checkout_url": session.url, "session_id": session.id}
    except Exception as e:
        logger.error("Stripe consultation checkout error: %s", e)
        return {"error": str(e)}

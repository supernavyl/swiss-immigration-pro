"""
B2B Billing router -- Stripe subscription management for companies.
"""

import logging
import uuid

import stripe as stripe_lib
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.middleware.auth import CurrentUser, get_current_user
from app.models.company import Company
from app.routers.b2b.companies import get_company_member
from app.schemas import CamelModel

logger = logging.getLogger(__name__)
settings = get_settings()

router = APIRouter(prefix="/billing", tags=["b2b-billing"])

# B2B plan definitions
B2B_PLANS = {
    "b2b_starter": {
        "name": "Starter",
        "price_monthly": 19900,   # CHF 199
        "price_annual": 191000,   # CHF 1910 (20% discount)
        "max_employees": 25,
    },
    "b2b_business": {
        "name": "Business",
        "price_monthly": 49900,   # CHF 499
        "price_annual": 479000,   # CHF 4790 (20% discount)
        "max_employees": 100,
    },
    "b2b_enterprise": {
        "name": "Enterprise",
        "price_monthly": 99900,   # CHF 999
        "price_annual": 959000,   # CHF 9590 (20% discount)
        "max_employees": 10000,   # Effectively unlimited
    },
}


class UpgradePlanRequest(CamelModel):
    plan_id: str
    cycle: str = "monthly"  # monthly | annual


@router.get("/{company_id}")
async def get_billing(
    company_id: str,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get billing details for a company."""
    await get_company_member(user, company_id, db, roles=["owner", "admin"])

    result = await db.execute(select(Company).where(Company.id == uuid.UUID(company_id)))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    plan = B2B_PLANS.get(company.plan_id, B2B_PLANS["b2b_starter"])

    return {
        "currentPlan": company.plan_id,
        "planName": plan["name"],
        "maxEmployees": company.max_employees,
        "stripeCustomerId": company.stripe_customer_id,
        "availablePlans": {
            k: {
                "name": v["name"],
                "priceMonthly": v["price_monthly"],
                "priceAnnual": v["price_annual"],
                "maxEmployees": v["max_employees"],
            }
            for k, v in B2B_PLANS.items()
        },
    }


@router.post("/{company_id}/checkout")
async def create_b2b_checkout(
    company_id: str,
    body: UpgradePlanRequest,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a Stripe checkout session for B2B plan."""
    await get_company_member(user, company_id, db, roles=["owner", "admin"])

    if not settings.stripe_secret_key:
        raise HTTPException(status_code=500, detail="Stripe not configured")

    plan = B2B_PLANS.get(body.plan_id)
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid plan ID")

    result = await db.execute(select(Company).where(Company.id == uuid.UUID(company_id)))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    price = plan["price_annual"] if body.cycle == "annual" else plan["price_monthly"]
    mode = "subscription"

    try:
        session = stripe_lib.checkout.Session.create(
            mode=mode,
            line_items=[{
                "price_data": {
                    "currency": "chf",
                    "product_data": {"name": f"B2B {plan['name']} Plan"},
                    "unit_amount": price,
                    "recurring": {"interval": "year" if body.cycle == "annual" else "month"},
                },
                "quantity": 1,
            }],
            success_url=f"{settings.app_url}/b2b/settings?payment=success",
            cancel_url=f"{settings.app_url}/b2b/settings?payment=cancelled",
            customer_email=company.billing_email,
            metadata={
                "type": "b2b_subscription",
                "company_id": str(company.id),
                "plan_id": body.plan_id,
                "cycle": body.cycle,
            },
        )

        return {"checkoutUrl": session.url, "sessionId": session.id}
    except Exception as e:
        logger.error("B2B checkout error: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/plans/list")
async def list_b2b_plans():
    """List available B2B plans (public endpoint)."""
    return {
        "plans": [
            {
                "id": k,
                "name": v["name"],
                "priceMonthly": v["price_monthly"],
                "priceAnnual": v["price_annual"],
                "maxEmployees": v["max_employees"],
            }
            for k, v in B2B_PLANS.items()
        ]
    }

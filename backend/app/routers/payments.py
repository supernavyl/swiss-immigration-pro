from fastapi import APIRouter, Depends, HTTPException, Query

from app.middleware.auth import CurrentUser, get_current_user
from app.schemas import CamelModel
from app.services.stripe_service import DISCOUNT_CODES, ONE_TIME_PRODUCTS, create_checkout_session

router = APIRouter(prefix="/api", tags=["payments"])


class CheckoutRequest(CamelModel):
    pack_id: str | None = None
    cycle: str = "monthly"
    one_time_product_id: str | None = None
    discount_code: str | None = None


class ProductCheckoutRequest(CamelModel):
    product_id: str


@router.post("/checkout")
async def checkout(
    body: CheckoutRequest,
    user: CurrentUser = Depends(get_current_user),
):
    result = await create_checkout_session(
        pack_id=body.pack_id,
        cycle=body.cycle,
        one_time_product_id=body.one_time_product_id,
        customer_email=user.email,
        discount_code=body.discount_code,
    )

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return {
        "checkoutUrl": result.get("checkout_url"),
        "sessionId": result.get("session_id"),
    }


@router.post("/products/checkout")
async def product_checkout(
    body: ProductCheckoutRequest,
    user: CurrentUser = Depends(get_current_user),
):
    product = ONE_TIME_PRODUCTS.get(body.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    result = await create_checkout_session(
        one_time_product_id=body.product_id,
        customer_email=user.email,
    )

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return {
        "checkoutUrl": result.get("checkout_url"),
        "productId": body.product_id,
    }


@router.get("/payments/validate-coupon")
async def validate_coupon(code: str = Query(..., min_length=1, max_length=30)) -> dict:
    """Validate a discount code and return its details."""
    config = DISCOUNT_CODES.get(code.upper().strip())
    if not config:
        return {
            "valid": False,
            "description": "Invalid coupon code",
            "percentOff": 0,
            "durationMonths": 0,
        }

    return {
        "valid": True,
        "description": config["name"],
        "percentOff": config["percent_off"],
        "durationMonths": config.get("duration_in_months", 0),
    }

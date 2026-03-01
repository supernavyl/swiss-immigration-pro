import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import CurrentUser, get_optional_user
from app.models.content import Consultation
from app.schemas import CamelModel
from app.services.stripe_service import CONSULTATION_TYPES, create_consultation_checkout

router = APIRouter(prefix="/api/consultations", tags=["consultations"])


class BookConsultationRequest(CamelModel):
    consultation_type: str
    full_name: str
    email: EmailStr
    preferred_date: str | None = None
    timezone: str = "UTC"
    notes: str | None = None


@router.post("/book")
async def book_consultation(
    body: BookConsultationRequest,
    user: CurrentUser | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    ctype = CONSULTATION_TYPES.get(body.consultation_type)
    if not ctype:
        raise HTTPException(status_code=400, detail="Invalid consultation type")

    # Create consultation record
    consultation = Consultation(
        user_id=uuid.UUID(user.user_id) if user else None,
        email=body.email,
        full_name=body.full_name,
        consultation_type=body.consultation_type,
        preferred_date=datetime.fromisoformat(body.preferred_date) if body.preferred_date else None,
        timezone=body.timezone,
        status="pending",
        amount=ctype["price"],
        notes=body.notes,
    )
    db.add(consultation)
    await db.flush()

    # Create Stripe checkout
    result = await create_consultation_checkout(
        consultation_type=body.consultation_type,
        consultation_id=str(consultation.id),
        customer_email=body.email,
    )

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    return {
        "checkoutUrl": result.get("checkout_url"),
        "consultationId": str(consultation.id),
    }

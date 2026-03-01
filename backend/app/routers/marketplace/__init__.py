"""Marketplace API routers package."""

from fastapi import APIRouter

from app.routers.marketplace import listings, providers, referrals, reviews

marketplace_router = APIRouter(prefix="/api/marketplace", tags=["marketplace"])

marketplace_router.include_router(providers.router)
marketplace_router.include_router(listings.router)
marketplace_router.include_router(referrals.router)
marketplace_router.include_router(reviews.router)

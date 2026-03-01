import logging
import os
import time
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from sqlalchemy import text

from app.config import get_settings
from app.middleware.rate_limit import limiter
from app.routers import (
    admin,
    apartments,
    auth,
    chatbot,
    consultations,
    contact,
    cv,
    lawyer,
    marketing,
    modules,
    newsletter,
    payments,
    referrals,
    search,
    stats,
    translate,
    user,
    webhooks,
)
from app.routers.b2b import b2b_router
from app.routers.marketplace import marketplace_router

# --- Sentry ---
sentry_dsn = os.environ.get("SENTRY_DSN", "")
if sentry_dsn:
    try:
        import sentry_sdk

        sentry_sdk.init(dsn=sentry_dsn, traces_sample_rate=0.2, profiles_sample_rate=0.1)
    except Exception:
        logging.getLogger(__name__).warning("Sentry SDK init failed", exc_info=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("Starting %s API v3.0.0", settings.app_name)
    try:
        from app.services.rag import initialize as init_rag

        await init_rag()
        logger.info("RAG pipeline initialized")
    except Exception as exc:
        logger.warning("RAG init deferred (will init on first request): %s", exc)
    yield
    logger.info("Shutting down %s API", settings.app_name)


app = FastAPI(
    lifespan=lifespan,
    title=settings.app_name,
    description="Swiss Immigration Pro API",
    version="3.0.0",
    docs_url="/api/docs" if settings.debug else None,
    redoc_url="/api/redoc" if settings.debug else None,
)

# --- Rate Limiting ---
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# --- Global Exception Handler ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "X-Requested-With"],
)


# --- Request Logging Middleware ---
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start) * 1000, 2)
    logger.info(
        "%s %s %s %sms",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response


# --- Register routers ---
app.include_router(auth.router)
app.include_router(apartments.router)
app.include_router(search.router)
app.include_router(translate.router)
app.include_router(chatbot.router)
app.include_router(lawyer.router)
app.include_router(cv.router)
app.include_router(payments.router)
app.include_router(newsletter.router)
app.include_router(newsletter.admin_subscribers_router)
app.include_router(marketing.router)
app.include_router(contact.router)
app.include_router(modules.router)
app.include_router(consultations.router)
app.include_router(user.router)
app.include_router(admin.router)
app.include_router(stats.router)
app.include_router(webhooks.router)
app.include_router(referrals.router)
app.include_router(b2b_router)
app.include_router(marketplace_router)


# --- Health Check (deep) ---
@app.get("/api/health")
async def health_check():
    checks = {"api": "ok"}
    # DB check
    try:
        from app.database import engine

        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        checks["database"] = "ok"
    except Exception as e:
        checks["database"] = f"error: {e}"
    # Redis check (when available)
    try:
        import redis.asyncio as aioredis

        r = aioredis.from_url(os.environ.get("REDIS_URL", "redis://redis:6379"))
        await r.ping()
        checks["redis"] = "ok"
        await r.aclose()
    except Exception:
        checks["redis"] = "unavailable"

    overall = "ok" if checks.get("database") == "ok" else "degraded"
    return {"status": overall, "service": settings.app_name, "version": "3.0.0", "checks": checks}

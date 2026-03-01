"""Shared async Redis connection pool singleton."""

from __future__ import annotations

import redis.asyncio as aioredis

from app.config import get_settings

_pool: aioredis.Redis | None = None


def get_redis() -> aioredis.Redis:
    """Return the shared Redis client (lazy-initialized, reused across requests)."""
    global _pool
    if _pool is None:
        settings = get_settings()
        _pool = aioredis.from_url(settings.redis_url, decode_responses=True)
    return _pool

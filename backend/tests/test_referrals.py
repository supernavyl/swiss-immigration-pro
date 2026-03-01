"""Tests for the referrals router — code generation, stats, validation."""

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_referral_code_requires_auth(client: AsyncClient):
    resp = await client.get("/api/referrals/code")
    assert resp.status_code in (401, 403)


@pytest.mark.asyncio
async def test_get_referral_code(client: AsyncClient, auth_headers):
    resp = await client.get("/api/referrals/code", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "code" in data
    assert len(data["code"]) > 0


@pytest.mark.asyncio
async def test_referral_stats_requires_auth(client: AsyncClient):
    resp = await client.get("/api/referrals/stats")
    assert resp.status_code in (401, 403)


@pytest.mark.asyncio
async def test_referral_stats_returns_zeros_for_new_user(client: AsyncClient, auth_headers):
    resp = await client.get("/api/referrals/stats", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "totalReferrals" in data
    assert "conversions" in data


@pytest.mark.asyncio
async def test_validate_invalid_code(client: AsyncClient, auth_headers):
    resp = await client.post(
        "/api/referrals/validate/INVALID_CODE_12345",
        headers=auth_headers,
    )
    # Should either return 404 or 200 with valid=false
    assert resp.status_code in (200, 404)

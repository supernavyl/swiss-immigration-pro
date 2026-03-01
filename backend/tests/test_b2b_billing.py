"""Tests for B2B billing router — plan listing and checkout."""

from __future__ import annotations

import pytest
from httpx import AsyncClient


# ---------------------------------------------------------------------------
# Plans listing (public endpoint)
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_list_plans_is_public(no_db_client: AsyncClient):
    resp = await no_db_client.get("/api/b2b/billing/plans/list")
    assert resp.status_code == 200
    plans = resp.json()["plans"]
    assert len(plans) >= 3
    for plan in plans:
        assert "id" in plan
        assert "name" in plan
        assert "priceMonthly" in plan
        assert "priceAnnual" in plan


@pytest.mark.asyncio
async def test_plans_have_correct_structure(no_db_client: AsyncClient):
    resp = await no_db_client.get("/api/b2b/billing/plans/list")
    plans = resp.json()["plans"]
    for plan in plans:
        assert plan["priceMonthly"] > 0
        assert plan["priceAnnual"] > 0
        # Annual should be cheaper per month than monthly
        monthly_annual = plan["priceAnnual"] / 12
        assert monthly_annual <= plan["priceMonthly"]


# ---------------------------------------------------------------------------
# Checkout (requires auth + company membership)
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_checkout_requires_auth(no_db_client: AsyncClient):
    resp = await no_db_client.post(
        "/api/b2b/billing/fake-company-id/checkout",
        json={"planId": "starter", "cycle": "monthly"},
    )
    assert resp.status_code in (401, 403)

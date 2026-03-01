"""Tests for the apartments router — demo property search."""

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_apartments(no_db_client: AsyncClient):
    resp = await no_db_client.get("/api/apartments")
    assert resp.status_code == 200
    data = resp.json()
    assert data["demo"] is True
    assert data["total"] > 0
    assert len(data["properties"]) == data["total"]


@pytest.mark.asyncio
async def test_filter_by_city(no_db_client: AsyncClient):
    resp = await no_db_client.get("/api/apartments", params={"city": "Zurich"})
    data = resp.json()
    for prop in data["properties"]:
        assert "zurich" in prop["city"].lower()


@pytest.mark.asyncio
async def test_filter_by_rent_range(no_db_client: AsyncClient):
    resp = await no_db_client.get("/api/apartments", params={"minRent": 1000, "maxRent": 2000})
    data = resp.json()
    for prop in data["properties"]:
        assert 1000 <= prop["rent"] <= 2000


@pytest.mark.asyncio
async def test_filter_furnished(no_db_client: AsyncClient):
    resp = await no_db_client.get("/api/apartments", params={"furnished": "true"})
    data = resp.json()
    for prop in data["properties"]:
        assert prop["furnished"] is True


@pytest.mark.asyncio
async def test_empty_results_with_strict_filters(no_db_client: AsyncClient):
    resp = await no_db_client.get(
        "/api/apartments",
        params={"minRent": 999999},
    )
    data = resp.json()
    assert data["total"] == 0
    assert data["properties"] == []

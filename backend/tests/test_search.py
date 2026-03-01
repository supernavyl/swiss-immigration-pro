"""Tests for the search router — keyword matching and static index."""

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_search_returns_results(no_db_client: AsyncClient):
    resp = await no_db_client.post("/api/search", json={"query": "visa permit"})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["results"]) > 0
    assert data["source"] == "static"


@pytest.mark.asyncio
async def test_search_empty_query(no_db_client: AsyncClient):
    resp = await no_db_client.post("/api/search", json={"query": ""})
    assert resp.status_code == 200
    data = resp.json()
    assert data["results"] == []


@pytest.mark.asyncio
async def test_search_short_query(no_db_client: AsyncClient):
    resp = await no_db_client.post("/api/search", json={"query": "a"})
    assert resp.status_code == 200
    assert resp.json()["results"] == []


@pytest.mark.asyncio
async def test_search_finds_citizenship(no_db_client: AsyncClient):
    resp = await no_db_client.post("/api/search", json={"query": "citizenship naturalization"})
    data = resp.json()
    ids = [r["id"] for r in data["results"]]
    assert "citizenship" in ids


@pytest.mark.asyncio
async def test_search_results_capped_at_8(no_db_client: AsyncClient):
    resp = await no_db_client.post("/api/search", json={"query": "swiss"})
    data = resp.json()
    assert len(data["results"]) <= 8


@pytest.mark.asyncio
async def test_search_no_ai(no_db_client: AsyncClient):
    resp = await no_db_client.post("/api/search", json={"query": "visa"})
    data = resp.json()
    assert data["hasAI"] is False
    assert data["aiSuggestion"] is None

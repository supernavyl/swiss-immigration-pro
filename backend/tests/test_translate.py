"""Tests for the translation API router."""

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_locales(no_db_client: AsyncClient):
    resp = await no_db_client.get("/api/translate/locales")
    assert resp.status_code == 200
    data = resp.json()
    assert "locales" in data
    assert "en" in data["locales"]
    assert "fr" in data["locales"]
    assert "de" in data["locales"]
    assert data["default"] == "en"


@pytest.mark.asyncio
async def test_list_locales_includes_all_six(no_db_client: AsyncClient):
    resp = await no_db_client.get("/api/translate/locales")
    data = resp.json()
    assert set(data["full"]) == {"en", "de", "fr", "it", "es", "pt"}


@pytest.mark.asyncio
async def test_batch_translate_english(no_db_client: AsyncClient):
    resp = await no_db_client.post(
        "/api/translate/batch",
        json={"keys": ["hero.title", "hero.cta"], "locale": "en"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["locale"] == "en"
    assert data["translations"]["hero.title"] == "Your Path to Swiss Residency"
    assert data["translations"]["hero.cta"] == "Start Free Assessment"


@pytest.mark.asyncio
async def test_batch_translate_french(no_db_client: AsyncClient):
    resp = await no_db_client.post(
        "/api/translate/batch",
        json={"keys": ["hero.title"], "locale": "fr"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["locale"] == "fr"
    assert "résidence suisse" in data["translations"]["hero.title"].lower()


@pytest.mark.asyncio
async def test_batch_translate_falls_back_to_english(no_db_client: AsyncClient):
    """Unknown locale should fall back to English translations."""
    resp = await no_db_client.post(
        "/api/translate/batch",
        json={"keys": ["hero.title"], "locale": "zh"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["translations"]["hero.title"] == "Your Path to Swiss Residency"


@pytest.mark.asyncio
async def test_batch_translate_missing_key_returns_key(no_db_client: AsyncClient):
    """Missing keys fall back to English, then to the key itself."""
    resp = await no_db_client.post(
        "/api/translate/batch",
        json={"keys": ["nonexistent.key"], "locale": "en"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["translations"]["nonexistent.key"] == "nonexistent.key"


@pytest.mark.asyncio
async def test_batch_translate_handles_locale_with_region(no_db_client: AsyncClient):
    """Locale like 'fr-CH' should normalize to 'fr'."""
    resp = await no_db_client.post(
        "/api/translate/batch",
        json={"keys": ["hero.title"], "locale": "fr-CH"},
    )
    assert resp.status_code == 200
    assert resp.json()["locale"] == "fr"


@pytest.mark.asyncio
async def test_get_all_translations(no_db_client: AsyncClient):
    resp = await no_db_client.get("/api/translate/all/en")
    assert resp.status_code == 200
    data = resp.json()
    assert data["locale"] == "en"
    assert "hero.title" in data["translations"]
    assert "fallback" not in data  # English is a real locale, no fallback


@pytest.mark.asyncio
async def test_get_all_translations_unknown_locale_fallback(no_db_client: AsyncClient):
    """Unknown locale returns English with fallback flag."""
    resp = await no_db_client.get("/api/translate/all/ja")
    assert resp.status_code == 200
    data = resp.json()
    assert data["fallback"] is True
    assert data["translations"]["hero.title"] == "Your Path to Swiss Residency"


@pytest.mark.asyncio
async def test_get_all_translations_normalizes_region(no_db_client: AsyncClient):
    resp = await no_db_client.get("/api/translate/all/de-CH")
    assert resp.status_code == 200
    assert resp.json()["locale"] == "de"

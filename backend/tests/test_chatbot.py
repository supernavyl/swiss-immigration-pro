"""Tests for the chatbot endpoint."""

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_chatbot_rejects_empty_message(client: AsyncClient):
    resp = await client.post("/api/chatbot", json={"message": ""})
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_chatbot_rejects_whitespace_message(client: AsyncClient):
    resp = await client.post("/api/chatbot", json={"message": "   "})
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_chatbot_accepts_valid_message(client: AsyncClient):
    resp = await client.post(
        "/api/chatbot",
        json={"message": "What are the visa types for Switzerland?"},
    )
    # Should succeed or return a fallback; NOT 400
    assert resp.status_code == 200

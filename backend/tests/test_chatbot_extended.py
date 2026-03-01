"""Extended tests for the chatbot router -- limits, streaming, edge cases."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
@patch("app.routers.chatbot.get_chatbot_response", new_callable=AsyncMock)
@patch("app.routers.chatbot.get_redis")
async def test_anonymous_chat_success(mock_redis, mock_ai, client: AsyncClient):
    """Anonymous users can chat without auth."""
    mock_redis_instance = AsyncMock()
    mock_redis_instance.incr.return_value = 1
    mock_redis.return_value = mock_redis_instance

    mock_ai.return_value = {
        "response": "The B permit requires an employment contract.",
        "sources": ["weisungen-aug-f.md"],
    }
    resp = await client.post(
        "/api/chatbot",
        json={"message": "What is a B permit?"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "response" in data
    assert len(data["response"]) > 0


@pytest.mark.asyncio
@patch("app.routers.chatbot.get_chatbot_response", new_callable=AsyncMock)
async def test_authenticated_chat_success(mock_ai, client: AsyncClient, auth_headers):
    """Authenticated users can chat and message is persisted."""
    mock_ai.return_value = {
        "response": "Swiss citizenship requires 10 years of residence.",
    }
    resp = await client.post(
        "/api/chatbot",
        json={"message": "How do I get citizenship?", "language": "en"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert "response" in resp.json()


@pytest.mark.asyncio
async def test_empty_message_rejected(client: AsyncClient):
    """Empty messages should be rejected with 400 or 422."""
    resp = await client.post(
        "/api/chatbot",
        json={"message": ""},
    )
    assert resp.status_code in (400, 422)


@pytest.mark.asyncio
async def test_message_too_long(client: AsyncClient):
    """Messages exceeding max_length should be rejected."""
    resp = await client.post(
        "/api/chatbot",
        json={"message": "x" * 5000},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_invalid_language_code(client: AsyncClient):
    """Invalid language codes should be rejected."""
    resp = await client.post(
        "/api/chatbot",
        json={"message": "Hello", "language": "invalid"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
@patch("app.routers.chatbot.get_redis")
async def test_anonymous_rate_limit(mock_redis, client: AsyncClient):
    """Anonymous users hitting the daily limit get 429."""
    mock_redis_instance = AsyncMock()
    mock_redis_instance.incr.return_value = 999  # way over limit
    mock_redis.return_value = mock_redis_instance

    resp = await client.post(
        "/api/chatbot",
        json={"message": "What is a C permit?"},
    )
    assert resp.status_code == 429
    assert "limit" in resp.json()["detail"].lower()

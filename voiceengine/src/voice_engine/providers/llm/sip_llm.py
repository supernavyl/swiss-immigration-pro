"""SIP LLM provider — bridges VoiceEngine to SIP's backend streaming endpoints."""

from __future__ import annotations

import json
import logging
from collections.abc import AsyncIterator
from typing import Any

import httpx

from src.voice_engine.providers.base import LLMProvider

logger = logging.getLogger(__name__)


class SipLLM(LLMProvider):
    """Streams responses from SIP backend's /api/lawyer/stream or /api/chatbot/stream.

    Parses SSE lines of the form ``data: {"token": "..."}`` and yields tokens.
    Captures the ``done`` event metadata (legalBasis, nextSteps, etc.) for the
    caller to retrieve after streaming completes.
    """

    def __init__(
        self,
        backend_url: str,
        mode: str = "lawyer",
        token: str = "",
        language: str = "en",
    ) -> None:
        self._backend_url = backend_url.rstrip("/")
        self._mode = mode
        self._token = token
        self._language = language
        self.last_metadata: dict[str, Any] = {}
        logger.info("SipLLM configured: backend=%s mode=%s", backend_url, mode)

    def update_session(self, token: str, language: str, mode: str) -> None:
        """Update per-session credentials (called when a new WS client connects)."""
        self._token = token
        self._language = language
        self._mode = mode

    async def stream_response(
        self,
        messages: list[dict[str, str]],
        system: str,
    ) -> AsyncIterator[str]:
        """Stream tokens from SIP backend via HTTP SSE."""
        self.last_metadata = {}

        endpoint = f"{self._backend_url}/api/{self._mode}/stream"

        # Build the request body matching SIP's expected format
        # Extract the last user message as the query
        query = ""
        for msg in reversed(messages):
            if msg.get("role") == "user":
                query = msg.get("content", "")
                break

        payload = {
            "message": query,
            "language": self._language,
            "conversation_history": messages[:-1] if messages else [],
        }

        headers: dict[str, str] = {
            "Content-Type": "application/json",
            "Accept": "text/event-stream",
        }
        if self._token:
            headers["Authorization"] = f"Bearer {self._token}"

        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
                async with client.stream(
                    "POST", endpoint, json=payload, headers=headers,
                ) as response:
                    if response.status_code == 429:
                        yield "You've reached your daily limit. Please try again tomorrow or upgrade your plan."
                        return
                    if response.status_code == 401:
                        yield "Your session has expired. Please log in again."
                        return
                    if response.status_code >= 400:
                        logger.error("SIP backend error: %d", response.status_code)
                        yield "I'm having trouble connecting right now. Please try again."
                        return

                    async for line in response.aiter_lines():
                        if not line.startswith("data: "):
                            continue

                        data_str = line[6:]  # strip "data: " prefix

                        if data_str == "[DONE]":
                            break

                        try:
                            data = json.loads(data_str)
                        except json.JSONDecodeError:
                            continue

                        # Token event
                        if "token" in data:
                            yield data["token"]

                        # Done event with metadata
                        if data.get("done"):
                            self.last_metadata = {
                                k: v
                                for k, v in data.items()
                                if k != "done" and k != "token"
                            }

        except httpx.ReadTimeout:
            logger.warning("SIP backend read timeout on %s", endpoint)
            yield "The response took too long. Please try again."
        except httpx.ConnectError:
            logger.error("Cannot connect to SIP backend at %s", endpoint)
            yield "I can't reach the server right now. Please try again in a moment."
        except Exception:
            logger.exception("SipLLM streaming error")
            yield "Something went wrong. Please try again."

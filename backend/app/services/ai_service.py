"""
Swiss Immigration Pro -- AI chatbot service.

Supports five providers with automatic fallback:
  Groq (llama-3.3-70b) -> Gemini 2.0 Flash -> DeepSeek (deepseek-chat) -> GPT-4o-mini -> Grok-2

Both **non-streaming** (`get_chatbot_response`) and **streaming**
(`stream_chatbot_response`) entry-points are provided.
"""

from __future__ import annotations

import asyncio
import json
import logging
from collections.abc import AsyncGenerator

from app.config import get_settings
from app.services import rag
from app.services.sip_ai_knowledge import (
    build_chat_system_prompt,
    fallback_response,
    find_relevant_knowledge,
    generate_follow_ups,
    get_relevant_links,
)

logger = logging.getLogger(__name__)
settings = get_settings()

AI_REQUEST_TIMEOUT = 30  # seconds – initial API call timeout
STREAM_TOTAL_TIMEOUT = 90  # seconds – max wall-clock for full stream iteration

# ---------------------------------------------------------------------------
# Lazy-initialized AI client singletons
# ---------------------------------------------------------------------------
_groq_client = None
_openai_client = None
_xai_client = None
_deepseek_client = None
_gemini_model = None


def _get_groq_client():
    global _groq_client
    if _groq_client is None and settings.groq_api_key:
        from groq import AsyncGroq
        _groq_client = AsyncGroq(api_key=settings.groq_api_key)
    return _groq_client


def _get_openai_client():
    global _openai_client
    if _openai_client is None and settings.openai_api_key:
        from openai import AsyncOpenAI
        _openai_client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _openai_client


def _get_xai_client():
    global _xai_client
    if _xai_client is None and settings.xai_api_key:
        from openai import AsyncOpenAI
        _xai_client = AsyncOpenAI(api_key=settings.xai_api_key, base_url="https://api.x.ai/v1")
    return _xai_client


def _get_deepseek_client():
    global _deepseek_client
    if _deepseek_client is None and settings.deepseek_api_key:
        from openai import AsyncOpenAI
        _deepseek_client = AsyncOpenAI(
            api_key=settings.deepseek_api_key,
            base_url="https://api.deepseek.com",
        )
    return _deepseek_client


def _get_gemini_model():
    """Cached Gemini model — configured once, reused across requests."""
    global _gemini_model
    if _gemini_model is None and settings.google_gemini_api_key:
        import google.generativeai as genai
        genai.configure(api_key=settings.google_gemini_api_key)
        _gemini_model = genai.GenerativeModel("gemini-2.0-flash")
    return _gemini_model


# ===================================================================
# Build the message array for the LLM
# ===================================================================

def _build_messages(
    message: str,
    conversation_history: list[dict],
    system_prompt: str,
) -> list[dict[str, str]]:
    messages: list[dict[str, str]] = [{"role": "system", "content": system_prompt}]
    for msg in conversation_history[-8:]:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": message})
    return messages


# ===================================================================
# Non-streaming response (kept for backward compat / fallback)
# ===================================================================

async def get_chatbot_response(
    message: str,
    conversation_history: list[dict] | None = None,
    language: str = "en",
) -> dict:
    """Main non-streaming chatbot handler."""
    conversation_history = conversation_history or []

    # Use RAG pipeline for document retrieval (semantic + BM25 hybrid search)
    rag_context, _sources = await rag.search_with_context(message, max_chars=6000)

    knowledge_entries = find_relevant_knowledge(message)
    if not rag_context:
        knowledge_context = "\n\n".join(f"**{e['topic']}**:\n{e['content']}" for e in knowledge_entries)
        rag_context = knowledge_context

    relevant_links = get_relevant_links(message)
    links_text = "\n".join(f"- [{link['label']}]({link['url']})" for link in relevant_links)

    system_prompt = build_chat_system_prompt(language, rag_context, links_text)
    messages = _build_messages(message, conversation_history, system_prompt)

    response_text = await _try_ai_providers(messages)

    if not response_text:
        response_text = fallback_response(knowledge_entries, rag_context, relevant_links)

    # Ensure at least one link is present
    if "](" not in response_text:
        response_text += "\n\n---\nHelpful links:\n" + links_text

    # Build suggested follow-up questions
    follow_ups = generate_follow_ups(message, knowledge_entries)

    return {
        "response": response_text,
        "source": "chatbot",
        "links": relevant_links,
        "followUps": follow_ups,
    }


# ===================================================================
# Streaming response (SSE)
# ===================================================================

async def stream_chatbot_response(
    message: str,
    conversation_history: list[dict] | None = None,
    language: str = "en",
) -> AsyncGenerator[str, None]:
    """Yield SSE-formatted events: token chunks and a final done event."""
    conversation_history = conversation_history or []

    # Use RAG pipeline for document retrieval (semantic + BM25 hybrid search)
    rag_context, _sources = await rag.search_with_context(message, max_chars=6000)

    knowledge_entries = find_relevant_knowledge(message)
    if not rag_context:
        knowledge_context = "\n\n".join(f"**{e['topic']}**:\n{e['content']}" for e in knowledge_entries)
        rag_context = knowledge_context

    relevant_links = get_relevant_links(message)
    links_text = "\n".join(f"- [{link['label']}]({link['url']})" for link in relevant_links)

    system_prompt = build_chat_system_prompt(language, rag_context, links_text)
    messages = _build_messages(message, conversation_history, system_prompt)

    full_response = ""
    streamed = False

    # --- Try streaming providers ---
    async for chunk in _try_ai_providers_streaming(messages):
        streamed = True
        full_response += chunk
        yield f"data: {json.dumps({'token': chunk})}\n\n"

    if not streamed:
        # Fall back to non-streaming, then emit as one chunk
        response_text = await _try_ai_providers(messages)
        if not response_text:
            response_text = fallback_response(knowledge_entries, rag_context, relevant_links)
        full_response = response_text
        yield f"data: {json.dumps({'token': response_text})}\n\n"

    # Ensure links are present
    if "](" not in full_response:
        links_appendix = "\n\n---\nHelpful links:\n" + links_text
        full_response += links_appendix
        yield f"data: {json.dumps({'token': links_appendix})}\n\n"

    follow_ups = generate_follow_ups(message, knowledge_entries)

    done_payload = {
        "done": True,
        "links": relevant_links,
        "followUps": follow_ups,
        "fullResponse": full_response,
    }
    yield f"data: {json.dumps(done_payload)}\n\n"


# ===================================================================
# AI providers -- non-streaming
# ===================================================================

async def _try_ai_providers(
    messages: list[dict],
    max_tokens: int | None = None,
    temperature: float | None = None,
) -> str | None:
    """Try providers in priority order: Groq -> Gemini -> DeepSeek -> OpenAI -> xAI."""
    _max_tokens = max_tokens or settings.ai_max_tokens
    _temperature = temperature if temperature is not None else settings.ai_temperature

    # 1. Groq
    client = _get_groq_client()
    if client:
        try:
            response = await asyncio.wait_for(
                client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=messages,
                    max_tokens=_max_tokens,
                    temperature=_temperature,
                ),
                timeout=AI_REQUEST_TIMEOUT,
            )
            text = response.choices[0].message.content
            if text:
                logger.info("Groq responded (%d chars)", len(text))
                return text
        except Exception as exc:
            logger.error("Groq error: %s", exc)

    # 2. Google Gemini (cached model instance)
    gemini_model = _get_gemini_model()
    if gemini_model:
        try:
            prompt = "\n\n".join(f"[{m['role']}]\n{m['content']}" for m in messages)
            response = await asyncio.wait_for(
                asyncio.to_thread(gemini_model.generate_content, prompt),
                timeout=AI_REQUEST_TIMEOUT,
            )
            if response.text:
                logger.info("Gemini responded (%d chars)", len(response.text))
                return response.text
        except Exception as exc:
            logger.warning("Gemini error (%s): %.200s", type(exc).__name__, str(exc))

    # 3. DeepSeek
    ds_client = _get_deepseek_client()
    if ds_client:
        try:
            response = await asyncio.wait_for(
                ds_client.chat.completions.create(
                    model="deepseek-chat",
                    messages=messages,
                    max_tokens=_max_tokens,
                    temperature=_temperature,
                ),
                timeout=AI_REQUEST_TIMEOUT,
            )
            text = response.choices[0].message.content
            if text:
                logger.info("DeepSeek responded (%d chars)", len(text))
                return text
        except Exception as exc:
            logger.error("DeepSeek error: %s", exc)

    # 4. OpenAI
    oai_client = _get_openai_client()
    if oai_client:
        try:
            response = await asyncio.wait_for(
                oai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    max_tokens=_max_tokens,
                    temperature=_temperature,
                ),
                timeout=AI_REQUEST_TIMEOUT,
            )
            text = response.choices[0].message.content
            if text:
                logger.info("OpenAI responded (%d chars)", len(text))
                return text
        except Exception as exc:
            logger.error("OpenAI error: %s", exc)

    # 5. xAI (Grok)
    xai = _get_xai_client()
    if xai:
        try:
            response = await asyncio.wait_for(
                xai.chat.completions.create(
                    model="grok-2",
                    messages=messages,
                    max_tokens=_max_tokens,
                    temperature=_temperature,
                ),
                timeout=AI_REQUEST_TIMEOUT,
            )
            text = response.choices[0].message.content
            if text:
                logger.info("xAI responded (%d chars)", len(text))
                return text
        except Exception as exc:
            logger.error("xAI error: %s", exc)

    return None


# ===================================================================
# AI providers -- streaming
# ===================================================================

async def _try_ai_providers_streaming(
    messages: list[dict],
    max_tokens: int | None = None,
    temperature: float | None = None,
) -> AsyncGenerator[str, None]:
    """Yield text chunks from the first provider that works."""
    _max_tokens = max_tokens or settings.ai_max_tokens
    _temperature = temperature if temperature is not None else settings.ai_temperature

    # 1. Groq (streaming)
    client = _get_groq_client()
    if client:
        try:
            stream = await asyncio.wait_for(
                client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=messages,
                    max_tokens=_max_tokens,
                    temperature=_temperature,
                    stream=True,
                ),
                timeout=AI_REQUEST_TIMEOUT,
            )
            got_content = False
            async with asyncio.timeout(STREAM_TOTAL_TIMEOUT):
                async for chunk in stream:
                    delta = chunk.choices[0].delta
                    if delta and delta.content:
                        got_content = True
                        yield delta.content
            if got_content:
                return
        except Exception as exc:
            logger.error("Groq streaming error: %s", exc)

    # 2. Gemini -- no native async streaming, skip for streaming

    # 3. DeepSeek (streaming)
    ds_client = _get_deepseek_client()
    if ds_client:
        try:
            stream = await asyncio.wait_for(
                ds_client.chat.completions.create(
                    model="deepseek-chat",
                    messages=messages,
                    max_tokens=_max_tokens,
                    temperature=_temperature,
                    stream=True,
                ),
                timeout=AI_REQUEST_TIMEOUT,
            )
            got_content = False
            async with asyncio.timeout(STREAM_TOTAL_TIMEOUT):
                async for chunk in stream:
                    delta = chunk.choices[0].delta
                    if delta and delta.content:
                        got_content = True
                        yield delta.content
            if got_content:
                return
        except Exception as exc:
            logger.error("DeepSeek streaming error: %s", exc)

    # 4. OpenAI (streaming)
    oai_client = _get_openai_client()
    if oai_client:
        try:
            stream = await asyncio.wait_for(
                oai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    max_tokens=_max_tokens,
                    temperature=_temperature,
                    stream=True,
                ),
                timeout=AI_REQUEST_TIMEOUT,
            )
            got_content = False
            async with asyncio.timeout(STREAM_TOTAL_TIMEOUT):
                async for chunk in stream:
                    delta = chunk.choices[0].delta
                    if delta and delta.content:
                        got_content = True
                        yield delta.content
            if got_content:
                return
        except Exception as exc:
            logger.error("OpenAI streaming error: %s", exc)

    # 5. xAI (streaming)
    xai = _get_xai_client()
    if xai:
        try:
            stream = await asyncio.wait_for(
                xai.chat.completions.create(
                    model="grok-2",
                    messages=messages,
                    max_tokens=_max_tokens,
                    temperature=_temperature,
                    stream=True,
                ),
                timeout=AI_REQUEST_TIMEOUT,
            )
            got_content = False
            async with asyncio.timeout(STREAM_TOTAL_TIMEOUT):
                async for chunk in stream:
                    delta = chunk.choices[0].delta
                    if delta and delta.content:
                        got_content = True
                        yield delta.content
            if got_content:
                return
        except Exception as exc:
            logger.error("xAI streaming error: %s", exc)

    # No provider streamed -- caller will fall back to non-streaming

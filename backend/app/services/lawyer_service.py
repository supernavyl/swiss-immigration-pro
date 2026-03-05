"""
Dedicated lawyer AI service -- extracted and enhanced from ai_service.py.

Uses RAG-based document retrieval, enhanced system prompt with chain-of-thought
legal reasoning, higher token limits, conversation summarization, and enriched
metadata extraction (deadlines, costs, complexity).
"""

from __future__ import annotations

import json
import logging
import re
from collections.abc import AsyncGenerator
from typing import Any

from app.config import get_settings
from app.services import rag
from app.services.ai_service import (
    _try_ai_providers,
    _try_ai_providers_streaming,
)
from app.services.sip_ai_knowledge import (
    build_lawyer_system_prompt,
    find_relevant_knowledge,
    lawyer_fallback_response,
)

logger = logging.getLogger(__name__)
settings = get_settings()


# ---------------------------------------------------------------------------
# Message building with conversation summarization
# ---------------------------------------------------------------------------


def _build_messages(
    message: str,
    conversation_history: list[dict],
    system_prompt: str,
    max_history: int = 16,
) -> list[dict[str, str]]:
    """Build the message array, keeping more history for the lawyer context."""
    messages: list[dict[str, str]] = [{"role": "system", "content": system_prompt}]
    for msg in conversation_history[-max_history:]:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": message})
    return messages


async def _summarize_history(
    conversation_history: list[dict],
) -> list[dict]:
    """If history is very long, summarize earlier messages to fit context."""
    if len(conversation_history) <= 16:
        return conversation_history

    early = conversation_history[:-12]
    recent = conversation_history[-12:]

    summary_prompt = (
        "Summarize the following legal consultation conversation, preserving all "
        "key legal facts, article citations, deadlines, and decisions discussed. "
        "Be concise but thorough:\n\n"
    )
    for msg in early:
        summary_prompt += f"[{msg.get('role', 'user')}]: {msg.get('content', '')}\n\n"

    summary_messages = [
        {"role": "system", "content": "You are a legal conversation summarizer."},
        {"role": "user", "content": summary_prompt},
    ]

    summary = await _try_ai_providers(summary_messages)
    if summary:
        return [
            {"role": "assistant", "content": f"[Previous discussion summary]\n{summary}"},
            *recent,
        ]
    return conversation_history[-16:]


# ---------------------------------------------------------------------------
# Metadata extraction (enhanced)
# ---------------------------------------------------------------------------


def _extract_legal_metadata(response_text: str) -> dict[str, Any]:
    """Extract legal citations, next steps, deadlines, costs, and complexity."""
    legal_basis: list[str] = []
    art_pattern = re.compile(
        r"Art\.?\s*\d+[a-z]?\s*(?:(?:al|abs|para?|let|lit|ch|Abs|Al|cpv)\.?\s*\d+\s*)?"
        r"(?:FNIA|AIG|LEI|BüG|LN|AFMP|ALCP|OASE|OLCP|OLE|AsylG|LAsi|VZAE|OASA|SR\s*[\d.]+)"
        r"(?:\s*[-—–]\s*[^\n]{5,100})?",
        re.IGNORECASE,
    )
    for match in art_pattern.finditer(response_text):
        citation = match.group(0).strip()
        if citation and citation not in legal_basis:
            legal_basis.append(citation)

    basis_section = re.search(
        r"(?:Legal Basis|Rechtsgrundlage|Base légale|Fondamento giuridico)[:\s]*\n((?:[-•*]\s*.+\n?)+)",
        response_text,
        re.IGNORECASE,
    )
    if basis_section:
        for line in basis_section.group(1).strip().split("\n"):
            cleaned = re.sub(r"^[-•*]\s*", "", line).strip()
            if cleaned and cleaned not in legal_basis:
                legal_basis.append(cleaned)

    next_steps: list[str] = []
    steps_section = re.search(
        r"(?:Next Steps|Nächste Schritte|Prochaines étapes"
        r"|Prossimi passi|Practical (?:Next )?Steps"
        r"|Action Items|Recommended Steps)"
        r"[:\s]*\n((?:\d+[.)]\s*.+\n?)+)",
        response_text,
        re.IGNORECASE,
    )
    if steps_section:
        for line in steps_section.group(1).strip().split("\n"):
            cleaned = re.sub(r"^\d+[.)]\s*", "", line).strip()
            if cleaned:
                next_steps.append(cleaned)

    deadlines: list[str] = []
    deadline_patterns = [
        r"(\d+)\s*(?:days?|jours?|Tage?|giorni?)\s+(?:to|pour|für|per|after|après|nach)\s+([^.;,\n]{5,80})",
        r"(?:deadline|délai|Frist|termine)[:\s]+([^.;,\n]{5,80})",
        r"within\s+(\d+\s+(?:days?|weeks?|months?|years?))\s+([^.;,\n]{5,60})",
    ]
    for pattern in deadline_patterns:
        for m in re.finditer(pattern, response_text, re.IGNORECASE):
            deadlines.append(m.group(0).strip())

    costs: list[str] = []
    cost_pattern = re.compile(
        r"(?:CHF|Fr\.?|SFr\.?)\s*[\d',.\s]+(?:\s*[-–]\s*(?:CHF|Fr\.?|SFr\.?)?\s*[\d',.\s]+)?",
        re.IGNORECASE,
    )
    for m in cost_pattern.finditer(response_text):
        costs.append(m.group(0).strip())

    complexity = "simple"
    complex_indicators = [
        "recommend.*(?:lawyer|attorney|avocat|anwalt|legal counsel)",
        "complex|complicated|difficult|challenging",
        "appeal|recours|Beschwerde|ricorso",
        "deportation|expulsion|renvoi|Ausweisung",
        "criminal|pénal|Straf|penale",
        "hardship|rigueur|Härtefall",
    ]
    complexity_score = sum(1 for pat in complex_indicators if re.search(pat, response_text, re.IGNORECASE))
    if complexity_score >= 3:
        complexity = "requires-lawyer"
    elif complexity_score >= 2:
        complexity = "complex"
    elif complexity_score >= 1:
        complexity = "moderate"

    return {
        "legalBasis": legal_basis[:10],
        "nextSteps": next_steps[:8],
        "deadlines": deadlines[:5],
        "costs": costs[:5],
        "complexity": complexity,
    }


# ---------------------------------------------------------------------------
# Follow-up generation
# ---------------------------------------------------------------------------


def _generate_follow_ups(
    query: str,
    full_response: str,
) -> list[str]:
    """Generate follow-up questions using keyword matching (no extra AI call)."""
    return _fallback_follow_ups(query)


def _fallback_follow_ups(query: str) -> list[str]:
    """Static keyword-matched follow-ups as last resort."""
    query_lower = query.lower()

    topic_map = {
        "permit": ["What documents do I need?", "How long does the process take?", "Can I appeal if rejected?"],
        "visa": [
            "What are the eligibility requirements?",
            "How long is the processing time?",
            "What happens if my visa expires?",
        ],
        "work": [
            "Does my employer need to sponsor me?",
            "What about the labour market test?",
            "Can I switch jobs with a work permit?",
        ],
        "citizenship": [
            "What language level is required?",
            "Do I need to renounce my current citizenship?",
            "What does the integration assessment involve?",
        ],
        "appeal": [
            "What is the deadline for filing an appeal?",
            "What evidence should I include?",
            "Should I hire a lawyer for the appeal?",
        ],
        "family": [
            "What financial requirements must I meet?",
            "What about unmarried partners?",
            "How long does family reunification take?",
        ],
        "reject": [
            "What are my options after a rejection?",
            "Can I reapply after a rejection?",
            "What is the appeal process?",
        ],
        "employer": [
            "What obligations does my employer have?",
            "Can I be self-employed?",
            "What about the quota system?",
        ],
        "tax": [
            "Am I subject to withholding tax?",
            "How do cantonal tax rates differ?",
            "What deductions can I claim?",
        ],
        "residence": [
            "When can I apply for permanent residence?",
            "What are the integration requirements?",
            "Does time abroad count?",
        ],
    }

    for keyword, follow_ups in topic_map.items():
        if keyword in query_lower:
            return follow_ups[:3]

    return [
        "What permit type is right for my situation?",
        "What are the key legal requirements?",
        "Should I consult a licensed attorney?",
    ]


# ---------------------------------------------------------------------------
# Main streaming entry-point
# ---------------------------------------------------------------------------


async def stream_lawyer_response(
    message: str,
    conversation_history: list[dict] | None = None,
    language: str = "en",
    document_context: str = "",
) -> AsyncGenerator[str, None]:
    """Yield SSE events with enhanced legal analysis and metadata."""
    conversation_history = conversation_history or []

    rag_context, sources = await rag.search_with_context(message, max_chars=12000)

    knowledge_entries = find_relevant_knowledge(message)
    if not rag_context:
        knowledge_context = "\n\n".join(f"**{e['topic']}**:\n{e['content']}" for e in knowledge_entries)
        rag_context = knowledge_context

    history = await _summarize_history(conversation_history)

    system_prompt = build_lawyer_system_prompt(language, rag_context, document_context)
    messages = _build_messages(message, history, system_prompt)

    full_response = ""
    streamed = False

    async for chunk in _try_ai_providers_streaming(
        messages,
        max_tokens=settings.ai_lawyer_max_tokens,
        temperature=settings.ai_lawyer_temperature,
    ):
        streamed = True
        full_response += chunk
        yield f"data: {json.dumps({'token': chunk})}\n\n"

    if not streamed:
        response_text = await _try_ai_providers(
            messages,
            max_tokens=settings.ai_lawyer_max_tokens,
            temperature=settings.ai_lawyer_temperature,
        )
        if not response_text:
            response_text = lawyer_fallback_response(knowledge_entries, rag_context)
        full_response = response_text
        yield f"data: {json.dumps({'token': response_text})}\n\n"

    metadata = _extract_legal_metadata(full_response)
    follow_ups = _generate_follow_ups(message, full_response)

    yield f"data: {
        json.dumps(
            {
                'done': True,
                'legalBasis': metadata['legalBasis'],
                'nextSteps': metadata['nextSteps'],
                'deadlines': metadata['deadlines'],
                'costs': metadata['costs'],
                'complexity': metadata['complexity'],
                'sources': sources,
                'followUps': follow_ups,
                'fullResponse': full_response,
            }
        )
    }\n\n"


async def get_lawyer_response(
    message: str,
    conversation_history: list[dict] | None = None,
    language: str = "en",
    document_context: str = "",
) -> dict:
    """Non-streaming lawyer response (used for PDF export context)."""
    conversation_history = conversation_history or []

    rag_context, sources = await rag.search_with_context(message, max_chars=12000)
    knowledge_entries = find_relevant_knowledge(message)
    if not rag_context:
        knowledge_context = "\n\n".join(f"**{e['topic']}**:\n{e['content']}" for e in knowledge_entries)
        rag_context = knowledge_context

    history = await _summarize_history(conversation_history)
    system_prompt = build_lawyer_system_prompt(language, rag_context, document_context)
    messages = _build_messages(message, history, system_prompt)

    response_text = await _try_ai_providers(
        messages,
        max_tokens=settings.ai_lawyer_max_tokens,
        temperature=settings.ai_lawyer_temperature,
    )
    if not response_text:
        response_text = lawyer_fallback_response(knowledge_entries, rag_context)

    metadata = _extract_legal_metadata(response_text)
    follow_ups = _generate_follow_ups(message, response_text)

    return {
        "response": response_text,
        **metadata,
        "sources": sources,
        "followUps": follow_ups,
    }

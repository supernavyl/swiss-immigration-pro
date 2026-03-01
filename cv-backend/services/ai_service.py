from __future__ import annotations

import json
import os
from typing import Any

import httpx

from models.cv_data import AIGenerateRequest, AIImproveRequest, AISuggestRequest

API_KEY = os.getenv("AI_API_KEY", "")
AI_BASE_URL = os.getenv("AI_BASE_URL", "https://api.openai.com/v1")
AI_MODEL = os.getenv("AI_MODEL", "gpt-4o-mini")


async def _chat(system: str, user: str) -> str:
    if not API_KEY:
        return _fallback_response(user)

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            f"{AI_BASE_URL}/chat/completions",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={
                "model": AI_MODEL,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                "temperature": 0.7,
            },
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]


def _fallback_response(prompt: str) -> str:
    return json.dumps({
        "summary": "Experienced professional with a proven track record of delivering results in dynamic environments. Skilled in cross-functional collaboration, strategic planning, and driving operational excellence.",
        "achievements": [
            "Led cross-functional initiatives resulting in measurable improvements",
            "Developed and implemented strategies that enhanced team productivity",
            "Managed stakeholder relationships across multiple departments",
        ],
        "skills": ["Project Management", "Strategic Planning", "Team Leadership", "Data Analysis", "Process Optimization"],
    })


async def generate_cv_content(req: AIGenerateRequest) -> dict[str, Any]:
    system = """You are a professional Swiss CV writer. Generate CV content optimized for the Swiss job market.
Return valid JSON with these keys: summary, work_experience (array of {job_title, company, achievements}), 
skills (array of {name, category}), and keywords (array of strings).
Always include Swiss-specific conventions: formal tone, quantified achievements, CEFR language levels."""

    user = f"Job description: {req.job_description}"
    if req.target_role:
        user += f"\nTarget role: {req.target_role}"
    if req.industry:
        user += f"\nIndustry: {req.industry}"
    if req.personal_info:
        user += f"\nCandidate: {req.personal_info.first_name} {req.personal_info.last_name}, {req.personal_info.title}"

    raw = await _chat(system, user)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        start = raw.find("{")
        end = raw.rfind("}") + 1
        if start >= 0 and end > start:
            return json.loads(raw[start:end])
        return {"summary": raw, "skills": [], "work_experience": [], "keywords": []}


async def improve_section(req: AIImproveRequest) -> str:
    system = f"""You are a professional CV writer specializing in Swiss resumes.
Improve the following {req.section} section. Tone: {req.tone}.
Return ONLY the improved text, no explanations."""

    user = req.content
    if req.context:
        user = f"Context: {req.context}\n\nContent to improve:\n{req.content}"

    return await _chat(system, user)


async def suggest_content(req: AISuggestRequest) -> list[str]:
    system = """You are a CV writing assistant for Swiss professionals.
Suggest 3-5 concise options for the given CV field.
Return a JSON array of strings. No explanations."""

    context_str = json.dumps(req.context) if req.context else ""
    user = f"Field: {req.field}\nCurrent value: {req.current_value}\nContext: {context_str}"

    raw = await _chat(system, user)
    try:
        result = json.loads(raw)
        if isinstance(result, list):
            return result
    except json.JSONDecodeError:
        pass
    return [line.strip("- ").strip() for line in raw.strip().split("\n") if line.strip()]

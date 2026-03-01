from fastapi import APIRouter

from models.cv_data import (
    AIGenerateRequest,
    AIImproveRequest,
    AISuggestRequest,
    ATSAnalyzeRequest,
)
from services.ai_service import generate_cv_content, improve_section, suggest_content
from services.ats_analyzer import analyze_ats, optimize_for_ats

router = APIRouter()


@router.post("/generate")
async def ai_generate(body: AIGenerateRequest):
    result = await generate_cv_content(body)
    return {"success": True, "data": result}


@router.post("/improve")
async def ai_improve(body: AIImproveRequest):
    result = await improve_section(body)
    return {"success": True, "improved": result}


@router.post("/suggest")
async def ai_suggest(body: AISuggestRequest):
    result = await suggest_content(body)
    return {"success": True, "suggestions": result}


@router.post("/ats/analyze")
async def ats_analyze(body: ATSAnalyzeRequest):
    result = analyze_ats(body.cv_data, body.job_description)
    return result.model_dump()


@router.post("/ats/optimize")
async def ats_optimize(body: ATSAnalyzeRequest):
    result = optimize_for_ats(body.cv_data, body.job_description)
    return {"success": True, "data": result}

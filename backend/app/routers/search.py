from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/search", tags=["search"])

SEARCH_INDEX = [
    {
        "id": "visas",
        "title": "Visa Types & Permits",
        "description": "Complete guide to Swiss permits",
        "url": "/visas",
        "category": "Permits",
        "keywords": ["visa", "permit", "l permit", "b permit", "c permit"],
    },
    {
        "id": "employment",
        "title": "Employment Hub",
        "description": "Swiss job market, quotas, work permits",
        "url": "/employment",
        "category": "Work",
        "keywords": ["job", "work", "employment", "quota", "salary"],
    },
    {
        "id": "citizenship",
        "title": "Citizenship Pathways",
        "description": "Swiss naturalization guide",
        "url": "/citizenship",
        "category": "Citizenship",
        "keywords": ["citizenship", "naturalization", "passport", "swiss citizen"],
    },
    {
        "id": "cantons",
        "title": "Canton Information",
        "description": "All 26 Swiss cantons",
        "url": "/cantons",
        "category": "Regions",
        "keywords": ["canton", "zurich", "geneva", "bern", "basel"],
    },
    {
        "id": "cv-templates",
        "title": "CV Templates",
        "description": "Professional Swiss CV templates",
        "url": "/cv-templates",
        "category": "Tools",
        "keywords": ["cv", "resume", "template", "job application"],
    },
    {
        "id": "pricing",
        "title": "Pricing Plans",
        "description": "Subscription plans and features",
        "url": "/pricing",
        "category": "Pricing",
        "keywords": ["price", "plan", "subscription", "cost", "pack"],
    },
    {
        "id": "resources",
        "title": "Resources & Downloads",
        "description": "Templates, checklists, guides",
        "url": "/resources",
        "category": "Resources",
        "keywords": ["resource", "download", "template", "checklist", "guide"],
    },
    {
        "id": "faq",
        "title": "FAQ",
        "description": "Frequently asked questions",
        "url": "/faq",
        "category": "Help",
        "keywords": ["faq", "question", "help", "how"],
    },
    {
        "id": "tools",
        "title": "Immigration Tools",
        "description": "Calculators and planners",
        "url": "/tools",
        "category": "Tools",
        "keywords": ["tool", "calculator", "planner", "timeline"],
    },
    {
        "id": "contact",
        "title": "Contact Us",
        "description": "Get in touch",
        "url": "/contact",
        "category": "Help",
        "keywords": ["contact", "help", "support", "email"],
    },
    {
        "id": "dashboard",
        "title": "Dashboard",
        "description": "Your personal dashboard",
        "url": "/dashboard",
        "category": "Account",
        "keywords": ["dashboard", "account", "profile", "progress"],
    },
    {
        "id": "modules",
        "title": "Learning Modules",
        "description": "Comprehensive immigration courses",
        "url": "/dashboard",
        "category": "Learning",
        "keywords": ["module", "course", "learn", "study"],
    },
]


class SearchRequest(BaseModel):
    query: str


@router.post("")
async def search(body: SearchRequest):
    query = body.query.strip()
    if not query or len(query) < 2:
        return {"results": [], "aiSuggestion": None, "directAnswer": None}

    search_term = query.lower()
    results = []

    for item in SEARCH_INDEX:
        score = 0
        for kw in item["keywords"]:
            if kw in search_term:
                score += 2
        if search_term in item["title"].lower():
            score += 3
        if search_term in item["description"].lower():
            score += 1
        if score > 0:
            results.append({**item, "_score": score})

    results.sort(key=lambda x: x["_score"], reverse=True)
    # Remove internal score
    for r in results:
        r.pop("_score", None)

    return {"results": results[:8], "aiSuggestion": None, "directAnswer": None, "hasAI": False}

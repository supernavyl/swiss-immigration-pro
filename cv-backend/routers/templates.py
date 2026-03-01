from fastapi import APIRouter, HTTPException

from models.templates import get_all_templates, get_template_by_id

router = APIRouter()


@router.get("")
async def list_templates():
    return {"templates": [t.model_dump() for t in get_all_templates()]}


@router.get("/{template_id}")
async def get_template(template_id: str):
    t = get_template_by_id(template_id)
    if not t:
        raise HTTPException(404, "Template not found")
    return {"template": t.model_dump()}

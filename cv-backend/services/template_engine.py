from __future__ import annotations

from pathlib import Path

from jinja2 import Environment, FileSystemLoader

from models.cv_data import CVData
from models.templates import get_template_by_id, TemplateMetadata, TemplateColors

TEMPLATE_DIR = Path(__file__).parent.parent / "templates" / "html"
CSS_DIR = Path(__file__).parent.parent / "templates" / "css"

env = Environment(
    loader=FileSystemLoader(str(TEMPLATE_DIR)),
    autoescape=True,
)


def _read_css(name: str) -> str:
    path = CSS_DIR / f"{name}.css"
    if path.exists():
        return path.read_text()
    return ""


def render_cv_html(cv_data: CVData, template_id: str) -> str:
    meta = get_template_by_id(template_id)
    if not meta:
        meta = get_template_by_id("swiss-classic")
    assert meta is not None

    template_file = f"{template_id.replace('-', '_')}.html"
    try:
        template = env.get_template(template_file)
    except Exception:
        template = env.get_template("swiss_classic.html")

    css = _read_css("base") + "\n" + _read_css(template_id.replace("-", "_"))

    return template.render(
        cv=cv_data.model_dump(),
        meta=meta.model_dump(),
        css=css,
        pi=cv_data.personal_info,
        skills_by_category=_group_skills(cv_data),
    )


def _group_skills(cv_data: CVData) -> dict:
    groups: dict[str, list] = {}
    for s in cv_data.skills:
        cat = s.category.value if hasattr(s.category, "value") else str(s.category)
        groups.setdefault(cat, []).append(s)
    return groups

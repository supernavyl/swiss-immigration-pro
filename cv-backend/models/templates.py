from __future__ import annotations

from pydantic import BaseModel


class TemplateColors(BaseModel):
    primary: str = "#1e3a5f"
    secondary: str = "#2563eb"
    accent: str = "#0ea5e9"
    text: str = "#1e293b"
    muted: str = "#64748b"
    background: str = "#ffffff"


class TemplateMetadata(BaseModel):
    id: str
    name: str
    description: str
    category: str
    preview_image: str = ""
    colors: TemplateColors = TemplateColors()
    layout: str = "single-column"
    font_family: str = "Inter"
    industries: list[str] = []
    is_premium: bool = False


TEMPLATES: list[TemplateMetadata] = [
    TemplateMetadata(
        id="swiss-classic",
        name="Swiss Classic",
        description="Traditional Swiss CV with serif fonts, structured sections, and professional photo placement",
        category="Traditional",
        layout="single-column",
        font_family="Merriweather",
        colors=TemplateColors(primary="#1a1a2e", secondary="#16213e", accent="#0f3460"),
        industries=["General", "Government", "Banking"],
    ),
    TemplateMetadata(
        id="modern-zurich",
        name="Modern Zürich",
        description="Clean sans-serif design with blue accents and two-column layout",
        category="Modern",
        layout="two-column",
        font_family="Inter",
        colors=TemplateColors(primary="#1e3a5f", secondary="#2563eb", accent="#3b82f6"),
        industries=["Technology", "Finance", "Consulting"],
    ),
    TemplateMetadata(
        id="executive-geneva",
        name="Executive Geneva",
        description="Premium dark header with gold accents for senior leadership",
        category="Executive",
        layout="single-column",
        font_family="Playfair Display",
        colors=TemplateColors(primary="#1a1a2e", secondary="#c9a84c", accent="#d4af37"),
        industries=["Executive", "Finance", "Legal"],
    ),
    TemplateMetadata(
        id="tech-startup",
        name="Tech Startup",
        description="Developer-friendly layout with monospace touches and skill visualizations",
        category="Tech",
        layout="two-column",
        font_family="JetBrains Mono",
        colors=TemplateColors(primary="#0f172a", secondary="#6366f1", accent="#818cf8"),
        industries=["Technology", "Startup", "Engineering"],
    ),
    TemplateMetadata(
        id="creative-portfolio",
        name="Creative Portfolio",
        description="Bold colors and asymmetric layout for creative professionals",
        category="Creative",
        layout="asymmetric",
        font_family="Inter",
        colors=TemplateColors(primary="#7c3aed", secondary="#ec4899", accent="#f43f5e"),
        industries=["Design", "Marketing", "Media"],
    ),
    TemplateMetadata(
        id="minimal-basel",
        name="Minimal Basel",
        description="Ultra-clean design with maximum whitespace",
        category="Minimal",
        layout="single-column",
        font_family="Inter",
        colors=TemplateColors(primary="#18181b", secondary="#3f3f46", accent="#52525b"),
        industries=["General", "Technology", "Consulting"],
    ),
    TemplateMetadata(
        id="academic-bern",
        name="Academic Bern",
        description="Publication-ready formal layout for academia and research",
        category="Academic",
        layout="single-column",
        font_family="Merriweather",
        colors=TemplateColors(primary="#1e293b", secondary="#0369a1", accent="#0284c7"),
        industries=["Academia", "Research", "Education"],
    ),
    TemplateMetadata(
        id="finance-lucerne",
        name="Finance Lucerne",
        description="Conservative and structured layout for financial professionals",
        category="Finance",
        layout="single-column",
        font_family="Inter",
        colors=TemplateColors(primary="#1e293b", secondary="#0d4f4f", accent="#115e59"),
        industries=["Finance", "Banking", "Insurance"],
    ),
    TemplateMetadata(
        id="healthcare-pro",
        name="Healthcare Pro",
        description="Clean clinical design with prominent certifications",
        category="Healthcare",
        layout="two-column",
        font_family="Inter",
        colors=TemplateColors(primary="#1e293b", secondary="#0891b2", accent="#06b6d4"),
        industries=["Healthcare", "Pharmaceutical", "Medical"],
    ),
    TemplateMetadata(
        id="legal-precision",
        name="Legal Precision",
        description="Formal serif typography for legal professionals",
        category="Legal",
        layout="single-column",
        font_family="Merriweather",
        colors=TemplateColors(primary="#1c1917", secondary="#44403c", accent="#78716c"),
        industries=["Legal", "Compliance", "Government"],
    ),
    TemplateMetadata(
        id="consultant-elite",
        name="Consultant Elite",
        description="Two-column sidebar with key metrics and engagement history",
        category="Consulting",
        layout="sidebar",
        font_family="Inter",
        colors=TemplateColors(primary="#0f172a", secondary="#1d4ed8", accent="#3b82f6"),
        industries=["Consulting", "Strategy", "Management"],
    ),
    TemplateMetadata(
        id="marketing-bold",
        name="Marketing Bold",
        description="Modern color blocks and brand personality for marketers",
        category="Marketing",
        layout="asymmetric",
        font_family="Inter",
        colors=TemplateColors(primary="#be123c", secondary="#e11d48", accent="#fb7185"),
        industries=["Marketing", "Sales", "Media"],
    ),
    TemplateMetadata(
        id="engineering-blue",
        name="Engineering Blue",
        description="Technical project-focused layout with skills matrix",
        category="Engineering",
        layout="two-column",
        font_family="Inter",
        colors=TemplateColors(primary="#1e3a5f", secondary="#2563eb", accent="#60a5fa"),
        industries=["Engineering", "Manufacturing", "Construction"],
    ),
    TemplateMetadata(
        id="hospitality-warm",
        name="Hospitality Warm",
        description="Warm tones with prominent language skills for hospitality",
        category="Hospitality",
        layout="single-column",
        font_family="Inter",
        colors=TemplateColors(primary="#78350f", secondary="#b45309", accent="#d97706"),
        industries=["Hospitality", "Tourism", "F&B"],
    ),
    TemplateMetadata(
        id="retail-fresh",
        name="Retail Fresh",
        description="Approachable and achievement-focused for retail professionals",
        category="Retail",
        layout="single-column",
        font_family="Inter",
        colors=TemplateColors(primary="#14532d", secondary="#15803d", accent="#22c55e"),
        industries=["Retail", "Customer Service", "Sales"],
    ),
]


def get_template_by_id(template_id: str) -> TemplateMetadata | None:
    return next((t for t in TEMPLATES if t.id == template_id), None)


def get_all_templates() -> list[TemplateMetadata]:
    return TEMPLATES

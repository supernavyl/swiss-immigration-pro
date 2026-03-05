"""
SIP-AI Knowledge Module — single source of truth for all AI personality,
site knowledge, prompt construction, and link mapping.

Both the chatbot (ai_service) and legal assistant (lawyer_service)
import from this module instead of maintaining their own copies.
"""

from __future__ import annotations

from typing import Any

# ---------------------------------------------------------------------------
# Shared identity & personality
# ---------------------------------------------------------------------------

SIP_AI_PERSONALITY = """\
You are **SIP-AI**, the expert AI assistant for Swiss Immigration Pro.

## Character
- Professional yet warm, culturally Swiss, proactive helper.
- You have access to official Swiss immigration documents (Weisungen, \
Handbuch BüG, FNIA, AFMP) and comprehensive platform data.
- You work for Swiss Immigration Pro, a platform that helps people \
navigate Swiss immigration, work permits, and citizenship.

## Core Rules
- Always respond in the user's language. Match their formality level.
- Include relevant internal page links as markdown: [Link Text](/page-url).
- Only cite real Swiss laws and regulations — never invent article numbers.
- Stay on topic: Swiss immigration, residency, employment, citizenship, \
and the SIP platform. For other topics, politely redirect.
- When relevant, mention platform features with links (tools, modules, \
consultation, marketplace) — be helpful, not pushy."""

CHAT_MODE_RULES = """\
## Chat Mode Rules
1. Start with a concise direct answer (1-2 sentences), then expand with \
bullet points or numbered steps, then end with relevant links.
2. Use markdown for readability: **bold** key terms, numbered steps for \
processes, bullet points for lists.
3. Suggest relevant tools and modules when applicable.
4. End responses with a brief suggestion of what the user might explore next.
5. Gently mention upgraded plans only when directly relevant."""

LEGAL_MODE_RULES = """\
## Legal Mode Identity
You are **SIP-AI Legal**, a senior AI-powered immigration legal assistant. \
You are trained on Swiss immigration law and provide analysis informed by \
15+ years of case knowledge from cantonal migration offices, the State \
Secretariat for Migration (SEM), and the Federal Administrative Court \
(BVGer / TAF). You are NOT a licensed attorney.

## Legal Credentials
Full, authoritative access to:
  - **FNIA / AIG / LEI** — Federal Act on Foreign Nationals and Integration (SR 142.20)
  - **BüG / LN** — Swiss Citizenship Act (SR 141.0)
  - **AFMP / ALCP** — Agreement on Free Movement of Persons (SR 0.142.112.681)
  - **OASE / OLCP** — Ordinance on Admission, Stay and Employment (SR 142.201)
  - **OLE** — Ordinance on the Introduction of Free Movement (SR 142.203)
  - **AsylG / LAsi** — Asylum Act (SR 142.31)
  - **VZAE / OASA** — Ordinance on Admission, Residence and Employment (SR 142.201)
  - **Weisungen SEM** — Official SEM directives and circulars
  - **Handbuch Bürgerrecht** — Handbook on Swiss citizenship law

## Legal Reasoning Process (internal — do not show to user)
1. Identify the legal issue(s) and applicable area of law
2. Determine nationality category (EU/EFTA vs. third-country)
3. Identify relevant federal law articles
4. Consider cantonal variations and SEM directives
5. Assess complexity and whether professional legal counsel is needed
6. Formulate concrete, actionable advice

## Response Structure
1. **Direct Legal Answer** — 2-3 sentences, state applicable legal framework
2. **Detailed Analysis** — Legal reasoning with specific article references
3. **Legal Basis** — "Art. [number] [Law] — [description]", SR number on first mention
4. **Practical Next Steps** — 3-5 numbered actionable steps
5. **Important Deadlines** — If applicable, highlight legal deadlines
6. **Cost Estimate** — If applicable, typical fees
7. **Disclaimer** — For complex cases, recommend licensed immigration lawyer

## Legal Rules
- ONLY cite real Swiss law articles. NEVER invent article numbers.
- Professional, authoritative, yet empathetic tone.
- Use trilingual terminology where helpful (DE/FR/IT on first use).
- Flag complexity for appeals, deportation, criminal records, hardship (Art. 30 FNIA).
- Note cantonal variations in requirements and processing times.
- Temporal awareness: processing times are estimates, direct to cantonal office."""

# ---------------------------------------------------------------------------
# Comprehensive site map (all 80+ pages)
# ---------------------------------------------------------------------------

COMPREHENSIVE_SITE_MAP = """\
# Swiss Immigration Pro — Site Map

## Immigration Guides
| Path | Purpose |
|---|---|
| / | Homepage with live immigration statistics |
| /visas | All visa / permit types (L, B, G, C) with guides |
| /visas/b-permit-guide | In-depth B Permit (residence) guide |
| /visas/c-permit-guide | In-depth C Permit (permanent settlement) guide |
| /visas/l-permit-guide | In-depth L Permit (short-term) guide |
| /employment | Employment hub: quotas, job market, employer sponsorship |
| /citizenship | Citizenship pathways, naturalization, dual citizenship |
| /cantons | All 26 Swiss cantons — taxes, lifestyle, immigration stats |

## Tools
| Path | Purpose |
|---|---|
| /tools/permit-calculator | Find which permit type fits your situation |
| /tools/cv-editor | Swiss-style CV builder with 15 templates |
| /tools/timeline-planner | Immigration timeline and milestone tracker |
| /tools/dossier-generator | Application dossier generator |
| /tools/apartment-finder | Apartment search tool for relocating |
| /cv-templates | Browse and download Swiss CV templates |

## Learning Modules (31 total)
| Pack | Modules | Path Pattern |
|---|---|---|
| Free (3) | Immigration basics | /modules/free-01 to free-03 |
| Immigration Pack (8) | Permits, work, CV, salary, cantons | /modules/imm-01 to imm-08 |
| Advanced Pack (10) | Tax, integration, family, housing, banking | /modules/adv-01 to adv-10 |
| Citizenship Pro (10) | Naturalization, language, history, rights | /modules/cit-01 to cit-10 |

## Services
| Path | Purpose |
|---|---|
| /consultation | Book professional consultation (CHF 80 quick / CHF 200 full) |
| /marketplace | Verified immigration lawyers & agencies directory |
| /pricing | Subscription plans and one-time products |
| /quiz | Immigration pathway quiz — personalized recommendations |

## B2B Corporate
| Path | Purpose |
|---|---|
| /b2b | Corporate immigration solutions landing page |
| /b2b/dashboard | Company dashboard (authenticated) |
| /b2b/employees | Employee relocation management |
| /b2b/reports | Compliance and analytics reports |

## User Account
| Path | Purpose |
|---|---|
| /dashboard | Personal dashboard, progress, saved content |
| /profile | Account settings and preferences |
| /auth/login | Sign in |
| /auth/register | Create account |

## Information
| Path | Purpose |
|---|---|
| /blog | Immigration news, tips, and guides |
| /faq | Frequently asked questions |
| /about | About Swiss Immigration Pro |
| /contact | Contact form and support |
| /case-studies | Real immigration success stories |"""

# ---------------------------------------------------------------------------
# Pricing knowledge
# ---------------------------------------------------------------------------

PRICING_KNOWLEDGE = """\
## Pricing (CHF)
### Subscriptions
| Plan | Price | Includes |
|---|---|---|
| Free | 0 | Basic guides, 10 AI messages/day, 3 free modules |
| Immigration Pack | 9/mo | Full guides, CV templates, unlimited AI, 8 modules |
| Advanced Pack | 29/mo | Masterclass, AI tutor, progress tracking, 10 modules |
| Citizenship Pro | 79/mo | Complete citizenship roadmap, lawyer directory, 10 modules |

### One-Time Products
| Product | Price |
|---|---|
| Quick Consultation (30 min) | CHF 80 |
| Full Consultation (60 min) | CHF 200 |
| Citizenship Roadmap PDF | CHF 97 |
| Immigration Masterclass | CHF 497 |

### B2B Plans
| Plan | Price |
|---|---|
| Starter (up to 10 employees) | CHF 199/mo |
| Professional (up to 50) | CHF 499/mo |
| Enterprise (unlimited) | CHF 999/mo |"""

# ---------------------------------------------------------------------------
# Knowledge base (expanded from 14 to ~20 entries)
# ---------------------------------------------------------------------------

KNOWLEDGE_BASE: list[dict[str, Any]] = [
    {
        "topic": "visa_types",
        "keywords": [
            "visa",
            "permit",
            "l permit",
            "b permit",
            "c permit",
            "g permit",
            "aufenthaltsbewilligung",
            "niederlassungsbewilligung",
        ],
        "content": (
            "Switzerland has several permit types:\n"
            "- **L Permit** (short-term): up to 1 year, tied to employment contract\n"
            "- **B Permit** (residence): renewable annually, for employed/self-employed/students\n"
            "- **C Permit** (permanent settlement): after 5 years (EU/EFTA) or 10 years (others)\n"
            "- **G Permit** (cross-border commuter): live abroad, work in Switzerland\n"
            "EU/EFTA citizens benefit from the Agreement on the Free Movement of Persons (AFMP)."
        ),
        "links": [
            {"label": "Visa Types Guide", "url": "/visas"},
            {"label": "Permit Calculator", "url": "/tools/permit-calculator"},
        ],
    },
    {
        "topic": "work_permits",
        "keywords": [
            "work",
            "employment",
            "job",
            "quota",
            "hiring",
            "employer",
            "sponsorship",
            "arbeitserlaubnis",
        ],
        "content": (
            "Work permits require employer sponsorship for third-country nationals. "
            "Annual quotas apply (set by the Federal Council). EU/EFTA citizens have facilitated access "
            "under bilateral agreements. Processing typically takes 6-12 weeks. "
            "The employer must prove no suitable local/EU candidate was available (labour market test)."
        ),
        "links": [
            {"label": "Employment Hub", "url": "/employment"},
            {"label": "CV Builder", "url": "/tools/cv-editor"},
        ],
    },
    {
        "topic": "citizenship",
        "keywords": [
            "citizenship",
            "naturalization",
            "passport",
            "swiss citizen",
            "einbuergerung",
            "nationalite",
        ],
        "content": (
            "Swiss citizenship (ordinary naturalization) requires:\n"
            "- 10 years of legal residence (years between ages 8-18 count double)\n"
            "- Language proficiency: oral B1, written A2 in a national language\n"
            "- Integration into Swiss customs and traditions\n"
            "- Clean criminal record\n"
            "- Financial self-sufficiency (no social welfare in last 3 years)\n"
            "Spouses of Swiss citizens: simplified naturalization after 5 years of residence + 3 years of marriage. "
            "The process involves federal, cantonal, and communal levels."
        ),
        "links": [
            {"label": "Citizenship Guide", "url": "/citizenship"},
            {"label": "Citizenship Modules", "url": "/modules/cit-01"},
        ],
    },
    {
        "topic": "cantons",
        "keywords": [
            "canton",
            "zurich",
            "geneva",
            "bern",
            "basel",
            "vaud",
            "lucerne",
            "ticino",
            "kanton",
        ],
        "content": (
            "Switzerland has 26 cantons, each with its own immigration office, "
            "tax rates, and integration requirements. "
            "Popular expat cantons: Zurich (business hub), Geneva (international orgs), Vaud (tech & pharma), "
            "Basel (pharma & culture), Zug (low taxes). Tax rates can differ by 2-3x between cantons."
        ),
        "links": [{"label": "Canton Information", "url": "/cantons"}],
    },
    {
        "topic": "pricing",
        "keywords": [
            "price",
            "cost",
            "subscription",
            "plan",
            "pack",
            "upgrade",
            "premium",
            "free",
        ],
        "content": (
            "Swiss Immigration Pro offers four tiers:\n"
            "1. **Free**: Basic guides, 10 AI messages/day, 3 free modules\n"
            "2. **Immigration Pack (CHF 9/mo)**: Full guides, CV templates, unlimited AI chat, 8 modules\n"
            "3. **Advanced Pack (CHF 29/mo)**: Masterclass modules, AI tutor, progress tracking, 10 modules\n"
            "4. **Citizenship Pro (CHF 79/mo)**: Complete citizenship roadmap, lawyer directory, 10 modules\n\n"
            "One-time products: Quick Consultation (CHF 80), Full Consultation (CHF 200), "
            "Citizenship Roadmap PDF (CHF 97), Immigration Masterclass (CHF 497)."
        ),
        "links": [{"label": "Pricing Plans", "url": "/pricing"}],
    },
    {
        "topic": "family_reunification",
        "keywords": [
            "family",
            "spouse",
            "children",
            "reunification",
            "familiennachzug",
            "regroupement",
        ],
        "content": (
            "Family reunification allows permit holders to bring close family members to Switzerland:\n"
            "- **B/C permit holders**: spouse + children under 18\n"
            "- Must have adequate housing and financial means\n"
            "- Application within 5 years (B permit) or 12 months (C permit) for priority processing\n"
            "- EU/EFTA family members: facilitated process under AFMP\n"
            "- Third-country family: subject to cantonal approval and quotas"
        ),
        "links": [{"label": "Family Reunification Module", "url": "/modules/adv-08"}],
    },
    {
        "topic": "health_insurance",
        "keywords": [
            "health",
            "insurance",
            "krankenkasse",
            "lamal",
            "assurance",
            "medical",
        ],
        "content": (
            "Health insurance (KVG/LAMal) is mandatory for all residents:\n"
            "- Must register within 3 months of arrival\n"
            "- Basic insurance covers standard medical care, hospitalization, maternity\n"
            "- Premiums vary by canton, age, and chosen deductible (CHF 300-2500)\n"
            "- Average monthly premium: CHF 350-450 for adults\n"
            "- Premium subsidies available for low-income residents"
        ),
        "links": [{"label": "FAQ", "url": "/faq"}],
    },
    {
        "topic": "taxes",
        "keywords": [
            "tax",
            "taxes",
            "steuern",
            "impot",
            "quellensteuer",
            "withholding",
        ],
        "content": (
            "Swiss taxation operates at three levels: federal, cantonal, and communal.\n"
            "- B permit holders: withholding tax (Quellensteuer) deducted at source\n"
            "- C permit holders / income > CHF 120k: ordinary tax assessment\n"
            "- Tax rates vary significantly by canton (Zug lowest, Geneva highest)\n"
            "- No capital gains tax on private securities\n"
            "- Wealth tax applies in most cantons"
        ),
        "links": [{"label": "Tax Planning Module", "url": "/modules/adv-06"}],
    },
    {
        "topic": "integration",
        "keywords": [
            "integration",
            "language",
            "course",
            "german",
            "french",
            "italian",
            "test",
            "fide",
        ],
        "content": (
            "Integration is key for permit renewals and citizenship:\n"
            "- Language: B1 oral / A2 written in a national language (German, French, Italian, Romansh)\n"
            "- fide test is the standard recognized language exam\n"
            "- Integration agreements may be required by cantonal authorities\n"
            "- Participation in economic, social, and cultural life is assessed\n"
            "- Many cantons offer free/subsidized integration courses"
        ),
        "links": [{"label": "Integration Module", "url": "/modules/adv-05"}],
    },
    {
        "topic": "housing",
        "keywords": [
            "apartment",
            "housing",
            "rent",
            "flat",
            "wohnung",
            "logement",
            "accommodation",
        ],
        "content": (
            "Finding housing in Switzerland can be competitive, especially in Zurich and Geneva:\n"
            "- Average rent: CHF 1,500-2,500/month for a 2-bedroom apartment\n"
            "- Required documents: work contract, salary slips, extract from debt register (Betreibungsregister)\n"
            "- Typical deposit: 1-3 months' rent (held in escrow)\n"
            "- Use our Apartment Finder tool to search listings"
        ),
        "links": [
            {"label": "Apartment Finder", "url": "/tools/apartment-finder"},
            {"label": "Dossier Generator", "url": "/tools/dossier-generator"},
        ],
    },
    {
        "topic": "cv_resume",
        "keywords": [
            "cv",
            "resume",
            "lebenslauf",
            "application",
            "bewerbung",
            "job search",
        ],
        "content": (
            "Swiss CVs have specific conventions:\n"
            "- Photo is standard (professional headshot)\n"
            "- 2 pages maximum\n"
            "- Include nationality, permit status, and languages with levels\n"
            "- Reference letters (Arbeitszeugnisse) are very important\n"
            "- Tailor to the language region (German/French/Italian)\n"
            "We provide 15 Swiss-optimized CV templates you can customize in our CV builder."
        ),
        "links": [
            {"label": "CV Builder", "url": "/tools/cv-editor"},
            {"label": "CV Templates", "url": "/cv-templates"},
        ],
    },
    {
        "topic": "education",
        "keywords": [
            "education",
            "school",
            "university",
            "student",
            "study",
            "studium",
            "etudes",
        ],
        "content": (
            "Education system:\n"
            "- Public schools are free and high quality\n"
            "- International schools available (CHF 20,000-40,000/year)\n"
            "- Student permits (B permit) require university admission + proof of funds (~CHF 21,000/year)\n"
            "- ETH Zurich and EPFL are world-ranked universities\n"
            "- Tuition: CHF 500-2,000/semester at public universities"
        ),
        "links": [{"label": "FAQ", "url": "/faq"}],
    },
    {
        "topic": "banking",
        "keywords": [
            "bank",
            "banking",
            "account",
            "konto",
            "compte",
            "financial",
        ],
        "content": (
            "Opening a bank account:\n"
            "- Required: valid permit, passport, proof of address\n"
            "- Major banks: UBS, PostFinance, Raiffeisen, cantonal banks\n"
            "- Digital banks: Revolut, Neon, Yuh are popular with expats\n"
            "- Salary account typically set up with employer's recommendation"
        ),
        "links": [{"label": "FAQ", "url": "/faq"}],
    },
    {
        "topic": "lawyers",
        "keywords": [
            "lawyer",
            "attorney",
            "legal",
            "consultation",
            "anwalt",
            "avocat",
            "advice",
        ],
        "content": (
            "For complex immigration cases, professional legal advice is recommended:\n"
            "- Our marketplace features verified immigration lawyers\n"
            "- Quick consultation: CHF 80 (30 min), Full consultation: CHF 200 (60 min)\n"
            "- Many lawyers offer initial assessments\n"
            "- Specialized in: permits, appeals, family reunification, citizenship"
        ),
        "links": [
            {"label": "Find a Lawyer", "url": "/marketplace"},
            {"label": "Book Consultation", "url": "/consultation"},
        ],
    },
    # --- NEW entries ---
    {
        "topic": "b2b_corporate",
        "keywords": [
            "b2b",
            "corporate",
            "company",
            "employer",
            "relocation",
            "hr",
            "human resources",
            "employee transfer",
        ],
        "content": (
            "Swiss Immigration Pro offers corporate immigration solutions:\n"
            "- **Starter (CHF 199/mo)**: Up to 10 employees, basic compliance\n"
            "- **Professional (CHF 499/mo)**: Up to 50 employees, full reporting\n"
            "- **Enterprise (CHF 999/mo)**: Unlimited employees, dedicated support\n"
            "Features: employee relocation tracking, compliance reports, bulk permit management, "
            "document templates, and analytics dashboards."
        ),
        "links": [
            {"label": "B2B Solutions", "url": "/b2b"},
        ],
    },
    {
        "topic": "marketplace_services",
        "keywords": [
            "marketplace",
            "directory",
            "provider",
            "agency",
            "referral",
            "rating",
            "review",
        ],
        "content": (
            "The SIP Marketplace connects you with verified immigration professionals:\n"
            "- Lawyers, agencies, and relocation specialists\n"
            "- User ratings and reviews for each provider\n"
            "- Filter by specialization, language, canton, and price range\n"
            "- Direct booking and secure communication\n"
            "- Providers can apply to join at /marketplace/apply"
        ),
        "links": [
            {"label": "Browse Marketplace", "url": "/marketplace"},
        ],
    },
    {
        "topic": "consultation_booking",
        "keywords": [
            "book",
            "booking",
            "appointment",
            "consult",
            "schedule",
            "meeting",
        ],
        "content": (
            "Book a professional immigration consultation:\n"
            "- **Quick Consultation (30 min, CHF 80)**: Focused advice on a specific question\n"
            "- **Full Consultation (60 min, CHF 200)**: Comprehensive case review and strategy\n"
            "What to expect: personalized legal analysis, document checklist, "
            "timeline estimation, and follow-up recommendations."
        ),
        "links": [
            {"label": "Book Now", "url": "/consultation"},
        ],
    },
    {
        "topic": "modules_learning",
        "keywords": [
            "module",
            "course",
            "learn",
            "masterclass",
            "lesson",
            "training",
            "education",
        ],
        "content": (
            "Swiss Immigration Pro offers 31 learning modules across 4 packs:\n"
            "- **Free (3 modules)**: Immigration basics for getting started\n"
            "- **Immigration Pack (8 modules)**: Permits, work authorization, CV, salary, cantons\n"
            "- **Advanced Pack (10 modules)**: Tax planning, integration, family, housing, banking, insurance\n"
            "- **Citizenship Pro (10 modules)**: Naturalization process, language prep, Swiss history, rights\n"
            "Each module includes interactive quizzes, progress tracking, and AI tutor support."
        ),
        "links": [
            {"label": "Browse Modules", "url": "/modules/free-01"},
            {"label": "Pricing", "url": "/pricing"},
        ],
    },
    {
        "topic": "tools_overview",
        "keywords": [
            "tool",
            "calculator",
            "planner",
            "generator",
            "finder",
            "builder",
        ],
        "content": (
            "Our immigration tools help you at every stage:\n"
            "- **Permit Calculator**: Find which permit fits your situation\n"
            "- **CV Builder**: Create Swiss-style CVs with 15 templates\n"
            "- **Timeline Planner**: Track milestones and deadlines\n"
            "- **Dossier Generator**: Build your application dossier\n"
            "- **Apartment Finder**: Search housing listings\n"
            "All tools are available to registered users."
        ),
        "links": [
            {"label": "Permit Calculator", "url": "/tools/permit-calculator"},
            {"label": "CV Builder", "url": "/tools/cv-editor"},
            {"label": "Timeline Planner", "url": "/tools/timeline-planner"},
        ],
    },
    {
        "topic": "eu_efta_pathway",
        "keywords": [
            "eu",
            "efta",
            "european",
            "free movement",
            "bilateral",
            "schengen",
        ],
        "content": (
            "EU/EFTA citizens benefit from the Agreement on Free Movement of Persons (AFMP):\n"
            "- Simplified permit process — no labour market test required\n"
            "- B permit after proving employment or self-sufficiency\n"
            "- C permit after 5 years (instead of 10 for third-country nationals)\n"
            "- Right to bring family members\n"
            "- Cross-border commuter permits (G permit) available\n"
            "Some transitional measures may apply for newer EU member states."
        ),
        "links": [
            {"label": "EU Pathway Guide", "url": "/eu/visas"},
            {"label": "Visa Types", "url": "/visas"},
        ],
    },
]

# ---------------------------------------------------------------------------
# Link-keyword mapping (expanded)
# ---------------------------------------------------------------------------

LINK_MAP: dict[str, dict[str, str]] = {
    "visa": {"label": "Visa Types Guide", "url": "/visas"},
    "permit": {"label": "Visa Types Guide", "url": "/visas"},
    "job": {"label": "Employment Hub", "url": "/employment"},
    "work": {"label": "Employment Hub", "url": "/employment"},
    "employment": {"label": "Employment Hub", "url": "/employment"},
    "hire": {"label": "Employment Hub", "url": "/employment"},
    "citizenship": {"label": "Citizenship Guide", "url": "/citizenship"},
    "naturalization": {"label": "Citizenship Guide", "url": "/citizenship"},
    "passport": {"label": "Citizenship Guide", "url": "/citizenship"},
    "canton": {"label": "Canton Information", "url": "/cantons"},
    "zurich": {"label": "Canton Information", "url": "/cantons"},
    "geneva": {"label": "Canton Information", "url": "/cantons"},
    "price": {"label": "Pricing Plans", "url": "/pricing"},
    "cost": {"label": "Pricing Plans", "url": "/pricing"},
    "plan": {"label": "Pricing Plans", "url": "/pricing"},
    "subscribe": {"label": "Pricing Plans", "url": "/pricing"},
    "cv": {"label": "CV Builder", "url": "/tools/cv-editor"},
    "resume": {"label": "CV Builder", "url": "/tools/cv-editor"},
    "cv-editor": {"label": "CV Builder", "url": "/tools/cv-editor"},
    "cv-templates": {"label": "CV Templates", "url": "/cv-templates"},
    "tool": {"label": "Immigration Tools", "url": "/tools/permit-calculator"},
    "calculator": {"label": "Permit Calculator", "url": "/tools/permit-calculator"},
    "permit-calculator": {"label": "Permit Calculator", "url": "/tools/permit-calculator"},
    "apartment": {"label": "Apartment Finder", "url": "/tools/apartment-finder"},
    "housing": {"label": "Apartment Finder", "url": "/tools/apartment-finder"},
    "rent": {"label": "Apartment Finder", "url": "/tools/apartment-finder"},
    "dossier": {"label": "Dossier Generator", "url": "/tools/dossier-generator"},
    "timeline": {"label": "Timeline Planner", "url": "/tools/timeline-planner"},
    "family": {"label": "Family Reunification", "url": "/modules/adv-08"},
    "spouse": {"label": "Family Reunification", "url": "/modules/adv-08"},
    "module": {"label": "Learning Modules", "url": "/modules/free-01"},
    "course": {"label": "Learning Modules", "url": "/modules/free-01"},
    "quiz": {"label": "Immigration Quiz", "url": "/quiz"},
    "lawyer": {"label": "Find a Lawyer", "url": "/marketplace"},
    "attorney": {"label": "Find a Lawyer", "url": "/marketplace"},
    "legal": {"label": "Find a Lawyer", "url": "/marketplace"},
    "blog": {"label": "Blog & News", "url": "/blog"},
    "faq": {"label": "FAQ", "url": "/faq"},
    "contact": {"label": "Contact Us", "url": "/contact"},
    "tax": {"label": "Tax Planning Module", "url": "/modules/adv-06"},
    "insurance": {"label": "FAQ", "url": "/faq"},
    "health": {"label": "FAQ", "url": "/faq"},
    "b2b": {"label": "B2B Solutions", "url": "/b2b"},
    "corporate": {"label": "B2B Solutions", "url": "/b2b"},
    "marketplace": {"label": "Marketplace", "url": "/marketplace"},
    "consultation": {"label": "Book Consultation", "url": "/consultation"},
    "book": {"label": "Book Consultation", "url": "/consultation"},
    "onboarding": {"label": "Immigration Quiz", "url": "/quiz"},
    "referral": {"label": "Marketplace", "url": "/marketplace"},
}

# ---------------------------------------------------------------------------
# Language names
# ---------------------------------------------------------------------------

LANGUAGE_NAMES: dict[str, str] = {
    "en": "English",
    "de": "German",
    "fr": "French",
    "it": "Italian",
    "es": "Spanish",
    "pt": "Portuguese",
    "zh": "Chinese",
    "ar": "Arabic",
    "hi": "Hindi",
    "ru": "Russian",
    "ja": "Japanese",
    "ko": "Korean",
    "tr": "Turkish",
    "nl": "Dutch",
}


# ===================================================================
# Helper functions
# ===================================================================


def find_relevant_knowledge(query: str) -> list[dict[str, Any]]:
    """Return up to 3 knowledge-base entries that best match *query*."""
    query_lower = query.lower()
    scored: list[tuple[int, dict[str, Any]]] = []
    for entry in KNOWLEDGE_BASE:
        score = sum(1 for kw in entry["keywords"] if kw in query_lower)
        if score > 0:
            scored.append((score, entry))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [s[1] for s in scored[:3]]


def get_relevant_links(query: str) -> list[dict[str, str]]:
    """Return up to 5 relevant page links for *query*."""
    query_lower = query.lower()
    links: list[dict[str, str]] = []
    seen_urls: set[str] = set()

    # From knowledge base matches
    for entry in find_relevant_knowledge(query):
        for link in entry.get("links", []):
            if link["url"] not in seen_urls:
                links.append(link)
                seen_urls.add(link["url"])

    # From keyword map
    for keyword, link in LINK_MAP.items():
        if keyword in query_lower and link["url"] not in seen_urls:
            links.append(link)
            seen_urls.add(link["url"])

    # Default fallback links
    if not links:
        links = [
            {"label": "Visa Types Guide", "url": "/visas"},
            {"label": "Employment Hub", "url": "/employment"},
            {"label": "Pricing Plans", "url": "/pricing"},
        ]

    return links[:5]


def generate_follow_ups(query: str, knowledge_entries: list[dict[str, Any]]) -> list[str]:
    """Generate 2-3 suggested follow-up questions based on the user's query."""
    query_lower = query.lower()
    suggestions: list[str] = []

    topic_follow_ups: dict[str, list[str]] = {
        "visa": [
            "What documents do I need to apply?",
            "How long does processing take?",
            "Can my family join me?",
        ],
        "permit": [
            "What's the difference between B and C permits?",
            "How do I renew my permit?",
            "Can I change employers?",
        ],
        "work": [
            "What are the salary requirements?",
            "Do I need my employer to sponsor me?",
            "What about the labour market test?",
        ],
        "citizenship": [
            "What language level do I need?",
            "How long does naturalization take?",
            "Can I keep my original passport?",
        ],
        "canton": [
            "Which canton has the lowest taxes?",
            "Where do most expats live?",
            "How do cantonal requirements differ?",
        ],
        "family": [
            "Can I bring my spouse?",
            "What about children over 18?",
            "What financial proof is needed?",
        ],
        "tax": [
            "How does withholding tax work?",
            "When do I file a tax return?",
            "Which canton has the best tax rates?",
        ],
        "housing": [
            "Where should I look for apartments?",
            "What documents do landlords require?",
            "How much deposit is typical?",
        ],
        "insurance": [
            "How do I choose a health insurer?",
            "What does basic insurance cover?",
            "Can I get premium subsidies?",
        ],
        "cv": [
            "What format do Swiss employers prefer?",
            "Should I include a photo?",
            "How important are reference letters?",
        ],
        "lawyer": [
            "How much does a consultation cost?",
            "When should I hire an immigration lawyer?",
            "Can a lawyer speed up my application?",
        ],
        "price": [
            "What's included in the free plan?",
            "Can I upgrade anytime?",
            "Is there a money-back guarantee?",
        ],
        "b2b": [
            "What's included in the corporate plans?",
            "How does employee relocation tracking work?",
            "Do you offer volume discounts?",
        ],
        "module": [
            "Which modules are free?",
            "How long does each module take?",
            "Do modules include quizzes?",
        ],
        "tool": [
            "Which tool should I start with?",
            "Is the CV builder free?",
            "Can I export my documents?",
        ],
        "consultation": [
            "What's covered in a consultation?",
            "How do I prepare for my session?",
            "Can I book online?",
        ],
    }

    for keyword, follow_ups in topic_follow_ups.items():
        if keyword in query_lower:
            suggestions.extend(follow_ups)
            break

    if not suggestions:
        suggestions = [
            "What visa type do I need?",
            "How do I start the immigration process?",
            "What are the costs involved?",
        ]

    return suggestions[:3]


# ===================================================================
# System prompt builders
# ===================================================================


def build_chat_system_prompt(
    language: str,
    rag_context: str,
    links_text: str,
) -> str:
    """Build the full system prompt for the chatbot."""
    lang_name = LANGUAGE_NAMES.get(language, "English")

    return f"""{SIP_AI_PERSONALITY}

{CHAT_MODE_RULES}

## Language
Always respond in {lang_name}. Match the user's formality level.

## Site Knowledge
{COMPREHENSIVE_SITE_MAP}

{PRICING_KNOWLEDGE}

## Document Context (from official Swiss sources)
{rag_context}

## Relevant Page Links
{links_text}"""


def build_lawyer_system_prompt(
    language: str,
    rag_context: str,
    user_doc_context: str,
) -> str:
    """Build the full system prompt for the legal assistant."""
    lang_name = LANGUAGE_NAMES.get(language, "English")

    return f"""{SIP_AI_PERSONALITY}

{LEGAL_MODE_RULES}

## Language
Always respond in {lang_name}. Use formal legal language but explain technical terms.

## Document Context (from official Swiss legal sources, retrieved via semantic search)
{rag_context}

{"## User's Uploaded Document Context" + chr(10) + user_doc_context if user_doc_context else ""}

## Platform Resources
- [Visa Types Guide](/visas) — All permit types (L, B, C, G) explained in detail
- [Citizenship Guide](/citizenship) — Ordinary and facilitated naturalization pathways
- [Employment Hub](/employment) — Work permits, quotas, and employer obligations
- [Canton Information](/cantons) — All 26 cantons: requirements, fees, processing times
- [Find a Lawyer](/marketplace) — Directory of verified Swiss immigration lawyers
- [Book Consultation](/consultation) — Professional legal consultation booking
- [CV Builder](/tools/cv-editor) — Swiss-style CV builder with 15 templates
- [Immigration Tools](/tools/permit-calculator) — Permit calculator, timeline planner, dossier generator
- [Learning Modules](/modules/free-01) — 31 immigration and citizenship modules
- [B2B Solutions](/b2b) — Corporate immigration management
- [Immigration Quiz](/quiz) — Personalized pathway recommendations"""


# ===================================================================
# Fallback response (when all AI providers fail)
# ===================================================================


def fallback_response(
    knowledge_entries: list[dict[str, Any]],
    doc_context: str,
    links: list[dict[str, str]],
) -> str:
    """Generate a response from local knowledge when all AI providers fail."""
    if knowledge_entries:
        entry = knowledge_entries[0]
        resp = entry["content"]
        all_links = entry.get("links", []) + links
        unique: list[dict[str, str]] = []
        seen: set[str] = set()
        for lnk in all_links:
            if lnk["url"] not in seen:
                unique.append(lnk)
                seen.add(lnk["url"])
        resp += "\n\n---\nLearn more:\n" + "\n".join(f"- [{link['label']}]({link['url']})" for link in unique[:5])
        return resp
    if doc_context:
        resp = f"Based on official Swiss immigration documents:\n\n{doc_context[:1200]}\n\n---\nUseful links:\n"
        resp += "\n".join(f"- [{link['label']}]({link['url']})" for link in links)
        return resp
    resp = (
        "I'm **SIP-AI**, your Swiss immigration expert! I can help with:\n\n"
        "- Visa & permit types (L, B, C, G)\n"
        "- Work permit applications\n"
        "- Citizenship & naturalization\n"
        "- Canton information\n"
        "- Family reunification\n"
        "- And much more!\n\n"
        "Please ask a specific question, or explore these pages:\n"
    )
    resp += "\n".join(f"- [{link['label']}]({link['url']})" for link in links)
    return resp


def lawyer_fallback_response(
    knowledge_entries: list[dict[str, Any]],
    rag_context: str,
) -> str:
    """Generate a fallback response for the legal assistant."""
    if knowledge_entries:
        entry = knowledge_entries[0]
        return (
            entry["content"] + "\n\n---\nFor detailed legal advice, please [book a consultation](/consultation) "
            "or [find a lawyer](/marketplace) on our platform."
        )
    if rag_context:
        return (
            f"Based on official Swiss immigration documents:\n\n{rag_context[:1500]}\n\n"
            "---\nFor a detailed legal analysis, please [book a consultation](/consultation)."
        )
    return (
        "I am **SIP-AI Legal**, your virtual Swiss immigration law consultant. I can help with:\n\n"
        "- **Permit applications** — L, B, C, G permits and eligibility\n"
        "- **Work authorization** — employer sponsorship, quotas, labour market test\n"
        "- **Citizenship & naturalization** — ordinary and simplified procedures\n"
        "- **Family reunification** — spouse, children, partners\n"
        "- **Appeals & rejections** — legal remedies and deadlines\n\n"
        "Please describe your legal question in detail for a thorough analysis.\n\n"
        "For urgent matters, [book a consultation](/consultation) or [find a lawyer](/marketplace)."
    )

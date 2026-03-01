"""
Translation API — serves the frontend translation dictionaries from the backend
and provides an on-the-fly translation endpoint for dynamic content.
"""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/translate", tags=["translate"])

# ── Inline translation dictionaries (mirrored from frontend for SSR / email use) ─

_TRANSLATIONS: dict[str, dict[str, str]] = {
    # Only the most critical keys are mirrored here.
    # The frontend owns the full dictionary.  This endpoint lets the backend
    # or external consumers (emails, PDF exports) grab translations too.
    "en": {
        "hero.title": "Your Path to Swiss Residency",
        "hero.cta": "Start Free Assessment",
        "pricing.title": "Swiss Immigration Pricing Plans",
        "contact.title": "Get in Touch",
        "faq.title": "Frequently Asked Questions",
        "common.loading": "Loading...",
        "common.error": "Something went wrong",
        "error.404": "Page Not Found",
    },
    "de": {
        "hero.title": "Ihr Weg zur Schweizer Aufenthaltsbewilligung",
        "hero.cta": "Kostenlose Bewertung starten",
        "pricing.title": "Preise für Schweizer Immigrationsdienste",
        "contact.title": "Kontaktieren Sie uns",
        "faq.title": "Häufig gestellte Fragen",
        "common.loading": "Wird geladen...",
        "common.error": "Etwas ist schiefgelaufen",
        "error.404": "Seite nicht gefunden",
    },
    "fr": {
        "hero.title": "Votre chemin vers la résidence suisse",
        "hero.cta": "Évaluation gratuite",
        "pricing.title": "Tarifs des services d'immigration suisse",
        "contact.title": "Contactez-nous",
        "faq.title": "Questions fréquemment posées",
        "common.loading": "Chargement...",
        "common.error": "Une erreur s'est produite",
        "error.404": "Page non trouvée",
    },
    "it": {
        "hero.title": "Il tuo percorso verso la residenza svizzera",
        "hero.cta": "Valutazione gratuita",
        "pricing.title": "Prezzi dei servizi di immigrazione svizzera",
        "contact.title": "Contattaci",
        "faq.title": "Domande frequenti",
        "common.loading": "Caricamento...",
        "common.error": "Qualcosa è andato storto",
        "error.404": "Pagina non trovata",
    },
    "es": {
        "hero.title": "Tu camino hacia la residencia suiza",
        "hero.cta": "Evaluación gratuita",
        "pricing.title": "Precios de servicios de inmigración suiza",
        "contact.title": "Contáctanos",
        "faq.title": "Preguntas frecuentes",
        "common.loading": "Cargando...",
        "common.error": "Algo salió mal",
        "error.404": "Página no encontrada",
    },
    "pt": {
        "hero.title": "Seu caminho para a residência suíça",
        "hero.cta": "Avaliação gratuita",
        "pricing.title": "Preços dos serviços de imigração suíça",
        "contact.title": "Entre em contato",
        "faq.title": "Perguntas frequentes",
        "common.loading": "Carregando...",
        "common.error": "Algo deu errado",
        "error.404": "Página não encontrada",
    },
}


class TranslateRequest(BaseModel):
    keys: list[str]
    locale: str = "en"


class TranslateBatchResponse(BaseModel):
    locale: str
    translations: dict[str, str]


@router.get("/locales")
async def list_locales():
    """Return the list of supported locale codes."""
    return {
        "locales": list(_TRANSLATIONS.keys()),
        "default": "en",
        "full": ["en", "de", "fr", "it", "es", "pt"],
    }


@router.post("/batch", response_model=TranslateBatchResponse)
async def translate_batch(body: TranslateRequest):
    """
    Return translations for a list of keys in the requested locale.
    Falls back to English when a key is missing.
    """
    locale = body.locale.split("-")[0].lower() if body.locale else "en"
    dict_for_locale = _TRANSLATIONS.get(locale, _TRANSLATIONS["en"])
    en = _TRANSLATIONS["en"]

    result: dict[str, str] = {}
    for key in body.keys:
        result[key] = dict_for_locale.get(key, en.get(key, key))

    return TranslateBatchResponse(locale=locale, translations=result)


@router.get("/all/{locale}")
async def get_all_translations(locale: str):
    """Return the entire translation dictionary for a locale."""
    norm = locale.split("-")[0].lower() if locale else "en"
    dict_for_locale = _TRANSLATIONS.get(norm)
    if not dict_for_locale:
        return {"locale": norm, "translations": _TRANSLATIONS["en"], "fallback": True}
    return {"locale": norm, "translations": dict_for_locale}

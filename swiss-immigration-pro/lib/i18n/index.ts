// ============================================================================
// Core i18n system — natural, dictionary-based translations
// Falls back to English then to the raw key.
// ============================================================================

import { ALL_TRANSLATIONS, type SupportedLocale, type TranslationDict } from './translations'
import { LAYER_CONTENT_FR } from './fr/layerContent'
import type { LayerContent } from '../layerContent'

export type { SupportedLocale, TranslationDict }
export { ALL_TRANSLATIONS }

// ---------------------------------------------------------------------------
// Language resolution
// ---------------------------------------------------------------------------

/**
 * Normalise language codes: "zh-CN" → "zh-CN", "fr-CH" → "fr", etc.
 * If the code is not in our dictionaries it still passes through —
 * the t() function falls back to English text and Google Translate
 * rewrites the DOM for any language we don't have a dictionary for.
 */
function normaliseLocale(raw: string): string {
  if (!raw) return 'en'
  // Direct match first (e.g. "zh-CN")
  if (ALL_TRANSLATIONS[raw]) return raw
  // Try base language (e.g. "fr-CH" → "fr")
  const base = raw.split('-')[0].toLowerCase()
  if (ALL_TRANSLATIONS[base]) return base
  // Chinese variants always resolve to zh
  if (base === 'zh') return 'zh'
  // Unknown language — pass through so Google Translate can handle it
  return base || 'en'
}

/** Get the active locale from localStorage / browser / SSR fallback */
export function getCurrentLanguage(): string {
  if (typeof window === 'undefined') return 'en'

  const saved = localStorage.getItem('preferredLanguage')
  if (saved) return normaliseLocale(saved)

  const browser = navigator.language
  return normaliseLocale(browser)
}

/** Persist a language choice and broadcast the change */
export function setLanguage(lang: string): void {
  if (typeof window === 'undefined') return

  const norm = normaliseLocale(lang)
  localStorage.setItem('preferredLanguage', norm)
  localStorage.setItem('userLanguage', norm)
  document.documentElement.lang = norm

  // Broadcast so every useT() hook re-renders
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: norm } }))
}

// ---------------------------------------------------------------------------
// Translation function
// ---------------------------------------------------------------------------

/**
 * Translate a key into the current language.
 *
 * ```ts
 * t('hero.title')                       // → translated string
 * t('home.joinApplicants', { count: '18,500+' })  // → with interpolation
 * ```
 *
 * Falls back: requested lang → English → raw key.
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const lang = getCurrentLanguage()
  const dict: TranslationDict | undefined = ALL_TRANSLATIONS[lang]

  let value = dict?.[key] ?? ALL_TRANSLATIONS.en[key] ?? key

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      value = value.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v))
    })
  }

  return value
}

/**
 * Translate with an explicit locale override (useful server-side or in emails).
 */
export function tLocale(locale: string, key: string, params?: Record<string, string | number>): string {
  const norm = normaliseLocale(locale)
  const dict: TranslationDict | undefined = ALL_TRANSLATIONS[norm]

  let value = dict?.[key] ?? ALL_TRANSLATIONS.en[key] ?? key

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      value = value.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v))
    })
  }

  return value
}

// ---------------------------------------------------------------------------
// Legacy helpers (kept for backward compatibility with existing components)
// ---------------------------------------------------------------------------

export function isFrench(): boolean {
  return getCurrentLanguage() === 'fr'
}

export function getLayerContent(layer: string): LayerContent {
  const lang = getCurrentLanguage()
  if (lang === 'fr') {
    return LAYER_CONTENT_FR[layer] || LAYER_CONTENT_FR.europeans
  }
  return {} as LayerContent
}

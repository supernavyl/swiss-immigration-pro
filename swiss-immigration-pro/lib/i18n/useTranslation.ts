// ============================================================================
// React hooks for the translation system
// ============================================================================

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getCurrentLanguage, t as tCore, type SupportedLocale } from './index'
import { LAYER_CONTENT_FR } from './fr/layerContent'
import { LAYER_CONTENT } from '../layerContent'
import type { LayerContent } from '../layerContent'
import type { LayerType } from '../layerLogic'

// ---------------------------------------------------------------------------
// useT — reactive translation hook
// ---------------------------------------------------------------------------

export interface UseTranslationReturn {
  /** Current locale code */
  locale: string
  /** Translate a key, with optional interpolation params */
  t: (key: string, params?: Record<string, string | number>) => string
}

/**
 * The main translation hook.  Re-renders when the user changes language.
 *
 * ```tsx
 * const { t, locale } = useT()
 * return <h1>{t('hero.title')}</h1>
 * ```
 */
export function useT(): UseTranslationReturn {
  const [locale, setLocale] = useState<string>('en')

  useEffect(() => {
    // Initial read
    setLocale(getCurrentLanguage())

    // Listen for our custom event (fired by setLanguage())
    const handleLangChange = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.language) {
        setLocale(detail.language)
      }
    }

    // Also poll localStorage for cross-tab changes
    const handleStorage = () => {
      const current = getCurrentLanguage()
      setLocale((prev) => (prev !== current ? current : prev))
    }

    window.addEventListener('languagechange', handleLangChange)
    window.addEventListener('storage', handleStorage)

    // Fallback poll for Google Translate (which bypasses JS events)
    const interval = setInterval(() => {
      const current = getCurrentLanguage()
      setLocale((prev) => (prev !== current ? current : prev))
    }, 5000)

    return () => {
      window.removeEventListener('languagechange', handleLangChange)
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [])

  const translate = useCallback(
    (key: string, params?: Record<string, string | number>) => tCore(key, params),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale] // re-create when locale changes so consumers get new strings
  )

  return { locale, t: translate }
}

// ---------------------------------------------------------------------------
// Legacy hooks (backward compatibility)
// ---------------------------------------------------------------------------

/** Get layer content for the current language */
export function useLayerContent(layer: LayerType): LayerContent {
  const { locale } = useT()

  return useMemo(() => {
    if (locale === 'fr') {
      const layerMap: Record<LayerType, keyof typeof LAYER_CONTENT_FR> = {
        europeans: 'europeans',
        americans: 'americans',
        others: 'others',
      }
      const frenchKey = layerMap[layer] || 'europeans'
      return LAYER_CONTENT_FR[frenchKey] || LAYER_CONTENT[layer]
    }
    return LAYER_CONTENT[layer]
  }, [layer, locale])
}

/** Check if current language is French */
export function useIsFrench(): boolean {
  const { locale } = useT()
  return locale === 'fr'
}

/** Get current language code */
export function useLanguage(): string {
  const { locale } = useT()
  return locale
}

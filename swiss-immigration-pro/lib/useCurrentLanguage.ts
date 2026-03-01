'use client'

// Re-export from the canonical i18n module so existing imports keep working.
import { useT } from '@/lib/i18n/useTranslation'
import { getCurrentLanguage as _getCurrent } from '@/lib/i18n/index'

/**
 * Hook to get the current language from localStorage.
 * Delegates to the main i18n system so language changes propagate everywhere.
 */
export function useCurrentLanguage(): string {
  const { locale } = useT()
  return locale
}

/**
 * Get current language synchronously (for use outside React components)
 */
export function getCurrentLanguage(): string {
  return _getCurrent()
}

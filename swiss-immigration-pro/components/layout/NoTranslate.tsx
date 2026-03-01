'use client'

/**
 * Component to prevent Google Translate from translating specific terms
 * Usage: <NoTranslate>EU/EFTA</NoTranslate>
 */
export function NoTranslate({ children }: { children: React.ReactNode }) {
  return <span className="notranslate" translate="no">{children}</span>
}


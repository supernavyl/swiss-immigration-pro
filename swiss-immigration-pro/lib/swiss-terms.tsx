/**
 * Swiss Terms Protection Utility
 * Provides functions and constants for protecting Swiss-specific terms from translation
 */

// Swiss legal terms and acronyms that should never be translated
export const SWISS_LEGAL_TERMS = [
  'AuG',
  'VZAE',
  'StAG',
  'KVG',
  'SEM',
  'OLN',
  'FMPA',
  'SECO',
  'SR',
  'Art.',
  'Art',
  'GGB',
  'DSG',
  'OR',
] as const

// Permit types that should not be translated
export const PERMIT_CODES = ['L', 'B', 'G', 'C'] as const

// Canton codes that should not be translated
export const CANTON_CODES = [
  'ZH', 'BE', 'LU', 'UR', 'SZ', 'OW', 'NW', 'GL', 'ZG', 'FR', 'SO', 'BS', 'BL',
  'SH', 'AR', 'AI', 'SG', 'GR', 'AG', 'TG', 'TI', 'VD', 'VS', 'NE', 'GE', 'JU'
] as const

// Canton names (keep original names, not translated)
export const CANTON_NAMES = [
  'Zurich', 'Bern', 'Lucerne', 'Uri', 'Schwyz', 'Obwalden', 'Nidwalden',
  'Glarus', 'Zug', 'Fribourg', 'Solothurn', 'Basel-Stadt', 'Basel-Landschaft',
  'Schaffhausen', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden',
  'St. Gallen', 'Graubünden', 'Aargau', 'Thurgau', 'Ticino', 'Vaud',
  'Valais', 'Neuchâtel', 'Geneva', 'Jura'
] as const

// EU/EFTA and other regional terms
export const REGIONAL_TERMS = [
  'EU',
  'EFTA',
  'EU/EFTA',
  'Non-EU',
  'Third-country',
] as const

// Currency codes
export const CURRENCY_CODES = ['CHF', 'USD', 'EUR', 'GBP'] as const

/**
 * Wraps a term with notranslate protection
 */
export function protectTerm(term: string, className: string = 'notranslate'): string {
  return `<span class="${className}" translate="no">${term}</span>`
}

/**
 * Protects Swiss legal terms in text
 */
export function protectLegalTerms(text: string): string {
  let protectedText = text
  SWISS_LEGAL_TERMS.forEach(term => {
    // Match whole words only (case-insensitive)
    const regex = new RegExp(`\\b${term}\\b`, 'gi')
    protectedText = protectedText.replace(regex, (match) => 
      protectTerm(match, 'swiss-legal-term')
    )
  })
  return protectedText
}

/**
 * Protects permit codes in text
 */
export function protectPermitCodes(text: string): string {
  let protectedText = text
  PERMIT_CODES.forEach(code => {
    // Match "Permit L", "L permit", "L-permit", etc.
    const regex = new RegExp(`\\b(${code})\\s*(permit|Permit|permit code|code)`, 'gi')
    protectedText = protectedText.replace(regex, (match, codeMatch) => {
      const parts = match.split(/(\s+)/)
      return parts.map(part => 
        part === codeMatch ? protectTerm(part, 'permit-code') : part
      ).join('')
    })
    // Also protect standalone permit codes in context
    const standaloneRegex = new RegExp(`\\bPermit\\s+(${code})\\b`, 'gi')
    protectedText = protectedText.replace(standaloneRegex, (match, codeMatch) => {
      return match.replace(codeMatch, protectTerm(codeMatch, 'permit-code'))
    })
  })
  return protectedText
}

/**
 * Protects canton codes in text
 */
export function protectCantonCodes(text: string): string {
  let protectedText = text
  CANTON_CODES.forEach(code => {
    // Match canton codes in parentheses or standalone
    const regex = new RegExp(`\\b(${code})\\b`, 'g')
    protectedText = protectedText.replace(regex, (match) => 
      protectTerm(match, 'canton-code')
    )
  })
  return protectedText
}

/**
 * Protects currency amounts (CHF, USD, etc.)
 */
export function protectCurrency(text: string): string {
  let protectedText = text
  // Match currency codes followed by amounts or standalone
  CURRENCY_CODES.forEach(code => {
    const regex = new RegExp(`\\b(${code})\\b`, 'g')
    protectedText = protectedText.replace(regex, (match) => 
      protectTerm(match, 'chf-amount')
    )
  })
  // Also protect CHF amounts like "CHF 100,000"
  protectedText = protectedText.replace(/\bCHF\s+[\d,]+/g, (match) => {
    return match.replace('CHF', protectTerm('CHF', 'chf-amount'))
  })
  return protectedText
}

/**
 * Protects regional terms (EU, EFTA, etc.)
 */
export function protectRegionalTerms(text: string): string {
  let protectedText = text
  REGIONAL_TERMS.forEach(term => {
    const regex = new RegExp(`\\b${term.replace('/', '\\/')}\\b`, 'gi')
    protectedText = protectedText.replace(regex, (match) => 
      protectTerm(match, 'swiss-term')
    )
  })
  return protectedText
}

/**
 * Comprehensive protection function that applies all protections
 */
export function protectSwissTerms(text: string): string {
  let protectedText = text
  
  // Apply protections in order (more specific first)
  protectedText = protectLegalTerms(protectedText)
  protectedText = protectPermitCodes(protectedText)
  protectedText = protectCantonCodes(protectedText)
  protectedText = protectCurrency(protectedText)
  protectedText = protectRegionalTerms(protectedText)
  
  return protectedText
}

/**
 * React component helper - returns wrapped content as JSX
 */
export function SwissTerm({ 
  children, 
  className = 'swiss-term' 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={className} translate="no">
      {children}
    </span>
  )
}



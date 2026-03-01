// Simplified geolocation utilities for region detection

export type RegionType = 'us' | 'eu' | 'other'

export interface GeolocationData {
  ip: string
  country_code: string
  country_name: string
  region: RegionType
  detected_at: number
}

/**
 * Simplified region detection - no longer uses IP geolocation
 */
export async function detectRegionFromIP(ip?: string): Promise<RegionType> {
  // Always return 'other' since we removed IP detection
  return 'other'
}

/**
 * Determines region from country code
 */
export function getRegionFromCountryCode(countryCode: string): RegionType {
  const code = countryCode.toUpperCase().trim()

  if (code === 'US') {
    return 'us'
  }

  // EU country codes
  const EU_COUNTRIES = new Set([
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
    'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
    'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO'
  ])

  if (EU_COUNTRIES.has(code)) {
    return 'eu'
  }

  return 'other'
}

/**
 * Gets region-specific display name
 */
export function getRegionDisplayName(region: RegionType): string {
  switch (region) {
    case 'us':
      return 'United States'
    case 'eu':
      return 'Europe'
    case 'other':
      return 'International'
    default:
      return 'International'
  }
}

/**
 * Gets region-specific tagline
 */
export function getRegionTagline(region: RegionType): string {
  switch (region) {
    case 'us':
      return 'From Stars & Stripes to Swiss Precision'
    case 'eu':
      return 'Easy EU Mobility to Swiss Bliss'
    case 'other':
      return 'Global Pathways to Switzerland'
    default:
      return 'Your Swiss Immigration Journey'
  }
}

/**
 * Gets region-specific description
 */
export function getRegionDescription(region: RegionType): string {
  switch (region) {
    case 'us':
      return 'Navigate non-EU work visas, sponsorships, and salary thresholds. Expert guidance for US and Canadian professionals seeking Swiss opportunities.'
    case 'eu':
      return 'Leverage your EU/EFTA freedom of movement rights for fast-track Swiss residency. No quotas, simplified processes, and 5-year path to citizenship.'
    case 'other':
      return 'Comprehensive support for international nationals: quotas, lotteries, embassy guides, and strategic pathways to Swiss residency and citizenship.'
    default:
      return 'Your personalized Swiss immigration platform'
  }
}

/**
 * Creates a geolocation data object
 */
export function createGeolocationData(ip: string, countryCode: string, countryName: string): GeolocationData {
  const region = getRegionFromCountryCode(countryCode)

  return {
    ip,
    country_code: countryCode.toUpperCase(),
    country_name: countryName,
    region,
    detected_at: Date.now()
  }
}

/**
 * Stores region detection in localStorage and cookies
 */
export function storeRegionDetection(region: RegionType, geolocationData?: GeolocationData): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem('userRegion', region)
    localStorage.setItem('regionAutoDetected', 'true')

    if (geolocationData) {
      localStorage.setItem('geolocationData', JSON.stringify(geolocationData))
    }

    // Set cookies for server-side access
    const oneYear = 60 * 60 * 24 * 365
    document.cookie = `userRegion=${region}; path=/; max-age=${oneYear}`
    document.cookie = `regionAutoDetected=true; path=/; max-age=${oneYear}`

    if (geolocationData) {
      document.cookie = `geolocationData=${encodeURIComponent(JSON.stringify(geolocationData))}; path=/; max-age=${oneYear}`
    }
  } catch (error) {
    console.error('Error storing region detection:', error)
  }
}

/**
 * Retrieves stored region detection
 */
export function getStoredRegion(): RegionType | null {
  if (typeof window === 'undefined') return null

  try {
    // Check localStorage first
    const storedRegion = localStorage.getItem('userRegion') as RegionType | null
    if (storedRegion && ['us', 'eu', 'other'].includes(storedRegion)) {
      return storedRegion
    }

    // Fallback to cookies (for SSR)
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = value
        return acc
      }, {} as Record<string, string>)

      const cookieRegion = cookies.userRegion as RegionType | undefined
      if (cookieRegion && ['us', 'eu', 'other'].includes(cookieRegion)) {
        return cookieRegion
      }
    }

    return null
  } catch (error) {
    console.error('Error retrieving stored region:', error)
    return null
  }
}









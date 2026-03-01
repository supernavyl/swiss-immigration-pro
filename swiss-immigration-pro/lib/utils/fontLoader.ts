// Google Fonts Integration
// Dynamically loads fonts from Google Fonts API

const GOOGLE_FONTS_API = 'https://fonts.googleapis.com/css2'

export const AVAILABLE_FONTS = [
  { name: 'Roboto', value: 'Roboto', weights: '300;400;500;700' },
  { name: 'Merriweather', value: 'Merriweather', weights: '300;400;700' },
  { name: 'Oswald', value: 'Oswald', weights: '300;400;500;700' },
  { name: 'Playfair Display', value: 'Playfair Display', weights: '400;500;700' },
  { name: 'Lato', value: 'Lato', weights: '300;400;700' },
]

interface LoadedFont {
  name: string
  loaded: boolean
}

const loadedFonts = new Set<string>()

/**
 * Load a Google Font dynamically
 * @param fontName - Name of the font to load
 * @returns Promise that resolves when font is loaded
 */
export async function loadGoogleFont(fontName: string): Promise<void> {
  // Check if already loaded
  if (loadedFonts.has(fontName)) {
    return Promise.resolve()
  }

  // Find font config
  const fontConfig = AVAILABLE_FONTS.find(f => f.value === fontName)
  if (!fontConfig) {
    console.warn(`Font ${fontName} not found in available fonts`)
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    // Check if link already exists
    const existingLink = document.querySelector(`link[data-font="${fontName}"]`)
    if (existingLink) {
      loadedFonts.add(fontName)
      resolve()
      return
    }

    // Create link element
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `${GOOGLE_FONTS_API}?family=${encodeURIComponent(fontName)}:wght@${fontConfig.weights}&display=swap`
    link.setAttribute('data-font', fontName)
    
    link.onload = () => {
      loadedFonts.add(fontName)
      
      // Wait for font to be actually available
      if ('fonts' in document) {
        (document as any).fonts.ready.then(() => {
          resolve()
        })
      } else {
        // Fallback: wait a bit for font to load
        setTimeout(() => resolve(), 500)
      }
    }
    
    link.onerror = () => {
      console.error(`Failed to load font: ${fontName}`)
      reject(new Error(`Failed to load font: ${fontName}`))
    }

    // Add to head
    document.head.appendChild(link)
  })
}

/**
 * Load multiple fonts at once
 */
export async function loadFonts(fontNames: string[]): Promise<void> {
  const promises = fontNames.map(name => loadGoogleFont(name))
  await Promise.all(promises)
}

/**
 * Check if a font is loaded
 */
export function isFontLoaded(fontName: string): boolean {
  return loadedFonts.has(fontName)
}

/**
 * Preload common CV fonts
 */
export function preloadCommonFonts(): void {
  // Preload Roboto and Merriweather (most common)
  loadGoogleFont('Roboto').catch(console.error)
  loadGoogleFont('Merriweather').catch(console.error)
}






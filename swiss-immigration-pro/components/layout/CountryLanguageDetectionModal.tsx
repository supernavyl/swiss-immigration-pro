'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, MapPin, DollarSign, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { classifyLayer, getLayerRoute, getAllCountries, type LayerType } from '@/lib/layerLogic'

interface CountryLanguageDetectionModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: {
    country: string
    countryName: string
    language: string
    currency: string
    layer: LayerType
  }) => void
}

interface DetectedData {
  country: string
  countryName: string
  language: string
  currency: string
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
]

const CURRENCIES = [
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
]

// Currency mapping by country
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  'US': 'USD',
  'CA': 'CAD',
  'GB': 'GBP',
  'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR', 'BE': 'EUR',
  'AT': 'EUR', 'PT': 'EUR', 'PL': 'EUR', 'RO': 'EUR', 'GR': 'EUR', 'CZ': 'EUR',
  'HU': 'EUR', 'SE': 'EUR', 'DK': 'EUR', 'FI': 'EUR', 'IE': 'EUR',
  'JP': 'JPY',
  'CN': 'CNY',
  'AU': 'AUD',
  'CH': 'CHF',
}

export default function CountryLanguageDetectionModal({
  isOpen,
  onClose,
  onComplete,
}: CountryLanguageDetectionModalProps) {
  const router = useRouter()
  const [isDetecting, setIsDetecting] = useState(true)
  const [detectedData, setDetectedData] = useState<DetectedData | null>(null)
  const [selectedData, setSelectedData] = useState<DetectedData | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const countries = getAllCountries()

  // Detect country, language, and currency on open
  useEffect(() => {
    if (!isOpen) return

    const detectUserPreferences = async () => {
      setIsDetecting(true)

      try {
        // Detect country from IP
        let detectedCountry = 'US'
        let detectedCountryName = 'United States'

        try {
          const ipResponse = await fetch('https://ipapi.co/json/')
          if (ipResponse.ok) {
            const ipData = await ipResponse.json()
            detectedCountry = ipData.country_code || 'US'
            detectedCountryName = ipData.country_name || 'United States'
          }
        } catch (error) {
          console.log('IP detection failed, using browser locale')
        }

        // Detect language from browser
        const browserLang = navigator.language || navigator.languages?.[0] || 'en'
        const primaryLang = browserLang.split('-')[0].toLowerCase()
        
        // Find matching language or default to English
        const detectedLanguage = SUPPORTED_LANGUAGES.find(
          lang => lang.code === primaryLang || browserLang.toLowerCase().startsWith(lang.code)
        ) || SUPPORTED_LANGUAGES[0]

        // Detect currency from country
        const detectedCurrency = COUNTRY_CURRENCY_MAP[detectedCountry] || 'CHF'

        const data: DetectedData = {
          country: detectedCountry,
          countryName: detectedCountryName,
          language: detectedLanguage.code,
          currency: detectedCurrency,
        }

        setDetectedData(data)
        setSelectedData(data)
        setIsDetecting(false)
      } catch (error) {
        console.error('Detection error:', error)
        // Fallback to defaults
        setDetectedData({
          country: 'US',
          countryName: 'United States',
          language: 'en',
          currency: 'USD',
        })
        setSelectedData({
          country: 'US',
          countryName: 'United States',
          language: 'en',
          currency: 'USD',
        })
        setIsDetecting(false)
      }
    }

    detectUserPreferences()
  }, [isOpen])

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        localStorage.setItem('detectionSkipped', 'true')
      }
    }
    
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Lock body scroll while modal is open and reset scroll position
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalTop = document.body.style.top
    const scrollY = window.scrollY

    // Lock body scroll and prevent background scrolling
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.position = originalPosition
      document.body.style.top = originalTop
      document.body.style.width = ''
      document.documentElement.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [isOpen])

  const handleConfirm = useCallback(async () => {
    if (!selectedData) return

    setIsApplying(true)

    // Determine layer from country
    const layer = classifyLayer(selectedData.country)
    const layerRoute = getLayerRoute(layer)

    // Save preferences - use BOTH keys for compatibility
    localStorage.setItem('userCountry', selectedData.country)
    localStorage.setItem('userCountryName', selectedData.countryName)
    localStorage.setItem('userLanguage', selectedData.language)
    localStorage.setItem('userCurrency', selectedData.currency)
    localStorage.setItem('userLayer', layer)
    localStorage.setItem('detectionCompleted', 'true')
    
    // CRITICAL: Set the keys that TranslationLoader expects
    localStorage.setItem('preferredLanguage', selectedData.language)
    localStorage.setItem('autoTranslateEnabled', 'true')
    
    // Save redirect destination in case page reloads
    localStorage.setItem('pendingLayerRedirect', layerRoute)

    // Set cookies
    const oneYear = 60 * 60 * 24 * 365
    document.cookie = `userCountry=${selectedData.country}; path=/; max-age=${oneYear}`
    document.cookie = `userLanguage=${selectedData.language}; path=/; max-age=${oneYear}`
    document.cookie = `userCurrency=${selectedData.currency}; path=/; max-age=${oneYear}`
    document.cookie = `userLayer=${layer}; path=/; max-age=${oneYear}`

    // Normalize language code for Google Translate (use zh-CN for better natural translations)
    const normalizeLangCode = (code: string): string => {
      if (code === 'zh') return 'zh-CN'
      return code
    }
    
    // Set translation cookie BEFORE redirect (critical for translation to work)
    const targetLang = selectedData.language === 'en' ? 'en' : normalizeLangCode(selectedData.language)
    const cookieValue = `/en/${targetLang}`
    document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000; SameSite=Lax`

    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = selectedData.language
    }

    // Call completion handler
    onComplete({
      country: selectedData.country,
      countryName: selectedData.countryName,
      language: selectedData.language,
      currency: selectedData.currency,
      layer,
    })

    setHasApplied(true)

    // Apply translation BEFORE redirect to ensure it's ready
    try {
      await applyTranslation(selectedData.language)
    } catch (error) {
      console.error('Translation error:', error)
      // Continue with redirect even if translation fails
    }

    // Small delay to ensure translation cookie is set, then redirect
    setTimeout(() => {
      onClose()
      router.push(layerRoute)
    }, 300)
  }, [selectedData, router, onComplete, onClose])

  const applyTranslation = async (languageCode: string) => {
    if (typeof window === 'undefined') return

    // Normalize language code for Google Translate (use zh-CN for better natural translations)
    const normalizeLangCode = (code: string): string => {
      if (code === 'zh') return 'zh-CN'
      return code
    }

    // Set translation cookie immediately (this is the most important part)
    const targetLang = languageCode === 'en' ? 'en' : normalizeLangCode(languageCode)
    const cookieValue = `/en/${targetLang}`
    document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000; SameSite=Lax`

    // Check if redirect is pending - if so, just set cookie and return
    // TranslationLoader on the destination page will handle the rest
    const pendingRedirect = localStorage.getItem('pendingLayerRedirect')
    if (pendingRedirect) {
      // Cookie is set, TranslationLoader will handle initialization on new page
      return
    }

    // Load Google Translate script if not already loaded
    const loadGoogleTranslate = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (window.google?.translate?.TranslateElement) {
          resolve()
          return
        }

        // Check if script is already being loaded
        if (document.getElementById('google-translate-script')) {
          // Wait for it to load
          const checkInterval = setInterval(() => {
            if (window.google?.translate?.TranslateElement) {
              clearInterval(checkInterval)
              resolve()
            }
          }, 100)
          setTimeout(() => {
            clearInterval(checkInterval)
            if (!window.google?.translate?.TranslateElement) {
              reject(new Error('Google Translate failed to load'))
            }
          }, 5000) // Reduced timeout since we're about to redirect
          return
        }

        // Create container for Google Translate widget
        let container = document.getElementById('google_translate_element')
        if (!container) {
          container = document.createElement('div')
          container.id = 'google_translate_element'
          container.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; visibility: hidden;'
          document.body.appendChild(container)
        }

        // Load Google Translate script
        const script = document.createElement('script')
        script.id = 'google-translate-script'
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        script.async = true

        // Initialize Google Translate when script loads
        ;(window as any).googleTranslateElementInit = () => {
          try {
            if (window.google?.translate?.TranslateElement) {
              new window.google.translate.TranslateElement(
                {
                  pageLanguage: 'en',
                  includedLanguages: SUPPORTED_LANGUAGES.map(l => l.code).join(','),
                  autoDisplay: false,
                  layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                },
                'google_translate_element'
              )
              resolve()
            } else {
              reject(new Error('Google Translate API not available'))
            }
          } catch (error) {
            reject(error)
          }
        }

        script.onerror = () => {
          reject(new Error('Failed to load Google Translate script'))
        }

        document.head.appendChild(script)
      })
    }

    try {
      // Try to load Google Translate, but don't wait too long
      await Promise.race([
        loadGoogleTranslate(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
      ])

      // Wait a bit for Google Translate to initialize
      await new Promise(resolve => setTimeout(resolve, 300))

      // Trigger translation if widget is ready
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
      if (select) {
        select.value = targetLang
        select.dispatchEvent(new Event('change', { bubbles: true }))
      }
    } catch (error) {
      // Cookie is already set, which is the most important part
      // TranslationLoader on destination page will handle initialization
      console.log('Translation initialization skipped (will apply on destination page):', error)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('detectionSkipped', 'true')
    onClose()
  }

  if (!isOpen) return null

  const selectedLanguage = SUPPORTED_LANGUAGES.find(l => l.code === selectedData?.language)
  const selectedCurrency = CURRENCIES.find(c => c.code === selectedData?.currency)
  const layer = selectedData ? classifyLayer(selectedData.country) : null

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-8 sm:pt-16"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
            paddingTop: '2rem',
            pointerEvents: 'auto'
          }}
          onClick={handleSkip}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'auto',
              cursor: 'pointer'
            }}
            onClick={handleSkip}
          />
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -100 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto mt-8 sm:mt-16 border-2 border-blue-100"
            style={{
              position: 'relative',
              zIndex: 10,
              margin: 'auto',
              maxWidth: '32rem',
              width: '100%',
              maxHeight: '85vh',
              marginTop: '2rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
          {/* Header */}
          <div className="px-6 py-4 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-3">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Personalize Your Experience
              </h2>
            </div>
            <button
              onClick={handleSkip}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <AnimatePresence mode="wait">
              {isDetecting ? (
                <motion.div
                  key="detecting"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-4 py-8"
                >
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Detecting Your Location
                    </h3>
                    <p className="text-gray-600 text-sm">
                      We're detecting your country, language, and currency preferences...
                    </p>
                  </div>
                </motion.div>
              ) : hasApplied ? (
                <motion.div
                  key="applied"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-4 py-8"
                >
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      All Set!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Your preferences have been saved and the site is being translated.
                    </p>
                    <div className="inline-flex items-center space-x-2 text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Redirecting to your personalized experience...</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="selection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <p className="text-gray-600 text-sm">
                      We've detected your preferences. Please confirm or adjust them below.
                    </p>
                  </div>

                  {/* Country Selection */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <MapPin className="w-4 h-4" />
                      <span>Country</span>
                    </label>
                    <select
                      value={selectedData?.country || ''}
                      onChange={(e) => {
                        const country = countries.find(c => c.code === e.target.value)
                        const currency = COUNTRY_CURRENCY_MAP[e.target.value] || 'CHF'
                        setSelectedData({
                          ...selectedData!,
                          country: e.target.value,
                          countryName: country?.name || '',
                          currency,
                        })
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Language Selection with Google Translate */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <Globe className="w-4 h-4" />
                      <span>Language (Google Translate)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setSelectedData({ ...selectedData!, language: lang.code })}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            selectedData?.language === lang.code
                              ? 'border-blue-600 bg-blue-50 shadow-md'
                              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{lang.flag}</span>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {lang.nativeName}
                              </div>
                              <div className="text-xs text-gray-600">
                                {lang.name}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      ✨ Powered by Google Translate - The entire site will be translated automatically
                    </p>
                  </div>

                  {/* Currency Selection */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <DollarSign className="w-4 h-4" />
                      <span>Currency</span>
                    </label>
                    <select
                      value={selectedData?.currency || ''}
                      onChange={(e) => setSelectedData({ ...selectedData!, currency: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 hover:border-blue-400 transition-colors"
                    >
                      {CURRENCIES.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.name} ({currency.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Layer Preview */}
                  {layer && (
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-blue-900">
                        <strong>Your Pathway:</strong> {layer === 'europeans' ? 'EU/EFTA Citizen' : layer === 'americans' ? 'US/Canadian Citizen' : 'International'}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        You'll be directed to personalized content based on your country.
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <button
                      onClick={handleConfirm}
                      disabled={!selectedData || isApplying}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isApplying ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Applying...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Confirm & Translate Site</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleSkip}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors border border-gray-200"
                    >
                      Skip for now
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  )
}


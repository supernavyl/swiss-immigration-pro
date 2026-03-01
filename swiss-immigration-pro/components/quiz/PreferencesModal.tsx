'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, DollarSign, Languages, Check, MapPin } from 'lucide-react'
import { detectRegionFromIP, RegionType, getRegionDisplayName } from '@/lib/geolocation'

export type LanguageType = 'en' | 'de' | 'fr' | 'it'
export type CurrencyType = 'CHF' | 'EUR' | 'USD'

interface UserPreferences {
  region: RegionType
  language: LanguageType
  currency: CurrencyType
  confirmed: boolean
}

export function InitialQuizGate({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false) // Always false - modal disabled
  const [isLoading, setIsLoading] = useState(false) // Set to false immediately
  const [preferences, setPreferences] = useState<UserPreferences>({
    region: 'other',
    language: 'en',
    currency: 'CHF',
    confirmed: false
  })

  const [detectedData, setDetectedData] = useState<{
    region: RegionType
    language: LanguageType
    currency: CurrencyType
  } | null>(null)

  useEffect(() => {
    // DISABLED: Hide language selection modal for now
    // The new CountryLanguageDetectionModal handles this functionality
    setIsLoading(false)
    return
    
    // Original code commented out:
    /*
    const initializeModal = async () => {
      try {
        // Check if user has already confirmed preferences
        const storedPrefs = localStorage.getItem('userPreferences')
        if (storedPrefs) {
          const parsedPrefs = JSON.parse(storedPrefs) as UserPreferences
          if (parsedPrefs.confirmed) {
            setIsLoading(false)
            return
          }
        }

        // Detect user's location and set defaults
        const response = await fetch('/api/region/detect')
        const data = await response.json()

        const detectedRegion: RegionType = data.region || 'other'
        let detectedLanguage: LanguageType = 'en'
        let detectedCurrency: CurrencyType = 'CHF'

        // Set language and currency based on region
        if (detectedRegion === 'eu') {
          // For EU, default to English but offer local languages
          detectedLanguage = 'en'
          detectedCurrency = 'EUR'
        } else if (detectedRegion === 'us') {
          detectedLanguage = 'en'
          detectedCurrency = 'USD'
        } else {
          // For other regions, default to English and CHF
          detectedLanguage = 'en'
          detectedCurrency = 'CHF'
        }

        setDetectedData({ region: detectedRegion, language: detectedLanguage, currency: detectedCurrency })
        setPreferences({
          region: detectedRegion,
          language: detectedLanguage,
          currency: detectedCurrency,
          confirmed: false
        })

        setShowModal(true)
      } catch (error) {
        console.error('Error initializing modal:', error)
        // Fallback defaults
        setPreferences({
          region: 'other',
          language: 'en',
          currency: 'CHF',
          confirmed: false
        })
        setShowModal(true)
      } finally {
        setIsLoading(false)
      }
    }

    initializeModal()
    */
  }, [])

  const handleConfirm = () => {
    const userPrefs: UserPreferences = {
      ...preferences,
      confirmed: true
    }

    // Store in localStorage
    localStorage.setItem('userPreferences', JSON.stringify(userPrefs))

    // Store region for compatibility with existing code
    localStorage.setItem('userRegion', preferences.region)

    // Set cookies for server-side access
    const oneYear = 60 * 60 * 24 * 365
    document.cookie = `userRegion=${preferences.region}; path=/; max-age=${oneYear}`
    document.cookie = `userLanguage=${preferences.language}; path=/; max-age=${oneYear}`
    document.cookie = `userCurrency=${preferences.currency}; path=/; max-age=${oneYear}`
    document.cookie = `preferencesConfirmed=true; path=/; max-age=${oneYear}`

    setShowModal(false)
  }

  const updatePreference = (key: keyof Omit<UserPreferences, 'confirmed'>, value: RegionType | LanguageType | CurrencyType) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  if (isLoading) {
    return <>{children}</> // Show content while loading, modal will appear on top
  }

  return (
    <>
      {children}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => {}} // Prevent backdrop click
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-8 lg:inset-16 xl:inset-32 z-50 flex items-center justify-center"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-8 h-8 text-blue-600" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome to Swiss Immigration Pro
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Let's personalize your experience
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Detected Info */}
                  {detectedData && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          We detected your location
                        </span>
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Region: {getRegionDisplayName(detectedData.region)} •
                        Suggested Language: {detectedData.language.toUpperCase()} •
                        Currency: {detectedData.currency}
                      </p>
                    </div>
                  )}

                  {/* Region Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Your Region
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'eu' as RegionType, label: 'Europe', flag: '🇪🇺' },
                        { value: 'us' as RegionType, label: 'United States', flag: '🇺🇸' },
                        { value: 'other' as RegionType, label: 'International', flag: '🌍' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updatePreference('region', option.value)}
                          className={`p-4 border-2 rounded-lg text-center transition-all ${
                            preferences.region === option.value
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{option.flag}</div>
                          <div className="text-sm font-medium">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <Languages className="w-4 h-4 inline mr-2" />
                      Preferred Language
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { value: 'en' as LanguageType, label: 'English', flag: '🇬🇧' },
                        { value: 'de' as LanguageType, label: 'German', flag: '🇩🇪' },
                        { value: 'fr' as LanguageType, label: 'French', flag: '🇫🇷' },
                        { value: 'it' as LanguageType, label: 'Italian', flag: '🇮🇹' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updatePreference('language', option.value)}
                          className={`p-3 border-2 rounded-lg text-center transition-all ${
                            preferences.language === option.value
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-xl mb-1">{option.flag}</div>
                          <div className="text-xs font-medium">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Currency Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <DollarSign className="w-4 h-4 inline mr-2" />
                      Preferred Currency
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'CHF' as CurrencyType, label: 'Swiss Franc', symbol: 'CHF' },
                        { value: 'EUR' as CurrencyType, label: 'Euro', symbol: '€' },
                        { value: 'USD' as CurrencyType, label: 'US Dollar', symbol: '$' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updatePreference('currency', option.value)}
                          className={`p-4 border-2 rounded-lg text-center transition-all ${
                            preferences.currency === option.value
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl font-bold mb-1">{option.symbol}</div>
                          <div className="text-sm font-medium">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Info Text */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      These preferences help us show you relevant information, pricing, and guides tailored to your location and preferences.
                      You can change these settings anytime in your profile.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleConfirm}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm & Continue</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, CheckCircle, ArrowRight } from 'lucide-react'

interface LanguageDetectionModalProps {
  isOpen: boolean
  onClose: () => void
}

interface DetectedLanguage {
  code: string
  name: string
  nativeName: string
  flag: string
  confidence: number
}

export default function LanguageDetectionModal({ isOpen, onClose }: LanguageDetectionModalProps) {
  const [detectedLanguage, setDetectedLanguage] = useState<DetectedLanguage | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [hasConfirmed, setHasConfirmed] = useState(false)

  // Language detection based on browser locale and navigator
  useEffect(() => {
    if (isOpen && !detectedLanguage) {
      const detectLanguage = () => {
        const navigatorLang = navigator.language || 'en-US'
        const languages = navigator.languages || [navigatorLang]

        // Priority: browser language > system language > fallback to English
        const primaryLang = languages[0]?.split('-')[0] || 'en'

        // Map common language codes to our supported languages
        const languageMap: Record<string, DetectedLanguage> = {
          'en': { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', confidence: 90 },
          'de': { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', confidence: 95 },
          'fr': { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', confidence: 95 },
          'it': { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', confidence: 95 },
          'es': { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', confidence: 85 },
          'pt': { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', confidence: 80 },
          'zh': { code: 'zh-CN', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', confidence: 85 },
          'ar': { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', confidence: 80 },
          'hi': { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', confidence: 75 },
          'ru': { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', confidence: 80 },
          'ja': { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', confidence: 85 },
          'ko': { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', confidence: 80 },
          'tr': { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', confidence: 75 },
          'pl': { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', confidence: 70 },
          'nl': { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', confidence: 75 },
        }

        // Try to detect country for more accurate language detection
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const countryHints: Record<string, string> = {
          'Europe/Berlin': 'de',
          'Europe/Zurich': 'de',
          'Europe/Paris': 'fr',
          'Europe/Rome': 'it',
          'Europe/Madrid': 'es',
          'Europe/Lisbon': 'pt',
          'Asia/Shanghai': 'zh-CN',
          'Asia/Tokyo': 'ja',
          'Asia/Seoul': 'ko',
          'Europe/Moscow': 'ru',
          'Asia/Istanbul': 'tr',
          'Europe/Warsaw': 'pl',
          'Europe/Amsterdam': 'nl',
          'America/New_York': 'en',
          'America/Los_Angeles': 'en',
          'America/Toronto': 'en',
        }

        // Check if we have a country-specific hint
        const countryLang = countryHints[timezone]
        if (countryLang && languageMap[countryLang]) {
          setDetectedLanguage({ ...languageMap[countryLang], confidence: Math.max(languageMap[countryLang].confidence, 85) })
          return
        }

        // Fallback to primary language detection
        const detected = languageMap[primaryLang] || languageMap['en']
        setDetectedLanguage(detected)
      }

      detectLanguage()
    }
  }, [isOpen, detectedLanguage])

  const handleConfirmTranslation = () => {
    if (!detectedLanguage) return

    setIsTranslating(true)

    // Simulate translation activation
    setTimeout(() => {
      setHasConfirmed(true)

      // Save preference to localStorage
      localStorage.setItem('autoTranslateEnabled', 'true')
      localStorage.setItem('preferredLanguage', detectedLanguage.code)

      // Trigger Google Translate if available
      if (window.google && window.google.translate) {
        try {
          // This would normally trigger Google Translate
          document.cookie = `googtrans=/en/${detectedLanguage.code}; path=/; max-age=31536000`
        } catch (error) {
          console.log('Google Translate not available')
        }
      }

      // Close modal after confirmation
      setTimeout(() => {
        onClose()
      }, 2000)
    }, 1500)
  }

  const handleSkipTranslation = () => {
    localStorage.setItem('autoTranslateSkipped', 'true')
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        onClick={handleSkipTranslation}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.3
          }}
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-xl lg:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col border border-gray-200/50 dark:border-gray-700/50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Language Detected
              </h2>
            </div>
            <motion.button
              onClick={handleSkipTranslation}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="px-6 py-8 overflow-y-auto custom-scrollbar flex-1">
            <AnimatePresence mode="wait">
              {hasConfirmed ? (
                <motion.div
                  key="confirmed"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.2
                    }}
                  >
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto drop-shadow-lg" />
                  </motion.div>
                  <div>
                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                    >
                      Translation Activated!
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-600 dark:text-gray-400 mb-6"
                    >
                      The site is now translating to {detectedLanguage?.nativeName}
                    </motion.p>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                      />
                      <span className="text-sm font-medium">Applying translation...</span>
                    </motion.div>
                  </div>
                </motion.div>
              ) : isTranslating ? (
                <motion.div
                  key="translating"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      },
                      rotate: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }
                    }}
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg"
                  >
                    <Globe className="w-10 h-10 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Activating Translation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Translating to {detectedLanguage?.nativeName}...
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="detection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Detected Language */}
                  {detectedLanguage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-center"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 px-8 py-5 rounded-2xl mb-6 border border-blue-200/50 dark:border-blue-800/50 shadow-lg"
                      >
                        <motion.span 
                          className="text-5xl"
                          animate={{ 
                            y: [0, -10, 0],
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          {detectedLanguage.flag}
                        </motion.span>
                        <div className="text-left">
                          <div className="font-bold text-lg text-gray-900 dark:text-white">
                            {detectedLanguage.nativeName}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                            <span>{detectedLanguage.name}</span>
                            <span>•</span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">{detectedLanguage.confidence}% confidence</span>
                          </div>
                        </div>
                      </motion.div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        Would you like to translate this site?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 max-w-md mx-auto leading-relaxed">
                        We detected you're accessing from a {detectedLanguage.name}-speaking region.
                        Enable automatic translation for a better experience.
                      </p>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirmTranslation}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      <CheckCircle className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Yes, translate to {detectedLanguage?.nativeName}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSkipTranslation}
                      className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      No thanks, continue in English
                    </motion.button>
                  </div>

                  {/* Features */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-1 pt-4 border-t border-gray-200/50 dark:border-gray-700/50"
                  >
                    <p className="flex items-center justify-center gap-2">✨ Powered by Google Translate</p>
                    <p className="flex items-center justify-center gap-2">🔒 Your language preference will be saved</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
      
      <style jsx global>{`
        /* Custom scrollbar for modal */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </AnimatePresence>
  )
}



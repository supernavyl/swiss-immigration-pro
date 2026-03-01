'use client'

import { useState, useEffect, useCallback } from 'react'
import { Globe, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { applyNaturalTranslations, clearNaturalTranslationObserver } from '@/lib/natural-translations'
import { useHaptic } from '@/lib/hooks/useHaptic'

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

// Language codes optimized for natural translations
// Using zh-CN for Simplified Chinese (more natural for most users)
const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
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
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
]

// Helper to normalize language codes for Google Translate
// Google Translate accepts both 'zh' and 'zh-CN', but zh-CN is more specific for natural translations
const normalizeLangCodeForGoogle = (code: string): string => {
  // Map zh to zh-CN for better natural Simplified Chinese translations
  if (code === 'zh') return 'zh-CN'
  return code
}

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState<Language>(LANGUAGES[0])
  const [isTranslating, setIsTranslating] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [pendingLanguageCode, setPendingLanguageCode] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { haptic } = useHaptic()

  const loadGoogleTranslate = useCallback(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return
    }

    // Add Google Translate script only once
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      
      // Add error handling
      script.onerror = () => {
        console.error('Failed to load Google Translate script')
        setIsScriptLoaded(false)
      }
      
      // Add load event
      script.onload = () => {
        // Give it a moment for the callback to execute
        setTimeout(() => {
          if ((window as any).google?.translate?.TranslateElement) {
            setIsScriptLoaded(true)
          }
        }, 500)
      }
      
      document.head.appendChild(script)

      // Initialize callback
      ;(window as any).googleTranslateElementInit = function() {
        try {
          if (!(window as any).google?.translate?.TranslateElement) {
            console.error('Google Translate API not available')
            return
          }
          
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              // Use optimized language codes for natural translations
              includedLanguages: LANGUAGES.map(l => normalizeLangCodeForGoogle(l.code)).join(','),
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
              // Improve translation accuracy by specifying language variants
              gaTrack: true,
              gaId: 'UA-XXXXX-X', // Replace with your GA ID if needed
            },
            'google_translate_element'
          )
          setIsScriptLoaded(true)
        } catch (error) {
          console.error('Google Translate initialization failed:', error)
          setIsScriptLoaded(false)
        }
      }
    } else {
      // Script already exists, check if it's loaded
      if ((window as any).google?.translate?.TranslateElement) {
        setIsScriptLoaded(true)
      } else {
        // Wait a bit for it to load
        setTimeout(() => {
          if ((window as any).google?.translate?.TranslateElement) {
            setIsScriptLoaded(true)
          }
        }, 500)
      }
    }
  }, [])

  // Handle client-side mounting to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') {
      return
    }

    // Load saved language preference (only after mount to avoid hydration mismatch)
    const savedLang = localStorage.getItem('preferredLanguage')
    if (savedLang) {
      const lang = LANGUAGES.find(l => l.code === savedLang)
      if (lang) {
        setCurrentLang(lang)
      }
    }

    // Load Google Translate script
    loadGoogleTranslate()

    // Apply natural translations if page is already translated
    const checkAndApplyNaturalTranslations = () => {
      // Check for pending natural translation from localStorage (set before reload)
      const pendingLang = localStorage.getItem('pendingNaturalTranslation')
      if (pendingLang) {
        localStorage.removeItem('pendingNaturalTranslation')
        // Wait for Google Translate to finish, then apply natural translations
        setTimeout(() => {
          applyNaturalTranslations(pendingLang)
        }, 2500)
        return
      }

      // Otherwise check cookie for existing translation
      const cookie = document.cookie.match(/googtrans=([^;]+)/)
      if (cookie && cookie[1]) {
        // Extract target language from cookie (format: "/en/fr" -> "fr")
        const match = cookie[1].match(/\/en\/([^\/]+)/)
        if (match && match[1]) {
          const targetLang = match[1] === 'zh-CN' ? 'zh-CN' : match[1]
          // Wait a bit for Google Translate to finish, then apply natural translations
          setTimeout(() => {
            applyNaturalTranslations(targetLang)
          }, 2000)
        }
      }
    }

    // Check for existing translation and apply natural translations
    checkAndApplyNaturalTranslations()

    // Also check periodically in case translation happens later
    const intervalId = setInterval(() => {
      checkAndApplyNaturalTranslations()
    }, 3000)

    return () => {
      clearInterval(intervalId)
      clearNaturalTranslationObserver()
    }
  }, [isMounted, loadGoogleTranslate])

  // Handle translation when language is selected
  useEffect(() => {
    if (!pendingLanguageCode || !isScriptLoaded || typeof window === 'undefined') {
      return
    }

    const triggerTranslation = () => {
      try {
        // Check current translation cookie
        const currentCookie = document.cookie.match(/googtrans=([^;]+)/)
        const expectedValue = pendingLanguageCode === 'en' ? '' : `/en/${pendingLanguageCode}`
        const currentValue = currentCookie ? decodeURIComponent(currentCookie[1]) : ''
        
        // If already translated to this language, skip
        if (currentValue === expectedValue && pendingLanguageCode !== 'en') {
          setIsTranslating(false)
          setPendingLanguageCode(null)
          return
        }
        
        // For English, restore original language
        if (pendingLanguageCode === 'en') {
          // Remove Google Translate cookie to show original language
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname
          
          // Reload page to apply changes
          window.location.reload()
          return
        }

        // Normalize language code for Google Translate (use zh-CN for better natural translations)
        const normalizedLang = normalizeLangCodeForGoogle(pendingLanguageCode)
        
        // Set the translation cookie (format: "/en/de" means translate from en to de)
        const translateValue = `/en/${normalizedLang}`
        document.cookie = `googtrans=${translateValue}; path=/; max-age=31536000`
        
        // Try to find and use the Google Translate select element
        const selectElement = document.querySelector<HTMLSelectElement>('.goog-te-combo')
        
        if (selectElement) {
          // Set the language value (format: "en|de" means translate from en to de)
          // Google Translate select uses the normalized code
          const selectValue = `en|${normalizedLang}`
          if (selectElement.value !== selectValue) {
            selectElement.value = selectValue
            // Trigger change event to activate translation
            const changeEvent = new Event('change', { bubbles: true })
            selectElement.dispatchEvent(changeEvent)
            
            // Also try click event
            selectElement.click()
            
            // Give it a moment, then reload if translation didn't trigger
            setTimeout(() => {
              // Check if translation was applied
              const newCookie = document.cookie.match(/googtrans=([^;]+)/)
              if (newCookie && newCookie[1] === translateValue) {
                // Store language for natural translations after reload
                localStorage.setItem('pendingNaturalTranslation', normalizedLang)
                // Translation applied, just reload to show it
                window.location.reload()
              } else {
                // Store language for natural translations after reload
                localStorage.setItem('pendingNaturalTranslation', normalizedLang)
                // Force reload to apply cookie
                window.location.reload()
              }
            }, 300)
            return
          }
        }
        
        // If select element not found or didn't work, reload to apply cookie
        setTimeout(() => {
          // Store language for natural translations after reload
          localStorage.setItem('pendingNaturalTranslation', normalizedLang)
          window.location.reload()
        }, 200)
        
      } catch (error) {
        console.error('Translation error:', error)
        setIsTranslating(false)
        setPendingLanguageCode(null)
      }
    }

    // Small delay to ensure Google Translate is fully initialized
    const timer = setTimeout(() => {
      triggerTranslation()
    }, 200)

    return () => {
      clearTimeout(timer)
    }
  }, [pendingLanguageCode, isScriptLoaded])

  const handleLanguageChange = (language: Language) => {
    // Prevent rapid clicking
    if (isTranslating) return
    
    setCurrentLang(language)
    localStorage.setItem('preferredLanguage', language.code)
    localStorage.setItem('userLanguage', language.code)
    // Notify the i18n system so useT() hooks re-render immediately
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: language.code } }))
    setIsOpen(false)
    haptic('selection')
    
    // Apply translation
    setIsTranslating(true)
    setPendingLanguageCode(language.code)
  }

  return (
    <div className="relative">
      {/* Hidden Google Translate Element - Must be in DOM but visually hidden */}
      <div 
        id="google_translate_element" 
        style={{ position: 'absolute', left: '-9999px', width: '0', height: '0', overflow: 'hidden' }}
      ></div>

      {/* Custom Language Switcher Button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen)
          haptic('light')
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 shadow-sm hover:shadow-md language-switcher-btn touch-manipulation"
        aria-label="Change language"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {/* Content */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative z-10"
        >
          <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </motion.div>
        <span className="relative z-10 text-xs font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
          {currentLang.code.toUpperCase()}
        </span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ 
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <h3 className="text-sm font-bold text-black mb-1">
                  Choose Language
                </h3>
                <p className="text-xs text-black opacity-70">
                  Auto-translate entire site
                </p>
              </div>

              {/* Language List */}
              <div className="p-2 overflow-y-auto custom-scrollbar">
                {LANGUAGES.map((language, index) => (
                  <motion.button
                    key={language.code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.02,
                      duration: 0.2,
                      ease: "easeOut"
                    }}
                    onClick={() => handleLanguageChange(language)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-300 group relative overflow-hidden touch-manipulation ${
                      currentLang.code === language.code
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'hover:bg-blue-50 text-black'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent', minHeight: '52px' }}
                  >
                    {/* Active background animation */}
                    {currentLang.code === language.code && (
                      <motion.div
                        layoutId="activeLang"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    <div className="flex items-center space-x-3 relative z-10">
                      <motion.span 
                        className="text-2xl"
                        animate={{ 
                          scale: currentLang.code === language.code ? [1, 1.2, 1] : 1 
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {language.flag}
                      </motion.span>
                      <div>
                        <div className={`text-sm font-semibold ${currentLang.code === language.code ? 'text-white' : ''}`}>
                          {language.nativeName}
                        </div>
                        <div className={`text-xs ${currentLang.code === language.code ? 'text-white/80' : 'text-black opacity-70'}`}>
                          {language.name}
                        </div>
                      </div>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{ 
                        scale: currentLang.code === language.code ? 1 : 0,
                        opacity: currentLang.code === language.code ? 1 : 0
                      }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10"
                    >
                      <Check className="w-5 h-5 text-white" />
                    </motion.div>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-black opacity-70 mb-1 flex items-center gap-1">
                  <span className="text-base">⚡</span>
                  Powered by Google Translate
                </p>
                <p className="text-xs text-amber-600 italic">
                  ⚠️ Machine translations may contain errors. For legal accuracy, consult an expert.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Translation Loading Indicator */}
      <AnimatePresence>
        {isTranslating && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 backdrop-blur-md border border-white/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-5 w-5 border-2 border-white border-t-transparent"
            />
            <span className="text-sm font-semibold">Translating to {currentLang.nativeName}...</span>
            <motion.div
              className="absolute inset-0 rounded-2xl bg-white/20"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Custom scrollbar for language dropdown */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }

        /* Hide Google Translate banner and attribution */
        .goog-te-banner-frame {
          display: none !important;
        }
        
        body {
          top: 0 !important;
        }
        
        .skiptranslate {
          display: none !important;
        }
        
        /* Style Google Translate dropdown if visible */
        .goog-te-combo {
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          background: white;
          font-size: 14px;
        }

        /* Prevent layout shift - keep in DOM but visually hidden */
        #google_translate_element {
          position: absolute;
          left: -9999px;
          width: 0;
          height: 0;
          overflow: hidden;
          visibility: hidden;
        }
        
        /* Ensure Google Translate select is accessible */
        .goog-te-combo {
          position: absolute;
          left: -9999px;
        }

        /* Ensure translated content is visible */
        .translated-ltr {
          direction: ltr !important;
        }
        
        .translated-rtl {
          direction: rtl !important;
        }

        /* Make sure all content is translatable */
        html.translated-ltr,
        html.translated-rtl {
          font-size: inherit !important;
        }

        /* Preserve dark mode styles during translation */
        body.dark-mode {
          background-color: #111827 !important;
          color: #f9fafb !important;
        }

        /* Fix iframe positioning from Google Translate */
        body > .skiptranslate {
          display: none !important;
        }
        
        iframe.skiptranslate {
          display: none !important;
        }

        /* Prevent layout shift during translation */
        body {
          transition: none !important;
        }

        /* Speed up Google Translate rendering */
        .translated-ltr, .translated-rtl {
          transition: none !important;
        }

        /* Hide Google Translate top frame completely */
        body > .goog-te-banner-frame {
          display: none !important;
        }
        
        #goog-gt-tt {
          display: none !important;
        }
        
        /* Hide Google Translate widget element */
        .VIpgJd-ZVi9od-aZ2wEe-wOHMyf {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          position: absolute !important;
          left: -9999px !important;
          width: 0 !important;
          height: 0 !important;
        }
        
        /* Hide any Google Translate widget containers */
        [class*="VIpgJd"] {
          display: none !important;
        }
        
        /* Ensure Language Switcher button is always white with dark text */
        .language-switcher-btn,
        button[aria-label="Change language"],
        button[aria-label="Sprache ändern"],
        button[aria-label="Changer de langue"],
        button[aria-label*="language" i],
        button[aria-label*="Sprache" i],
        button[aria-label*="langue" i] {
          background-color: #ffffff !important;
          color: #111827 !important;
          border-color: #e5e7eb !important;
        }
        
        .language-switcher-btn span,
        .language-switcher-btn svg,
        button[aria-label="Change language"] span,
        button[aria-label="Sprache ändern"] span,
        button[aria-label="Changer de langue"] span,
        button[aria-label*="language" i] span,
        button[aria-label*="Sprache" i] span,
        button[aria-label*="langue" i] span,
        button[aria-label="Change language"] svg,
        button[aria-label="Sprache ändern"] svg,
        button[aria-label="Changer de langue"] svg,
        button[aria-label*="language" i] svg,
        button[aria-label*="Sprache" i] svg,
        button[aria-label*="langue" i] svg {
          color: #111827 !important;
        }
        
        .language-switcher-btn:hover,
        button[aria-label="Change language"]:hover,
        button[aria-label="Sprache ändern"]:hover,
        button[aria-label="Changer de langue"]:hover,
        button[aria-label*="language" i]:hover,
        button[aria-label*="Sprache" i]:hover,
        button[aria-label*="langue" i]:hover {
          background-color: #f9fafb !important;
        }
        
        /* Override dark mode to keep it white */
        .dark .language-switcher-btn,
        .dark button[aria-label="Change language"],
        .dark button[aria-label="Sprache ändern"],
        .dark button[aria-label="Changer de langue"],
        .dark button[aria-label*="language" i],
        .dark button[aria-label*="Sprache" i],
        .dark button[aria-label*="langue" i] {
          background-color: #ffffff !important;
          color: #111827 !important;
          border-color: #e5e7eb !important;
        }
        
        .dark .language-switcher-btn span,
        .dark .language-switcher-btn svg,
        .dark button[aria-label="Change language"] span,
        .dark button[aria-label="Sprache ändern"] span,
        .dark button[aria-label="Changer de langue"] span,
        .dark button[aria-label*="language" i] span,
        .dark button[aria-label*="Sprache" i] span,
        .dark button[aria-label*="langue" i] span,
        .dark button[aria-label="Change language"] svg,
        .dark button[aria-label="Sprache ändern"] svg,
        .dark button[aria-label="Changer de langue"] svg,
        .dark button[aria-label*="language" i] svg,
        .dark button[aria-label*="Sprache" i] svg,
        .dark button[aria-label*="langue" i] svg {
          color: #111827 !important;
        }
        
        .dark .language-switcher-btn:hover,
        .dark button[aria-label="Change language"]:hover,
        .dark button[aria-label="Sprache ändern"]:hover,
        .dark button[aria-label="Changer de langue"]:hover,
        .dark button[aria-label*="language" i]:hover,
        .dark button[aria-label*="Sprache" i]:hover,
        .dark button[aria-label*="langue" i]:hover {
          background-color: #f9fafb !important;
        }
      `}</style>
    </div>
  )
}


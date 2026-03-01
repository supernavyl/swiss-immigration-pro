'use client'

import { useEffect } from 'react'

/**
 * TranslationLoader - Applies saved translation preference on page load
 * Improved version that works better with React/Next.js
 */
export function TranslationLoader() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const applySavedTranslation = () => {
      const preferredLanguage = localStorage.getItem('preferredLanguage')
      const autoTranslateEnabled = localStorage.getItem('autoTranslateEnabled')

      // Check if translation is enabled and language is not English
      if (!preferredLanguage || !autoTranslateEnabled || preferredLanguage === 'en') {
        // If English, make sure translation cookie is cleared
        if (preferredLanguage === 'en') {
          document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          // Remove any Google Translate styling
          document.body.classList.remove('translated-ltr', 'translated-rtl')
          const gtElements = document.querySelectorAll('[class*="goog-"]')
          gtElements.forEach(el => {
            if (el.id !== 'google_translate_element') {
              el.remove()
            }
          })
        }
        return
      }

      // Normalize language code for Google Translate (use zh-CN for better natural translations)
      const normalizeLangCode = (code: string): string => {
        if (code === 'zh') return 'zh-CN'
        return code
      }
      
      // Set translation cookie
      const targetLang = normalizeLangCode(preferredLanguage)
      const cookieValue = `/en/${targetLang}`
      document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000; SameSite=Lax`

      // Initialize Google Translate widget
      const initGoogleTranslate = () => {
        // Check if already initialized
        if (window.google?.translate?.TranslateElement) {
          // Already loaded, just trigger translation
          triggerTranslation(targetLang)
          return
        }

        // Check if script is already being loaded
        if (document.querySelector('script[src*="translate.google.com"]')) {
          // Wait for script to load
          const checkInterval = setInterval(() => {
            if (window.google?.translate?.TranslateElement) {
              clearInterval(checkInterval)
              initializeWidget(targetLang)
            }
          }, 100)
          setTimeout(() => clearInterval(checkInterval), 10000)
          return
        }

        // Create hidden container for Google Translate widget
        let container = document.getElementById('google_translate_element')
        if (!container) {
          container = document.createElement('div')
          container.id = 'google_translate_element'
          container.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;'
          document.body.appendChild(container)
        }

        // Load Google Translate script
        const script = document.createElement('script')
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        script.async = true
        
        // Set up initialization callback
        ;(window as any).googleTranslateElementInit = () => {
          initializeWidget(targetLang)
        }

        script.onerror = () => {
          console.error('Failed to load Google Translate script')
        }
        
        document.head.appendChild(script)
      }

      // Initialize the widget
      const initializeWidget = (lang: string) => {
        try {
          if (!window.google?.translate?.TranslateElement) {
            console.error('Google Translate not available')
            return
          }

          // Check if already initialized
          if (document.querySelector('.goog-te-combo')) {
            triggerTranslation(lang)
            return
          }

          // Create container if needed
          let container = document.getElementById('google_translate_element')
          if (!container) {
            container = document.createElement('div')
            container.id = 'google_translate_element'
            container.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;'
            document.body.appendChild(container)
          }

          // Initialize widget with all 15 languages optimized for natural translations
          // Using zh-CN for Simplified Chinese (more natural), zh-TW for Traditional if needed
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,de,fr,it,es,pt,zh-CN,ar,hi,ru,ja,ko,tr,pl,nl',
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            'google_translate_element'
          )

          // Wait for widget to render, then trigger translation
          setTimeout(() => {
            triggerTranslation(lang)
          }, 2000)
        } catch (error) {
          console.error('Error initializing Google Translate:', error)
        }
      }

      // Trigger the translation
      const triggerTranslation = (lang: string) => {
        // Normalize language code for Google Translate
        const normalizeLangCode = (code: string): string => {
          if (code === 'zh') return 'zh-CN'
          return code
        }
        const normalizedLang = normalizeLangCode(lang)
        
        // Ensure cookie is set
        document.cookie = `googtrans=/en/${normalizedLang}; path=/; max-age=31536000; SameSite=Lax`
        
        // Try multiple methods to trigger translation
        const tryTranslate = (attempt = 0) => {
          if (attempt > 10) {
            console.log('Translation trigger failed, but cookie is set for next page load')
            return
          }

          const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
          if (select) {
            // Method 1: Set value and trigger change (use normalized code)
            select.value = normalizedLang
            const changeEvent = new Event('change', { bubbles: true, cancelable: true })
            select.dispatchEvent(changeEvent)
            
            // Method 2: Also try input event
            const inputEvent = new Event('input', { bubbles: true })
            select.dispatchEvent(inputEvent)
            
            // Method 3: Try mouse events
            const mouseEvent = new MouseEvent('change', { bubbles: true, cancelable: true })
            select.dispatchEvent(mouseEvent)
            
            // Method 4: Force update via Google Translate API if available
            if (window.google?.translate?.TranslateElement) {
              try {
                // Try to access the translation service directly
                const frame = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement
                if (frame && frame.contentWindow) {
                  frame.contentWindow.postMessage({ type: 'translate', lang: lang }, '*')
                }
              } catch (e) {
                // Ignore
              }
            }
            
            // Force a re-translation of all content after a delay
            setTimeout(() => {
              // Trigger translation on all text nodes
              const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null
              )
              
              // This helps Google Translate detect new content
              const textNodes: Text[] = []
              let node
              while (node = walker.nextNode()) {
                if (node.textContent && node.textContent.trim().length > 0) {
                  textNodes.push(node as Text)
                }
              }
              
              // Force Google Translate to re-scan
              if (window.google?.translate) {
                // Try to trigger a refresh
                const event = new Event('DOMContentLoaded', { bubbles: true })
                document.dispatchEvent(event)
              }
            }, 2000)
            
            // Check if it worked
            setTimeout(() => {
              if (select.value === normalizedLang || select.value === lang) {
                console.log('Translation applied successfully')
                // Force re-translation of dynamically loaded content
                forceRetranslate()
              } else {
                // Retry
                tryTranslate(attempt + 1)
              }
            }, 1500)
          } else {
            // Select not found yet, retry
            setTimeout(() => tryTranslate(attempt + 1), 500)
          }
        }
        
        // Function to force re-translation of React content
        const forceRetranslate = () => {
          // Wait a bit for React to render, then trigger translation again
          setTimeout(() => {
            const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
            if (select && (select.value === normalizedLang || select.value === lang)) {
              // Trigger change again to translate new content
              select.dispatchEvent(new Event('change', { bubbles: true }))
            }
          }, 3000)
        }
        
        tryTranslate()
      }

      // Start initialization
      initGoogleTranslate()
    }

    // Apply translation after DOM is ready
    const timer = setTimeout(applySavedTranslation, 1000)

    // Watch for new content being added (like modals, dynamic React content)
    const observer = new MutationObserver((mutations) => {
      const preferredLanguage = localStorage.getItem('preferredLanguage')
      const autoTranslateEnabled = localStorage.getItem('autoTranslateEnabled')
      
      if (!preferredLanguage || !autoTranslateEnabled || preferredLanguage === 'en') {
        return
      }

      // Check if significant content was added
      let shouldRetranslate = false
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              // Check if it's a modal or significant content
              if (
                element.classList.contains('modal') ||
                element.classList.contains('dialog') ||
                element.querySelector('.modal') ||
                element.querySelector('[role="dialog"]') ||
                element.textContent?.trim().length > 50
              ) {
                shouldRetranslate = true
              }
            }
          })
        }
      })

      // Trigger re-translation if new content detected
      if (shouldRetranslate) {
        setTimeout(() => {
          const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
          if (select) {
            const currentLang = preferredLanguage
            if (select.value === currentLang) {
              // Trigger change event to re-translate
              select.dispatchEvent(new Event('change', { bubbles: true }))
            }
          }
        }, 500)
      }
    })

    // Start observing after initial load
    setTimeout(() => {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: false,
      })
    }, 2000)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return null
}

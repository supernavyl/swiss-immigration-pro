'use client'

import { useEffect, useCallback } from 'react'
import { MessageCircle } from 'lucide-react'
import { useIsMobile } from '@/lib/hooks/useMediaQuery'
import { cn } from '@/lib/utils/cn'

export default function ChatbotWidget() {
  const isMobile = useIsMobile()

  const handleOpen = useCallback(() => {
    window.open('/chat', '_blank', 'noopener,noreferrer')
  }, [])

  // Register global helper so dashboard "AI Chat" button can open the tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as unknown as Record<string, unknown>).__openChatbot = handleOpen
      return () => {
        delete (window as unknown as Record<string, unknown>).__openChatbot
      }
    }
  }, [handleOpen])

  return (
    <button
      onClick={handleOpen}
      className={cn(
        'fixed z-50 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center touch-manipulation',
        isMobile
          ? 'bottom-20 right-4 w-14 h-14'
          : 'bottom-6 right-6 px-5 py-3 gap-2.5',
      )}
      aria-label="Open chatbot"
      data-chat-widget
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <MessageCircle className={isMobile ? 'w-6 h-6' : 'w-5 h-5'} />
      <span className="hidden lg:inline text-sm font-semibold">Ask AI</span>
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
    </button>
  )
}

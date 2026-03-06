'use client'

import { createContext, useContext, useState, useCallback, useEffect, lazy, Suspense, ReactNode } from 'react'

const ChatbotRight = lazy(() => import('./ChatbotRight'))

interface ChatbotContextType {
  openChatbot: () => void
  closeChatbot: () => void
  setInitialMessage: (msg: string) => void
  initialMessage: string
  isOpen: boolean
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider')
  }
  return context
}

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialMessage, setInitialMessage] = useState('')

  const openChatbot = useCallback(() => setIsOpen(true), [])
  const closeChatbot = useCallback(() => setIsOpen(false), [])

  // Register global opener for dashboard buttons etc.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as unknown as Record<string, unknown>).__openChatbot = openChatbot
      return () => {
        delete (window as unknown as Record<string, unknown>).__openChatbot
      }
    }
  }, [openChatbot])

  return (
    <ChatbotContext.Provider value={{ openChatbot, closeChatbot, isOpen, initialMessage, setInitialMessage }}>
      <div
        className="transition-[margin] duration-300 ease-out"
        style={{ marginRight: isOpen ? '420px' : '0' }}
      >
        {children}
      </div>
      <Suspense fallback={null}>
        <ChatbotRight isOpen={isOpen} onClose={closeChatbot} />
      </Suspense>
    </ChatbotContext.Provider>
  )
}

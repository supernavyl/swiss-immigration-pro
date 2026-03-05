'use client'

import { createContext, useContext, useState, useCallback, lazy, Suspense, ReactNode } from 'react'

const ChatbotRight = lazy(() => import('./ChatbotRight'))

interface ChatbotContextType {
  openChatbot: () => void
  closeChatbot: () => void
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

  const openChatbot = useCallback(() => setIsOpen(true), [])
  const closeChatbot = useCallback(() => setIsOpen(false), [])

  return (
    <ChatbotContext.Provider value={{ openChatbot, closeChatbot, isOpen }}>
      {children}
      <Suspense fallback={null}>
        <ChatbotRight isOpen={isOpen} onClose={closeChatbot} />
      </Suspense>
    </ChatbotContext.Provider>
  )
}

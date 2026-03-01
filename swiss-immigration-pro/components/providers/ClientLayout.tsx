'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { SessionProvider } from './SessionProvider'
import { ThemeProvider } from './ThemeProvider'
import { InitialQuizGate } from '@/components/quiz/InitialQuizGate'
import { TranslationLoader } from '@/components/layout/TranslationLoader'
import ScrollToTop from '@/components/layout/ScrollToTop'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { ChatbotProvider } from '@/components/chatbot/ChatbotProvider'

// Dynamic imports with ssr:false to prevent hydration mismatch
// (these components use client-only APIs: useIsMobile, useT, Google Translate DOM)
const Footer = dynamic(() => import('@/components/layout/Footer'), {
  ssr: false,
  loading: () => <footer className="bg-slate-900 text-slate-300 min-h-[420px]" />,
})
const ChatbotWidget = dynamic(() => import('@/components/chatbot/ChatbotWidget'), { ssr: false })
const QuickActionFAB = dynamic(() => import('@/components/layout/QuickActionFAB'), { ssr: false })

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <ToastProvider>
          <ChatbotProvider>
            <TranslationLoader />
            <InitialQuizGate />
            <main id="main-content" className="flex-1 transition-all duration-300 ease-out">
              {children}
            </main>
            <Footer />
            <ScrollToTop />
            <QuickActionFAB />
            <ChatbotWidget />
          </ChatbotProvider>
        </ToastProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
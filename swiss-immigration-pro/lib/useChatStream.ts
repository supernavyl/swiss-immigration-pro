'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useCurrentLanguage } from '@/lib/useCurrentLanguage'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

export interface ChatLink {
  label: string
  url: string
}

export interface UseChatStreamOptions {
  /** localStorage key for persisting messages */
  storageKey?: string
}

export interface PageCardData {
  title: string
  description: string
  url: string
  category?: 'guide' | 'tool' | 'module' | 'service'
}

export interface UseChatStreamReturn {
  messages: ChatMessage[]
  isLoading: boolean
  followUps: string[]
  pageCards: PageCardData[]
  sendMessage: (text: string) => Promise<void>
  sendPreselection: (label: string, query: string) => Promise<void>
  clearChat: () => void
  /** Whether the daily limit has been reached */
  limitReached: boolean
  limitError: string | null
}

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

interface StoredMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

function loadMessages(key: string): ChatMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed: StoredMessage[] = JSON.parse(raw)
    return parsed.map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }))
  } catch {
    return []
  }
}

function saveMessages(key: string, messages: ChatMessage[]): void {
  if (typeof window === 'undefined') return
  try {
    const serializable: StoredMessage[] = messages
      .filter((m) => !m.isStreaming)
      .map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
      }))
    localStorage.setItem(key, JSON.stringify(serializable))
  } catch {
    // quota exceeded or similar -- ignore
  }
}

// ---------------------------------------------------------------------------
// Welcome message
// ---------------------------------------------------------------------------

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Grüezi! I'm **SIP-AI**, your Swiss immigration expert.\n\n" +
    'I have access to official Swiss legal documents and know every feature on this platform. Ask me about:\n\n' +
    '- **Permits & Visas** — L, B, C, G permits and applications\n' +
    '- **Work in Switzerland** — employment, quotas, CV help\n' +
    '- **Citizenship** — naturalization, language tests, integration\n' +
    '- **Living Here** — cantons, taxes, insurance, housing\n' +
    '- **Our Tools** — permit calculator, CV builder, timeline planner\n' +
    '- **Plans & Pricing** — find the right subscription\n\n' +
    'Select a topic below or ask your question!',
  timestamp: new Date(),
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useChatStream(options: UseChatStreamOptions = {}): UseChatStreamReturn {
  const { storageKey = 'sip-chat-messages' } = options
  const currentLanguage = useCurrentLanguage()

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = loadMessages(storageKey)
    return stored.length > 0 ? stored : [WELCOME_MESSAGE]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [followUps, setFollowUps] = useState<string[]>([])
  const [pageCards, setPageCards] = useState<PageCardData[]>([])
  const [limitReached, setLimitReached] = useState(false)
  const [limitError, setLimitError] = useState<string | null>(null)

  // Abort controller for in-flight streams
  const abortRef = useRef<AbortController | null>(null)

  // Persist messages whenever they change (skip streaming-in-progress messages)
  useEffect(() => {
    const hasStreaming = messages.some((m) => m.isStreaming)
    if (!hasStreaming) {
      saveMessages(storageKey, messages)
    }
  }, [messages, storageKey])

  // -----------------------------------------------------------------------
  // Core send function (streaming)
  // -----------------------------------------------------------------------
  const sendRaw = useCallback(
    async (displayText: string, queryText: string) => {
      if (isLoading) return

      // Build user message
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: displayText,
        timestamp: new Date(),
      }

      // Placeholder for assistant response
      const assistantId = (Date.now() + 1).toString()
      const assistantPlaceholder: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      }

      setMessages((prev) => [...prev, userMsg, assistantPlaceholder])
      setIsLoading(true)
      setFollowUps([])
      setPageCards([])
      setLimitReached(false)
      setLimitError(null)

      // Prepare conversation history (exclude welcome + the two we just added)
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }))

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch('/api/chatbot/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: queryText,
            conversationHistory: history,
            language: currentLanguage,
          }),
          signal: controller.signal,
        })

        if (res.status === 429) {
          // Daily limit exceeded
          const err = await res.json().catch(() => ({ detail: 'Daily limit reached' }))
          setLimitReached(true)
          setLimitError(err.detail || 'Daily message limit reached. Upgrade for unlimited access!')
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content:
                      'You\'ve reached your daily message limit. [Upgrade your plan](/pricing) for unlimited access!',
                    isStreaming: false,
                  }
                : m,
            ),
          )
          return
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        // Read the SSE stream
        const reader = res.body?.getReader()
        if (!reader) throw new Error('No response body')

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // Process complete SSE events
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // keep incomplete line in buffer

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const jsonStr = line.slice(6).trim()
            if (!jsonStr) continue

            try {
              const data = JSON.parse(jsonStr)

              if (data.token) {
                // Append token to the streaming message
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + data.token }
                      : m,
                  ),
                )
              }

              if (data.done) {
                // Stream complete
                if (data.followUps) {
                  setFollowUps(data.followUps)
                }
                if (data.pageCards) {
                  setPageCards(data.pageCards)
                }
                // Mark message as no longer streaming
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, isStreaming: false } : m,
                  ),
                )
              }
            } catch {
              // malformed JSON -- skip
            }
          }
        }

        // Ensure streaming flag is cleared even if no done event
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId && m.isStreaming ? { ...m, isStreaming: false } : m,
          ),
        )
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return

        console.error('Chat stream error:', err)

        // Fall back to non-streaming endpoint
        try {
          const fallbackRes = await fetch('/api/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: queryText,
              conversationHistory: history,
              language: currentLanguage,
            }),
          })

          if (fallbackRes.ok) {
            const data = await fallbackRes.json()
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: data.response || 'Sorry, an error occurred.', isStreaming: false }
                  : m,
              ),
            )
            if (data.followUps) setFollowUps(data.followUps)
            return
          }
        } catch {
          // fallback also failed
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: 'I apologize, but I encountered an error. Please try again or [contact support](/contact).',
                  isStreaming: false,
                }
              : m,
          ),
        )
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [isLoading, messages, currentLanguage],
  )

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      await sendRaw(trimmed, trimmed)
    },
    [sendRaw],
  )

  const sendPreselection = useCallback(
    async (label: string, query: string) => {
      await sendRaw(label, query)
    },
    [sendRaw],
  )

  const clearChat = useCallback(() => {
    abortRef.current?.abort()
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }])
    setFollowUps([])
    setPageCards([])
    setLimitReached(false)
    setLimitError(null)
    saveMessages(storageKey, [])
  }, [storageKey])

  return {
    messages,
    isLoading,
    followUps,
    pageCards,
    sendMessage,
    sendPreselection,
    clearChat,
    limitReached,
    limitError,
  }
}

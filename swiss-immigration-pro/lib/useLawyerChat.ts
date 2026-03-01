'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useCurrentLanguage } from '@/lib/useCurrentLanguage'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LawyerMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
  legalBasis?: string[]
  nextSteps?: string[]
  deadlines?: string[]
  costs?: string[]
  complexity?: string
  sources?: Array<{ file: string; article: string; score: number }>
  pinned?: boolean
}

export interface LawyerConversation {
  id: string
  title: string
  messages: LawyerMessage[]
  case_id?: string | null
  createdAt: string
  updatedAt: string
}

export interface LawyerCaseData {
  id: string
  title: string
  status: string
  category: string
  createdAt: string
  updatedAt: string
}

export interface UploadedDoc {
  id: string
  filename: string
  file_type: string
  file_size: number
  extracted_text_preview: string
  extracted_length: number
  conversation_id: string
}

export interface UseLawyerChatReturn {
  messages: LawyerMessage[]
  isLoading: boolean
  followUps: string[]
  sendMessage: (text: string) => Promise<void>
  retryLastMessage: () => Promise<void>
  clearChat: () => void
  conversations: LawyerConversation[]
  activeConversationId: string | null
  switchConversation: (id: string) => void
  deleteConversation: (id: string) => void
  newConversation: () => void
  updateConversationTitle: (id: string, title: string) => void
  assignConversationToCase: (conversationId: string, caseId: string | null) => void
  uploadDocument: (file: File) => Promise<UploadedDoc | null>
  uploadedDocs: UploadedDoc[]
  removeDocument: (id: string) => void
  cases: LawyerCaseData[]
  createCase: (title: string, category: string) => Promise<LawyerCaseData | null>
  updateCase: (id: string, data: { title?: string; status?: string; category?: string }) => Promise<void>
  deleteCase: (id: string) => Promise<void>
  loadCases: () => Promise<void>
  exportPdf: (conversationId: string) => Promise<void>
  togglePin: (messageId: string) => void
  isOnline: boolean
  isAuthenticated: boolean
  limitReached: boolean
  anonMessagesUsed: number
}

// ---------------------------------------------------------------------------
// localStorage helpers (fallback for anonymous users)
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'sip-lawyer-conversations'
const ANON_COUNT_KEY = 'sip-lawyer-anon-count'
const ANON_DATE_KEY = 'sip-lawyer-anon-date'
const MAX_ANON_MESSAGES = 1

interface StoredMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  legalBasis?: string[]
  nextSteps?: string[]
  deadlines?: string[]
  costs?: string[]
  complexity?: string
  sources?: Array<{ file: string; article: string; score: number }>
  pinned?: boolean
}

interface StoredConversation {
  id: string
  title: string
  messages: StoredMessage[]
  case_id?: string | null
  createdAt: string
  updatedAt: string
}

function loadLocalConversations(): StoredConversation[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalConversations(convos: StoredConversation[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convos.slice(0, 20)))
  } catch { /* quota exceeded */ }
}

function hydrateMessages(stored: StoredMessage[]): LawyerMessage[] {
  return stored.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }))
}

function dehydrateMessages(msgs: LawyerMessage[]): StoredMessage[] {
  return msgs
    .filter((m) => !m.isStreaming)
    .map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: m.timestamp.toISOString(),
      legalBasis: m.legalBasis,
      nextSteps: m.nextSteps,
      deadlines: m.deadlines,
      costs: m.costs,
      complexity: m.complexity,
      sources: m.sources,
      pinned: m.pinned,
    }))
}

function getAnonCount(): { count: number; date: string } {
  if (typeof window === 'undefined') return { count: 0, date: '' }
  const date = localStorage.getItem(ANON_DATE_KEY) || ''
  const today = new Date().toISOString().slice(0, 10)
  if (date !== today) {
    localStorage.setItem(ANON_DATE_KEY, today)
    localStorage.setItem(ANON_COUNT_KEY, '0')
    return { count: 0, date: today }
  }
  return { count: parseInt(localStorage.getItem(ANON_COUNT_KEY) || '0', 10), date }
}

function incrementAnonCount(): void {
  if (typeof window === 'undefined') return
  const { count } = getAnonCount()
  localStorage.setItem(ANON_COUNT_KEY, String(count + 1))
}

// ---------------------------------------------------------------------------
// Auth token helper
// ---------------------------------------------------------------------------

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('token') || localStorage.getItem('auth-token')
  if (token) return { Authorization: `Bearer ${token}` }
  return {}
}

function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  return !!(localStorage.getItem('token') || localStorage.getItem('auth-token'))
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useLawyerChat(): UseLawyerChatReturn {
  const currentLanguage = useCurrentLanguage()
  const authenticated = isLoggedIn()

  const [conversations, setConversations] = useState<LawyerConversation[]>(() => {
    if (!authenticated) {
      const stored = loadLocalConversations()
      return stored.map((c) => ({ ...c, messages: hydrateMessages(c.messages) }))
    }
    return []
  })

  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    if (!authenticated) {
      const stored = loadLocalConversations()
      return stored.length > 0 ? stored[0].id : null
    }
    return null
  })

  const [messages, setMessages] = useState<LawyerMessage[]>(() => {
    if (!authenticated) {
      const stored = loadLocalConversations()
      if (stored.length > 0) return hydrateMessages(stored[0].messages)
    }
    return [createWelcomeMessage()]
  })

  const [isLoading, setIsLoading] = useState(false)
  const [followUps, setFollowUps] = useState<string[]>([])
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([])
  const [cases, setCases] = useState<LawyerCaseData[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [limitReached, setLimitReached] = useState(false)
  const [anonMessagesUsed, setAnonMessagesUsed] = useState(() => getAnonCount().count)

  const abortRef = useRef<AbortController | null>(null)
  const lastUserMsgRef = useRef<string>('')

  // Online/offline detection
  useEffect(() => {
    const onOnline = () => setIsOnline(true)
    const onOffline = () => setIsOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    setIsOnline(navigator.onLine)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  // Load server conversations on mount for authenticated users
  useEffect(() => {
    if (!authenticated) return
    fetchConversations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated])

  // Persist local conversations for anonymous users
  useEffect(() => {
    if (authenticated) return
    const hasStreaming = messages.some((m) => m.isStreaming)
    if (hasStreaming) return

    setConversations((prev) => {
      let updated: LawyerConversation[]
      if (activeConversationId) {
        const exists = prev.find((c) => c.id === activeConversationId)
        if (exists) {
          updated = prev.map((c) =>
            c.id === activeConversationId
              ? { ...c, messages, title: deriveTitle(messages), updatedAt: new Date().toISOString() }
              : c,
          )
        } else {
          updated = [
            { id: activeConversationId, title: deriveTitle(messages), messages, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            ...prev,
          ]
        }
      } else {
        updated = prev
      }

      const toStore: StoredConversation[] = updated.map((c) => ({
        id: c.id, title: c.title, messages: dehydrateMessages(c.messages),
        case_id: c.case_id, createdAt: c.createdAt, updatedAt: c.updatedAt,
      }))
      saveLocalConversations(toStore)
      return updated
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, activeConversationId, authenticated])

  // -----------------------------------------------------------------------
  // Server API helpers
  // -----------------------------------------------------------------------

  async function fetchConversations() {
    try {
      const res = await fetch('/api/lawyer/conversations', { headers: getAuthHeaders() })
      if (!res.ok) return
      const data = await res.json()
      const convos: LawyerConversation[] = (data.conversations || []).map((c: any) => ({
        id: c.id, title: c.title, case_id: c.case_id,
        messages: [], createdAt: c.created_at, updatedAt: c.updated_at,
      }))
      setConversations(convos)
      if (convos.length > 0 && !activeConversationId) {
        await loadConversationMessages(convos[0].id)
        setActiveConversationId(convos[0].id)
      }
    } catch { /* offline or error */ }
  }

  async function loadConversationMessages(id: string) {
    try {
      const res = await fetch(`/api/lawyer/conversations/${id}`, { headers: getAuthHeaders() })
      if (!res.ok) return
      const data = await res.json()
      const msgs: LawyerMessage[] = (data.messages || []).map((m: any) => ({
        id: m.id, role: m.role, content: m.content,
        timestamp: new Date(m.created_at),
        legalBasis: m.legal_basis, nextSteps: m.next_steps,
        deadlines: m.deadlines, complexity: m.complexity, sources: m.sources,
      }))
      if (msgs.length === 0) msgs.push(createWelcomeMessage())
      setMessages(msgs)
    } catch { /* offline or error */ }
  }

  // -----------------------------------------------------------------------
  // Send message with retry
  // -----------------------------------------------------------------------

  const sendMessage = useCallback(
    async (text: string, retryAttempt = 0) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      if (!authenticated) {
        const { count } = getAnonCount()
        if (count >= MAX_ANON_MESSAGES) {
          setLimitReached(true)
          return
        }
      }

      lastUserMsgRef.current = trimmed

      let convId = activeConversationId
      if (!convId) {
        convId = Date.now().toString()
        setActiveConversationId(convId)
      }

      const userMsg: LawyerMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      }

      const assistantId = (Date.now() + 1).toString()
      const assistantPlaceholder: LawyerMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      }

      if (retryAttempt === 0) {
        setMessages((prev) => [...prev, userMsg, assistantPlaceholder])
      } else {
        setMessages((prev) => {
          const withoutLastAssistant = prev.filter((m) => !(m.role === 'assistant' && m.content === '' && m.isStreaming))
          return [...withoutLastAssistant, assistantPlaceholder]
        })
      }
      setIsLoading(true)
      setFollowUps([])

      const history = messages
        .filter((m) => m.id !== 'welcome' && !m.isStreaming)
        .map((m) => ({ role: m.role, content: m.content }))

      const docContext = uploadedDocs.length > 0
        ? uploadedDocs.map((d) => `[${d.filename}]: ${d.extracted_text_preview}`).join('\n')
        : ''

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch('/api/lawyer/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({
            message: trimmed,
            conversation_id: authenticated ? convId : undefined,
            conversationHistory: history,
            language: currentLanguage,
            documentContext: docContext,
          }),
          signal: controller.signal,
        })

        if (res.status === 429) {
          setLimitReached(true)
          setMessages((prev) => prev.filter((m) => m.id !== assistantId))
          setIsLoading(false)
          return
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const reader = res.body?.getReader()
        if (!reader) throw new Error('No response body')

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const jsonStr = line.slice(6).trim()
            if (!jsonStr) continue

            try {
              const data = JSON.parse(jsonStr)

              if (data.token) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: m.content + data.token } : m
                  ),
                )
              }

              if (data.done) {
                if (data.conversationId && !activeConversationId) {
                  setActiveConversationId(data.conversationId)
                }
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? {
                          ...m,
                          isStreaming: false,
                          legalBasis: data.legalBasis || [],
                          nextSteps: data.nextSteps || [],
                          deadlines: data.deadlines || [],
                          costs: data.costs || [],
                          complexity: data.complexity || 'simple',
                          sources: data.sources || [],
                        }
                      : m
                  ),
                )
                if (data.followUps) setFollowUps(data.followUps)
              }
            } catch { /* skip malformed JSON */ }
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId && m.isStreaming ? { ...m, isStreaming: false } : m
          ),
        )

        if (!authenticated) {
          incrementAnonCount()
          setAnonMessagesUsed((p) => p + 1)
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return

        if (retryAttempt < 2 && isOnline) {
          const delay = Math.pow(2, retryAttempt) * 1000
          await new Promise((r) => setTimeout(r, delay))
          return sendMessage(trimmed, retryAttempt + 1)
        }

        console.error('Lawyer stream error:', err)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: 'I apologize, but I encountered a technical issue. Please try again, or [book a consultation](/consultation) with a licensed attorney for immediate assistance.',
                  isStreaming: false,
                }
              : m
          ),
        )
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [isLoading, messages, currentLanguage, activeConversationId, uploadedDocs, authenticated, isOnline],
  )

  const retryLastMessage = useCallback(async () => {
    if (lastUserMsgRef.current) {
      await sendMessage(lastUserMsgRef.current)
    }
  }, [sendMessage])

  // -----------------------------------------------------------------------
  // Conversation management
  // -----------------------------------------------------------------------

  const newConversation = useCallback(() => {
    abortRef.current?.abort()
    const id = Date.now().toString()
    setActiveConversationId(id)
    setMessages([createWelcomeMessage()])
    setFollowUps([])
    setUploadedDocs([])
  }, [])

  const switchConversation = useCallback(
    async (id: string) => {
      abortRef.current?.abort()
      setActiveConversationId(id)
      setFollowUps([])
      setIsLoading(false)
      setUploadedDocs([])

      if (authenticated) {
        await loadConversationMessages(id)
      } else {
        const convo = conversations.find((c) => c.id === id)
        if (convo) setMessages(convo.messages)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conversations, authenticated],
  )

  const deleteConversation = useCallback(
    async (id: string) => {
      if (authenticated) {
        try {
          await fetch(`/api/lawyer/conversations/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          })
        } catch { /* ignore */ }
      }

      setConversations((prev) => {
        const filtered = prev.filter((c) => c.id !== id)
        if (!authenticated) {
          saveLocalConversations(filtered.map((c) => ({
            id: c.id, title: c.title, messages: dehydrateMessages(c.messages),
            case_id: c.case_id, createdAt: c.createdAt, updatedAt: c.updatedAt,
          })))
        }
        return filtered
      })

      if (activeConversationId === id) newConversation()
    },
    [activeConversationId, newConversation, authenticated],
  )

  const updateConversationTitle = useCallback(
    async (id: string, title: string) => {
      if (authenticated) {
        try {
          await fetch(`/api/lawyer/conversations/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ title }),
          })
        } catch { /* ignore */ }
      }
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title } : c))
      )
    },
    [authenticated],
  )

  const assignConversationToCase = useCallback(
    async (conversationId: string, caseId: string | null) => {
      if (authenticated) {
        try {
          await fetch(`/api/lawyer/conversations/${conversationId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ case_id: caseId }),
          })
        } catch { /* ignore */ }
      }
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, case_id: caseId } : c))
      )
    },
    [authenticated],
  )

  const clearChat = useCallback(() => newConversation(), [newConversation])

  // -----------------------------------------------------------------------
  // Document management
  // -----------------------------------------------------------------------

  const uploadDocument = useCallback(
    async (file: File): Promise<UploadedDoc | null> => {
      if (!authenticated) return null

      const formData = new FormData()
      formData.append('file', file)
      if (activeConversationId) {
        formData.append('conversation_id', activeConversationId)
      }

      try {
        const res = await fetch('/api/lawyer/upload', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData,
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          console.error('Upload error:', err)
          return null
        }
        const doc: UploadedDoc = await res.json()
        setUploadedDocs((prev) => [...prev, doc])
        if (doc.conversation_id && !activeConversationId) {
          setActiveConversationId(doc.conversation_id)
        }
        return doc
      } catch (err) {
        console.error('Upload failed:', err)
        return null
      }
    },
    [authenticated, activeConversationId],
  )

  const removeDocument = useCallback((id: string) => {
    setUploadedDocs((prev) => prev.filter((d) => d.id !== id))
  }, [])

  // -----------------------------------------------------------------------
  // Case management
  // -----------------------------------------------------------------------

  const loadCases = useCallback(async () => {
    if (!authenticated) return
    try {
      const res = await fetch('/api/lawyer/cases', { headers: getAuthHeaders() })
      if (!res.ok) return
      const data = await res.json()
      setCases((data.cases || []).map((c: any) => ({
        id: c.id, title: c.title, status: c.status, category: c.category,
        createdAt: c.created_at, updatedAt: c.updated_at,
      })))
    } catch { /* ignore */ }
  }, [authenticated])

  useEffect(() => { loadCases() }, [loadCases])

  const createCase = useCallback(
    async (title: string, category: string): Promise<LawyerCaseData | null> => {
      if (!authenticated) return null
      try {
        const res = await fetch('/api/lawyer/cases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({ title, category }),
        })
        if (!res.ok) return null
        const data = await res.json()
        const newCase: LawyerCaseData = {
          id: data.id, title: data.title, status: data.status, category: data.category,
          createdAt: data.created_at, updatedAt: data.created_at,
        }
        setCases((prev) => [newCase, ...prev])
        return newCase
      } catch { return null }
    },
    [authenticated],
  )

  const updateCase = useCallback(
    async (id: string, data: { title?: string; status?: string; category?: string }) => {
      if (!authenticated) return
      try {
        await fetch(`/api/lawyer/cases/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(data),
        })
        setCases((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
      } catch { /* ignore */ }
    },
    [authenticated],
  )

  const deleteCase = useCallback(
    async (id: string) => {
      if (!authenticated) return
      try {
        await fetch(`/api/lawyer/cases/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        })
        setCases((prev) => prev.filter((c) => c.id !== id))
        setConversations((prev) =>
          prev.map((c) => (c.case_id === id ? { ...c, case_id: null } : c))
        )
      } catch { /* ignore */ }
    },
    [authenticated],
  )

  // -----------------------------------------------------------------------
  // PDF export
  // -----------------------------------------------------------------------

  const exportPdf = useCallback(
    async (conversationId: string) => {
      if (!authenticated) return
      try {
        const res = await fetch(`/api/lawyer/conversations/${conversationId}/export`, {
          method: 'POST',
          headers: getAuthHeaders(),
        })
        if (!res.ok) throw new Error('Export failed')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `legal-consultation-${new Date().toISOString().slice(0, 10)}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (err) {
        console.error('PDF export failed:', err)
      }
    },
    [authenticated],
  )

  // -----------------------------------------------------------------------
  // Pin
  // -----------------------------------------------------------------------

  const togglePin = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, pinned: !m.pinned } : m))
    )
  }, [])

  return {
    messages,
    isLoading,
    followUps,
    sendMessage,
    retryLastMessage,
    clearChat,
    conversations,
    activeConversationId,
    switchConversation,
    deleteConversation,
    newConversation,
    updateConversationTitle,
    assignConversationToCase,
    uploadDocument,
    uploadedDocs,
    removeDocument,
    cases,
    createCase,
    updateCase,
    deleteCase,
    loadCases,
    exportPdf,
    togglePin,
    isOnline,
    isAuthenticated: authenticated,
    limitReached,
    anonMessagesUsed,
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createWelcomeMessage(): LawyerMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    content:
      'Welcome. I am **SIP-AI Legal**, your AI-powered Swiss immigration law consultant.\n\n' +
      'I have access to the full text of the **FNIA (AIG)**, **Swiss Citizenship Act (BüG)**, ' +
      '**Agreement on Free Movement of Persons (AFMP)**, and official SEM directives.\n\n' +
      'I can help you with:\n\n' +
      '- **Permit applications** — L, B, C, G permits and eligibility\n' +
      '- **Work authorization** — employer sponsorship, quotas, labour market test\n' +
      '- **Citizenship & naturalization** — ordinary and simplified procedures\n' +
      '- **Family reunification** — spouse, children, partners\n' +
      '- **Appeals & rejections** — legal remedies and deadlines\n' +
      '- **Document review** — application forms, legal correspondence\n\n' +
      'Select a topic below or describe your legal question in detail.',
    timestamp: new Date(),
  }
}

function deriveTitle(messages: LawyerMessage[]): string {
  const firstUserMsg = messages.find((m) => m.role === 'user')
  if (firstUserMsg) {
    const text = firstUserMsg.content.slice(0, 60)
    return text.length < firstUserMsg.content.length ? text + '...' : text
  }
  return 'New Consultation'
}

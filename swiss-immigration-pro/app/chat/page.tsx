'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw, Send, Sparkles, Bot, Share2, Check, Cpu, Shield } from 'lucide-react'
import Link from 'next/link'
import { useChatStream } from '@/lib/useChatStream'
import TypingMarkdown from '@/components/chatbot/TypingMarkdown'
import { cn } from '@/lib/utils/cn'

const QUICK_TOPICS = [
  {
    label: 'B Permit requirements',
    query: 'What are the requirements for a B permit in Switzerland?',
  },
  {
    label: 'EU vs non-EU pathway',
    query:
      'What is the difference between the EU/EFTA pathway and non-EU pathway for Swiss immigration?',
  },
  {
    label: 'Canton strategy',
    query: 'Which Swiss cantons are best for work permit approval and why?',
  },
  {
    label: 'Salary benchmarks',
    query: 'What are typical salary benchmarks for tech workers in Switzerland?',
  },
  {
    label: 'Document checklist',
    query: 'What documents do I need for a Swiss work permit application?',
  },
  {
    label: 'Citizenship path',
    query: 'What is the path to Swiss citizenship and how long does it take?',
  },
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-blue-400/80 block"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function ChatPage() {
  const { messages, isLoading, followUps, sendMessage, sendPreselection, clearChat } =
    useChatStream({ storageKey: 'sip-chat-tab' })
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = useCallback(() => {
    void navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [])

  const messageCount = messages.filter((m) => m.role === 'user').length
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    await sendMessage(text)
  }, [input, isLoading, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        void handleSend()
      }
    },
    [handleSend],
  )

  // Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  const isWelcomeOnly = messages.length === 1 && messages[0].id === 'welcome'

  return (
    <div
      className="flex flex-col h-screen text-white overflow-hidden relative"
      style={{ backgroundColor: '#080c18' }}
    >
      {/* CSS grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient glows */}
      <div
        className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <header
        className="relative z-10 border-b"
        style={{
          backgroundColor: 'rgba(8,12,24,0.9)',
          borderColor: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Accent line */}
        <div
          className="h-[2px] w-full"
          style={{ background: 'linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6, transparent)' }}
        />

        {/* Main header row */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          {/* Left: back link */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium transition-colors shrink-0"
            style={{ color: '#64748b' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">SIP</span>
          </Link>

          {/* Center: branding + model info */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  boxShadow: '0 0 16px rgba(59,130,246,0.35)',
                }}
              >
                <Bot className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm tracking-wide">SIP-AI</span>
                  <span
                    className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'rgba(52,211,153,0.12)',
                      border: '1px solid rgba(52,211,153,0.2)',
                      color: '#34d399',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[10px] hidden sm:block" style={{ color: '#475569' }}>
                  Swiss Immigration Expert
                </p>
              </div>
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Message counter */}
            {messageCount > 0 && (
              <span
                className="hidden md:flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg mr-1"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#475569',
                }}
              >
                {messageCount} {messageCount === 1 ? 'message' : 'messages'}
              </span>
            )}

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
              style={{ color: copied ? '#34d399' : '#64748b' }}
              title="Copy link"
              onMouseEnter={(e) => {
                if (!copied) {
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (!copied) {
                  e.currentTarget.style.color = '#64748b'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>

            {/* New chat */}
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
              style={{ color: '#64748b' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#64748b'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </div>

        {/* Info strip */}
        <div
          className="flex items-center justify-center gap-4 px-4 py-1.5 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.04)' }}
        >
          <span className="flex items-center gap-1.5 text-[10px]" style={{ color: '#334155' }}>
            <Cpu className="w-3 h-3" style={{ color: '#3b82f6' }} />
            Llama 3.3 70B
          </span>
          <span className="w-px h-3" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
          <span className="flex items-center gap-1.5 text-[10px]" style={{ color: '#334155' }}>
            <Shield className="w-3 h-3" style={{ color: '#6366f1' }} />
            Swiss Law Trained
          </span>
          <span className="w-px h-3" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
          <span className="flex items-center gap-1.5 text-[10px]" style={{ color: '#334155' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
            26 Cantons Covered
          </span>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
          {/* Welcome hero */}
          {isWelcomeOnly && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="text-center py-8 pb-4"
            >
              <div className="relative inline-flex mb-5">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    boxShadow: '0 8px 32px rgba(59,130,246,0.3)',
                  }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 animate-pulse"
                  style={{ backgroundColor: '#34d399', borderColor: '#080c18' }}
                />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Swiss Immigration Expert</h1>
              <p className="text-sm max-w-sm mx-auto" style={{ color: '#94a3b8' }}>
                Instant answers on permits, pathways, salaries, and strategy — available 24/7.
              </p>
            </motion.div>
          )}

          {/* Message list */}
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'assistant' && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mr-2.5 mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                  >
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm',
                  )}
                  style={
                    msg.role === 'user'
                      ? {
                          background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                          color: '#ffffff',
                          boxShadow: '0 4px 20px rgba(59,130,246,0.12)',
                        }
                      : {
                          backgroundColor: 'rgba(30,41,59,0.6)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          backdropFilter: 'blur(8px)',
                          color: '#e2e8f0',
                        }
                  }
                >
                  <TypingMarkdown
                    content={msg.content}
                    isStreaming={msg.isStreaming ?? false}
                    role={msg.role}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="flex justify-start"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mr-2.5 mt-0.5"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                >
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div
                  className="rounded-2xl rounded-tl-sm"
                  style={{
                    backgroundColor: 'rgba(30,41,59,0.6)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Follow-up suggestions */}
          <AnimatePresence>
            {followUps.length > 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-wrap gap-2 pl-9"
              >
                {followUps.slice(0, 3).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => void sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full transition-all"
                    style={{
                      backgroundColor: 'rgba(59,130,246,0.08)',
                      border: '1px solid rgba(59,130,246,0.2)',
                      color: '#93c5fd',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.16)'
                      e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.08)'
                      e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)'
                    }}
                  >
                    {q}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick topic pills — welcome state only */}
          {isWelcomeOnly && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2"
            >
              {QUICK_TOPICS.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => void sendPreselection(topic.label, topic.query)}
                  className="text-left text-xs px-3.5 py-2.5 rounded-xl transition-all"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#cbd5e1',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                    e.currentTarget.style.color = '#ffffff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.color = '#cbd5e1'
                  }}
                >
                  {topic.label}
                </button>
              ))}
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input area */}
      <div
        className="relative z-10 border-t px-4 py-4"
        style={{
          borderColor: 'rgba(255,255,255,0.06)',
          backgroundColor: 'rgba(8,12,24,0.85)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all duration-200"
            style={{
              backgroundColor: 'rgba(15,23,42,0.8)',
              border: focused
                ? '1px solid rgba(59,130,246,0.5)'
                : '1px solid rgba(255,255,255,0.08)',
              boxShadow: focused ? '0 0 0 3px rgba(59,130,246,0.07)' : 'none',
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Ask anything about Swiss immigration…"
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-white resize-none outline-none leading-relaxed disabled:opacity-50 max-h-40"
              style={{ color: '#ffffff' }}
            />
            <button
              onClick={() => void handleSend()}
              disabled={!input.trim() || isLoading}
              className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
              style={
                input.trim() && !isLoading
                  ? {
                      background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                      color: '#ffffff',
                      boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
                    }
                  : {
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: '#475569',
                      cursor: 'not-allowed',
                    }
              }
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-center text-xs mt-2.5" style={{ color: '#334155' }}>
            SIP-AI can make mistakes. Verify critical immigration dates with official sources.
          </p>
        </div>
      </div>
    </div>
  )
}

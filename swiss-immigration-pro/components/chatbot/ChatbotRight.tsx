'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Send,
  Bot,
  User,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { PRESELECTION_CATEGORIES, QUICK_QUESTIONS, PreselectionOption } from './ChatbotPreselection'
import { useChatStream } from '@/lib/useChatStream'
import { useChatbot } from './ChatbotProvider'
import { PageCard } from '@/components/ui/PageCard'
import TypingMarkdown from './TypingMarkdown'
import { cn } from '@/lib/utils/cn'

/** Block javascript: and data: URIs to prevent XSS via markdown links. */
function isSafeHref(href: string | undefined): boolean {
  if (!href) return false
  const trimmed = href.trim().toLowerCase()
  return !trimmed.startsWith('javascript:') && !trimmed.startsWith('data:')
}

interface ChatbotRightProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatbotRight({ isOpen, onClose }: ChatbotRightProps) {
  const {
    messages,
    isLoading,
    followUps,
    pageCards,
    sendMessage,
    sendPreselection,
    clearChat,
    limitReached,
  } = useChatStream({ storageKey: 'sip-chat-right' })

  const { initialMessage, setInitialMessage } = useChatbot()

  const [input, setInput] = useState('')
  const [showPreselection, setShowPreselection] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle initial message from context (e.g. from blog context menu)
  useEffect(() => {
    if (isOpen && initialMessage) {
      setInput(initialMessage)
      setInitialMessage('') // Clear it so it doesn't persist
      setShowPreselection(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, initialMessage, setInitialMessage])

  // Reset preselection when opening (only if no initial message)
  useEffect(() => {
    if (isOpen && !initialMessage) {
      if (messages.length <= 1) {
        setShowPreselection(true)
        setExpandedCategory(null)
      }
      setTimeout(() => inputRef.current?.focus(), 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return
    const text = input.trim()
    setInput('')
    setShowPreselection(false)
    await sendMessage(text)
  }, [input, isLoading, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const handlePreselectionClick = useCallback(
    async (option: PreselectionOption) => {
      setShowPreselection(false)
      await sendPreselection(option.label, option.query)
    },
    [sendPreselection],
  )

  const handleFollowUpClick = useCallback(
    async (question: string) => {
      await sendMessage(question)
    },
    [sendMessage],
  )

  const handleCopy = useCallback((id: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }, [])

  const handleNewChat = useCallback(() => {
    clearChat()
    setShowPreselection(true)
    setExpandedCategory(null)
  }, [clearChat])

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/30 backdrop-blur-sm sm:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side panel */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white dark:bg-gray-900 shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-700',
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header — clean white with Swiss red accent */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Bot className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-semibold text-sm text-gray-900 dark:text-white">SIP-AI</h2>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Swiss Immigration Expert</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={handleNewChat}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="New conversation"
              title="New conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close chatbot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
          {/* Preselection */}
          {(showPreselection || messages.length <= 1) && (
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                  Quick Questions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handlePreselectionClick(option)}
                      disabled={isLoading}
                      className="px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-700 transition-colors disabled:opacity-50"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {PRESELECTION_CATEGORIES.map((category) => (
                <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedCategory(expandedCategory === category.id ? null : category.id)
                    }
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.title}</span>
                    </span>
                    {expandedCategory === category.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-200 ease-out',
                      expandedCategory === category.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
                    )}
                  >
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 space-y-1">
                      {category.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handlePreselectionClick(option)}
                          disabled={isLoading}
                          className="w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700 transition-colors disabled:opacity-50"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowPreselection(false)}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Or type your question below
                </button>
              </div>
            </div>
          )}

          {/* Message List */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mt-1">
                  <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
              )}
              <div className="group relative max-w-[85%]">
                <div
                  className={cn(
                    'rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-md shadow-sm',
                  )}
                >
                  {message.role === 'assistant' ? (
                    <TypingMarkdown
                      content={message.content || ''}
                      isStreaming={!!message.isStreaming}
                      role="assistant"
                    />
                  ) : (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none [&>*:last-child]:mb-0">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, href, children, ...props }) =>
                            isSafeHref(href) ? (
                              <Link
                                href={href!}
                                className="text-blue-100 hover:text-white underline decoration-1 underline-offset-2"
                                target={href!.startsWith('/') ? undefined : '_blank'}
                                rel={href!.startsWith('/') ? undefined : 'noopener noreferrer'}
                              >
                                {children}
                              </Link>
                            ) : (
                              <span>{children}</span>
                            ),
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Copy button */}
                {message.role === 'assistant' && !message.isStreaming && message.content && message.id !== 'welcome' && (
                  <button
                    onClick={() => handleCopy(message.id, message.content)}
                    className="absolute -bottom-5 left-0 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1"
                    title="Copy response"
                  >
                    {copiedId === message.id ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center mt-1">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && !messages.some((m) => m.isStreaming) && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Follow-up suggestions */}
          {followUps.length > 0 && !isLoading && (
            <div className="flex flex-wrap gap-2 pt-1">
              <div className="w-full flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Follow-up questions
                </span>
              </div>
              {followUps.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleFollowUpClick(q)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-700 transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Page card suggestions */}
          {pageCards.length > 0 && !isLoading && (
            <div className="space-y-2 pt-1">
              {pageCards.slice(0, 3).map((card, i) => (
                <PageCard key={i} {...card} />
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
          {limitReached ? (
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Daily limit reached</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Upgrade for unlimited AI access</p>
              <a
                href="/pricing"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors w-full"
              >
                Upgrade — CHF 9/mo
              </a>
            </div>
          ) : (
            <>
              {!showPreselection && messages.length > 1 && (
                <button
                  onClick={() => setShowPreselection(true)}
                  className="mb-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  Show topic selection
                </button>
              )}
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Swiss immigration..."
                  className="flex-1 resize-none border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-shadow"
                  rows={2}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 transition-colors flex items-center justify-center flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 text-center">
                Powered by official Swiss immigration documents
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  Bot,
  User,
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
import { format } from 'date-fns'
import { PRESELECTION_CATEGORIES, QUICK_QUESTIONS, PreselectionOption } from './ChatbotPreselection'
import { useChatStream, ChatMessage } from '@/lib/useChatStream'
import { useSwipe } from '@/lib/hooks/useSwipeGesture'
import { useHaptic } from '@/lib/hooks/useHaptic'
import { useIsMobile } from '@/lib/hooks/useMediaQuery'
import { cn } from '@/lib/utils/cn'
import TypingMarkdown from './TypingMarkdown'

/** Block javascript: and data: URIs to prevent XSS via markdown links. */
function isSafeHref(href: string | undefined): boolean {
  if (!href) return false
  const trimmed = href.trim().toLowerCase()
  return !trimmed.startsWith('javascript:') && !trimmed.startsWith('data:')
}

/**
 * Returns true if this message is the last in a consecutive sequence
 * of messages with the same role (i.e., the next message has a different role
 * or this is the final message). Used to decide whether to show a timestamp.
 */
function isLastInSequence(messages: ChatMessage[], index: number): boolean {
  if (index === messages.length - 1) return true
  return messages[index + 1].role !== messages[index].role
}

export default function ChatbotWidget() {
  const {
    messages,
    isLoading,
    followUps,
    sendMessage,
    sendPreselection,
    clearChat,
    limitReached,
  } = useChatStream({ storageKey: 'sip-chat-widget' })

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [showPreselection, setShowPreselection] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const { haptic } = useHaptic()
  const isMobile = useIsMobile()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Swipe gestures for chat window
  const chatWindowRef = useSwipe<HTMLDivElement>({
    onSwipeDown: () => {
      if (isMobile && !isMinimized) {
        setIsMinimized(true)
        haptic('light')
      }
    },
    onSwipeRight: () => {
      if (isMobile) {
        setIsOpen(false)
        haptic('medium')
      }
    },
    threshold: 60,
  })

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Show preselection when chat opens with few messages
  useEffect(() => {
    if (isOpen && !isMinimized && messages.length <= 1) {
      setShowPreselection(true)
      setExpandedCategory(null)
    }
  }, [isOpen, isMinimized, messages.length])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen, isMinimized])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return
    const text = input.trim()
    setInput('')
    setShowPreselection(false)
    haptic('light')
    await sendMessage(text)
  }, [input, isLoading, sendMessage, haptic])

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

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setIsMinimized(false)
    haptic('medium')
    if (messages.length <= 1) {
      setShowPreselection(true)
      setExpandedCategory(null)
    }
  }, [messages.length, haptic])

  // Register global helper so dashboard "AI Chat" button can open widget
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as unknown as Record<string, unknown>).__openChatbot = handleOpen
      return () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (window as unknown as Record<string, unknown>).__openChatbot
      }
    }
  }, [handleOpen])

  const handleNewChat = useCallback(() => {
    clearChat()
    setShowPreselection(true)
    setExpandedCategory(null)
    haptic('light')
  }, [clearChat, haptic])

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleOpen}
            className={cn(
              'fixed z-50 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center touch-manipulation',
              isMobile
                ? 'bottom-20 right-4 p-5'
                : 'bottom-6 right-6 px-5 py-3 gap-2.5',
            )}
            aria-label="Open chatbot"
            data-chat-widget
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <MessageCircle className={isMobile ? 'w-7 h-7' : 'w-5 h-5'} />
            <span className="hidden lg:inline text-sm font-semibold">Ask AI</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            {isMobile && !isMinimized && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
                onClick={() => setIsOpen(false)}
              />
            )}

            {/* Chat Window */}
            <motion.div
              ref={chatWindowRef}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className={cn(
                'fixed z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300',
                isMinimized
                  ? isMobile ? 'bottom-20 right-4 w-[calc(100vw-2rem)] h-16' : 'bottom-6 right-6 w-80 h-16'
                  : isMobile
                    ? 'bottom-4 right-4 left-4 h-[calc(100vh-6rem)] rounded-3xl'
                    : 'bottom-6 right-6 w-[400px] h-[640px] max-h-[85vh]',
              )}
              data-chat-widget
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Header */}
              <div className={cn(
                'flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0',
                isMobile ? 'px-5 py-4' : 'px-4 py-3',
              )}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'rounded-full bg-white/20 flex items-center justify-center',
                    isMobile ? 'w-10 h-10' : 'w-8 h-8',
                  )}>
                    <Bot className={isMobile ? 'w-5 h-5' : 'w-4 h-4'} />
                  </div>
                  <div>
                    <h3 className={cn('font-semibold', isMobile ? 'text-base' : 'text-sm')}>SIP-AI</h3>
                    {!isMinimized && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <p className="text-[10px] text-blue-100">Online &middot; Typically replies instantly</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!isMinimized && (
                    <button
                      onClick={handleNewChat}
                      className={cn(
                        'hover:bg-white/20 rounded-lg transition-colors touch-manipulation',
                        isMobile ? 'p-2.5' : 'p-1.5',
                      )}
                      aria-label="New conversation"
                      title="New conversation"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <RotateCcw className={isMobile ? 'w-[18px] h-[18px]' : 'w-3.5 h-3.5'} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsMinimized(!isMinimized)
                      haptic('light')
                    }}
                    className={cn(
                      'hover:bg-white/20 rounded-lg transition-colors touch-manipulation',
                      isMobile ? 'p-2.5' : 'p-1.5',
                    )}
                    aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {isMinimized
                      ? <Maximize2 className={isMobile ? 'w-[18px] h-[18px]' : 'w-3.5 h-3.5'} />
                      : <Minimize2 className={isMobile ? 'w-[18px] h-[18px]' : 'w-3.5 h-3.5'} />}
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      haptic('medium')
                    }}
                    className={cn(
                      'hover:bg-white/20 rounded-lg transition-colors touch-manipulation',
                      isMobile ? 'p-2.5' : 'p-1.5',
                    )}
                    aria-label="Close"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <X className={isMobile ? 'w-[18px] h-[18px]' : 'w-3.5 h-3.5'} />
                  </button>
                </div>
              </div>

              {/* Body */}
              {!isMinimized && (
                <>
                  {/* Swipe Indicator for Mobile */}
                  {isMobile && (
                    <div className="flex justify-center py-2 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700">
                      <div className="w-12 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                    </div>
                  )}

                  {/* Messages */}
                  <div className={cn(
                    'flex-1 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-950',
                    isMobile ? 'p-5' : 'p-4',
                  )}>
                  {/* Preselection */}
                  {(showPreselection || messages.length <= 1) && (
                    <div className="space-y-3 mb-4">
                      {/* Quick Questions */}
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

                      {/* Categories */}
                      {PRESELECTION_CATEGORIES.map((category) => (
                        <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              setExpandedCategory(expandedCategory === category.id ? null : category.id)
                            }
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              <span>{category.title}</span>
                            </span>
                            {expandedCategory === category.id ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <AnimatePresence>
                            {expandedCategory === category.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="overflow-hidden"
                              >
                                <div className="p-1.5 bg-gray-50 dark:bg-gray-900 space-y-1">
                                  {category.options.map((option) => (
                                    <button
                                      key={option.id}
                                      onClick={() => handlePreselectionClick(option)}
                                      disabled={isLoading}
                                      className="w-full text-left px-2.5 py-1.5 text-xs bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700 transition-colors disabled:opacity-50"
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setShowPreselection(false)}
                          className="text-[10px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          Or type your question below
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message List */}
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={cn('flex gap-2.5', message.role === 'user' ? 'justify-end' : 'justify-start')}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center mt-1">
                          <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      <div className="group relative max-w-[80%]">
                        <div
                          className={cn(
                            'rounded-2xl px-3.5 py-2.5',
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

                        {/* Timestamp — shown for the last message in a consecutive sequence */}
                        {isLastInSequence(messages, index) && !message.isStreaming && message.timestamp && (
                          <p className={cn(
                            'text-[10px] text-gray-400 dark:text-gray-500 mt-1',
                            message.role === 'user' ? 'text-right' : 'text-left',
                          )}>
                            {format(new Date(message.timestamp), 'HH:mm')}
                          </p>
                        )}

                        {/* Copy button for assistant messages */}
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
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mt-1">
                          <User className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && !messages.some((m) => m.isStreaming) && (
                    <div className="flex gap-2.5 justify-start">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Follow-up suggestions */}
                  {followUps.length > 0 && !isLoading && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <div className="w-full flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Follow-up questions
                        </span>
                      </div>
                      {followUps.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleFollowUpClick(q)}
                          disabled={isLoading}
                          className="px-2.5 py-1 text-xs bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-700 transition-colors disabled:opacity-50"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
                  {limitReached ? (
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 p-3 text-center">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Daily limit reached</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Upgrade for unlimited AI access — just CHF 9/mo</p>
                      <a
                        href="/pricing"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors w-full touch-manipulation"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Upgrade to Unlimited — CHF 9/mo
                      </a>
                    </div>
                  ) : (
                    <>
                      {!showPreselection && messages.length > 1 && (
                        <button
                          onClick={() => setShowPreselection(true)}
                          className="mb-2 text-[10px] text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium touch-manipulation"
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                          Show topic selection
                        </button>
                      )}
                      <div className="flex gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400 dark:focus-within:border-blue-500 transition-shadow">
                        <textarea
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask about Swiss immigration..."
                          className={cn(
                            'flex-1 resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none touch-manipulation',
                            isMobile ? 'px-4 py-3 text-base' : 'px-3 py-2 text-sm',
                          )}
                          rows={1}
                          disabled={isLoading}
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        />
                        <button
                          onClick={handleSend}
                          disabled={!input.trim() || isLoading}
                          className={cn(
                            'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex-shrink-0 active:scale-95 touch-manipulation m-1',
                            isMobile ? 'p-3' : 'p-2',
                          )}
                          aria-label="Send message"
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                          <Send className={isMobile ? 'w-5 h-5' : 'w-4 h-4'} />
                        </button>
                      </div>
                    </>
                  )}
                  {isMobile && !limitReached && (
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
                      Swipe right to close &middot; Swipe down to minimize
                    </p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { useTypingEffect } from '@/lib/useTypingEffect'

/** Block javascript: and data: URIs to prevent XSS via markdown links. */
function isSafeHref(href: string | undefined): boolean {
  if (!href) return false
  const trimmed = href.trim().toLowerCase()
  return !trimmed.startsWith('javascript:') && !trimmed.startsWith('data:')
}

interface TypingMarkdownProps {
  content: string
  isStreaming: boolean
  /** Controls link colour scheme */
  role: 'user' | 'assistant'
}

/**
 * Renders markdown with a fluid, character-by-character typing animation
 * for streaming messages. Non-streaming messages render instantly.
 *
 * A smooth blinking cursor is shown while text is still being revealed.
 */
function TypingMarkdownInner({ content, isStreaming, role }: TypingMarkdownProps) {
  const { displayed, isTyping } = useTypingEffect(content, isStreaming)

  // During streaming / typing, render plain text to avoid re-parsing markdown
  // on every token. Switch to full ReactMarkdown only once content is final.
  const showMarkdown = !isStreaming && !isTyping

  return (
    <div className="text-sm prose prose-sm dark:prose-invert max-w-none [&>*:last-child]:mb-0">
      {showMarkdown ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ node, href, children, ...props }) =>
              isSafeHref(href) ? (
                <Link
                  href={href!}
                  className={`underline decoration-1 underline-offset-2 ${
                    role === 'user'
                      ? 'text-blue-100 hover:text-white'
                      : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                  }`}
                  target={href!.startsWith('/') ? undefined : '_blank'}
                  rel={href!.startsWith('/') ? undefined : 'noopener noreferrer'}
                >
                  {children}
                </Link>
              ) : (
                <span>{children}</span>
              ),
            p: ({ node, ...props }) => (
              <p className="mb-2 last:mb-0 leading-relaxed" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside mb-2 space-y-0.5" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside mb-2 space-y-0.5" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-semibold" {...props} />
            ),
            hr: ({ node, ...props }) => (
              <hr className="my-2 border-gray-200 dark:border-gray-600" {...props} />
            ),
          }}
        >
          {content || ''}
        </ReactMarkdown>
      ) : (
        <span className="whitespace-pre-wrap">{displayed || ''}</span>
      )}

      {/* Smooth blinking cursor */}
      {isTyping && (
        <span
          className={`typing-cursor${isStreaming ? ' typing-cursor--streaming' : ''}`}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

/**
 * Memoised — only re-renders when props change, not on every parent tick.
 */
const TypingMarkdown = memo(TypingMarkdownInner)
TypingMarkdown.displayName = 'TypingMarkdown'
export default TypingMarkdown

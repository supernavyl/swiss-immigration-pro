'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { useTypewriter } from '@/lib/hooks/useTypewriter'

/** Block javascript: and data: URIs to prevent XSS via markdown links. */
function isSafeHref(href: string | undefined): boolean {
  if (!href) return false
  const trimmed = href.trim().toLowerCase()
  return !trimmed.startsWith('javascript:') && !trimmed.startsWith('data:')
}

// ---------------------------------------------------------------------------
// Shared markdown component map for lawyer responses
// ---------------------------------------------------------------------------

// React-markdown passes `node` from the AST; standard HTML attributes don't include it
type MarkdownComponentProps<T> = React.HTMLAttributes<T> & { node?: unknown }

const markdownComponents = {
  a: ({ node: _node, href, children, ...props }: MarkdownComponentProps<HTMLAnchorElement> & { href?: string }) =>
    isSafeHref(href) ? (
      <Link
        href={href!}
        className="text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300"
        target={href!.startsWith('/') ? undefined : '_blank'}
        rel={href!.startsWith('/') ? undefined : 'noopener noreferrer'}
      >
        {children}
      </Link>
    ) : (
      <span>{children}</span>
    ),
  p: ({ node: _node, ...props }: MarkdownComponentProps<HTMLParagraphElement>) => (
    <p className="mb-2 last:mb-0 leading-relaxed text-gray-900 dark:text-gray-100" {...props} />
  ),
  ul: ({ node: _node, ...props }: MarkdownComponentProps<HTMLUListElement>) => (
    <ul className="list-disc list-inside mb-2 space-y-1" {...props} />
  ),
  ol: ({ node: _node, ...props }: MarkdownComponentProps<HTMLOListElement>) => (
    <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />
  ),
  strong: ({ node: _node, ...props }: MarkdownComponentProps<HTMLElement>) => (
    <strong className="font-semibold text-gray-900 dark:text-white" {...props} />
  ),
  h2: ({ node: _node, ...props }: MarkdownComponentProps<HTMLHeadingElement>) => (
    <h2 className="text-base font-bold text-gray-900 dark:text-white mt-4 mb-2" {...props} />
  ),
  h3: ({ node: _node, ...props }: MarkdownComponentProps<HTMLHeadingElement>) => (
    <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-3 mb-1.5" {...props} />
  ),
  hr: ({ node: _node, ...props }: MarkdownComponentProps<HTMLHRElement>) => (
    <hr className="my-3 border-gray-200 dark:border-gray-700" {...props} />
  ),
}

// ---------------------------------------------------------------------------
// TypewriterMarkdown — markdown with typewriter effect + cursor
// ---------------------------------------------------------------------------

export interface TypewriterMarkdownProps {
  content: string
  isStreaming?: boolean
  /** Enable typewriter animation (disable for old/history messages) */
  enabled?: boolean
  /** Characters per tick (default 2 for snappy feel) */
  charsPerTick?: number
  /** Ms between ticks (default 12) */
  speed?: number
  className?: string
}

export function TypewriterMarkdown({
  content,
  isStreaming = false,
  enabled = true,
  charsPerTick = 2,
  speed = 12,
  className = '',
}: TypewriterMarkdownProps) {
  const { displayedText, isTyping } = useTypewriter({
    text: content,
    charsPerTick,
    speed,
    isStreaming,
    enabled,
  })

  // During streaming / typing, render plain text to avoid re-parsing markdown
  // on every token. Switch to full ReactMarkdown only once content is final.
  const showMarkdown = !isStreaming && !isTyping

  return (
    <div className={className}>
      {showMarkdown ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {content || ''}
        </ReactMarkdown>
      ) : (
        <span className="whitespace-pre-wrap">{displayedText || ''}</span>
      )}
      {isTyping && (
        <span
          className={`typing-cursor align-text-bottom ${isStreaming ? 'typing-cursor--streaming' : ''}`}
          aria-hidden
        />
      )}
    </div>
  )
}

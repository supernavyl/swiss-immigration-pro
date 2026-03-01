'use client'

import { memo, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MemoizedMarkdownProps {
  content: string
  className?: string
}

/**
 * Memoized Markdown component for better performance
 * Only re-renders when content changes
 */
const MemoizedMarkdown = memo(({ content, className = '' }: MemoizedMarkdownProps) => {
  // Memoize the rendered content
  const renderedContent = useMemo(() => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => {
            const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
            return (
              <div className="mb-8 mt-10 first:mt-0 w-full">
                <h1 
                  id={id} 
                  className="scroll-mt-20 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b-2 border-gray-300 dark:border-gray-600 w-full"
                  style={{ 
                    willChange: 'transform',
                    transform: 'translateZ(0)'
                  }}
                >
                  {props.children}
                </h1>
              </div>
            )
          },
          h2: ({ node, ...props }) => {
            const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
            return (
              <div className="mb-6 mt-10 w-full">
                <h2 
                  id={id} 
                  className="scroll-mt-20 text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white mb-4 w-full"
                  style={{ 
                    willChange: 'transform',
                    transform: 'translateZ(0)'
                  }}
                >
                  {props.children}
                </h2>
              </div>
            )
          },
          h3: ({ node, ...props }) => {
            const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
            return (
              <div className="mb-5 mt-8 w-full">
                <h3 
                  id={id} 
                  className="scroll-mt-20 text-xl md:text-2xl lg:text-3xl font-medium text-gray-900 dark:text-white mb-3 w-full"
                  style={{ 
                    willChange: 'transform',
                    transform: 'translateZ(0)'
                  }}
                >
                  {props.children}
                </h3>
              </div>
            )
          },
          h4: ({ node, ...props }) => (
            <h4 
              className="text-lg font-medium text-gray-900 dark:text-white mb-3 mt-6" 
              {...props}
              style={{ 
                willChange: 'transform',
                transform: 'translateZ(0)'
              }}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed text-base lg:text-lg"
              style={{ 
                lineHeight: '1.75', 
                maxWidth: '100%',
                willChange: 'contents'
              }}
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="mb-6 ml-6 lg:ml-8 space-y-2 lg:space-y-3 list-disc text-gray-700 dark:text-gray-300 text-base lg:text-lg"
              style={{ 
                lineHeight: '1.75',
                contain: 'layout style'
              }}
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="mb-6 ml-6 lg:ml-8 space-y-2 lg:space-y-3 list-decimal text-gray-700 dark:text-gray-300 text-base lg:text-lg"
              style={{ 
                lineHeight: '1.75',
                contain: 'layout style'
              }}
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li 
              className="mb-1" 
              {...props}
              style={{ 
                contain: 'layout style'
              }}
            />
          ),
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code
                className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded text-sm font-mono"
                {...props}
              />
            ) : (
              <code
                className="block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono overflow-x-auto mb-4"
                {...props}
                style={{ 
                  contain: 'layout style paint',
                  willChange: 'scroll-position'
                }}
              />
            ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300 my-4"
              {...props}
            />
          ),
          a: ({ node, ...props }: any) => (
            <a
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline transition-colors"
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-gray-900 dark:text-white" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6" style={{ contain: 'layout style' }}>
              <table
                className="min-w-full border-collapse border border-gray-300 dark:border-gray-600"
                {...props}
              />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="border border-gray-300 dark:border-gray-600 px-4 py-2"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    )
  }, [content])

  return <div className={`prose prose-lg dark:prose-invert max-w-none w-full ${className}`}>{renderedContent}</div>
})

MemoizedMarkdown.displayName = 'MemoizedMarkdown'

export default MemoizedMarkdown























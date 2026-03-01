'use client'

import { type ComponentPropsWithoutRef } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ModuleMarkdownProps {
  content: string
  completedSections: Record<string, boolean>
}

function idFromChildren(children: React.ReactNode): string {
  return String(children ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

/** Heading factory that shows a green check when the section is completed. */
function makeHeading(
  Tag: 'h1' | 'h2' | 'h3',
  completedSections: Record<string, boolean>,
  sizeClass: string,
  wrapperClass: string,
) {
  const Component = (props: ComponentPropsWithoutRef<typeof Tag>) => {
    const id = idFromChildren(props.children)
    const done = completedSections[id]
    const checkSize = Tag === 'h1' ? 'w-5 h-5' : Tag === 'h2' ? 'w-5 h-5' : 'w-4 h-4'

    return (
      <div className={`relative group ${wrapperClass}`}>
        <Tag
          id={id}
          className={`scroll-mt-20 ${sizeClass} font-bold text-gray-900 dark:text-white flex items-center justify-between`}
        >
          <span>{props.children}</span>
          {done && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-4 flex-shrink-0">
              {Tag === 'h1' ? (
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className={checkSize + ' text-green-600'} />
                </div>
              ) : (
                <CheckCircle className={checkSize + ' text-green-500'} />
              )}
            </motion.div>
          )}
        </Tag>
        {done && Tag !== 'h3' && (
          <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-green-500 rounded-full" />
        )}
      </div>
    )
  }
  Component.displayName = `Md${Tag.toUpperCase()}`
  return Component
}

export default function ModuleMarkdown({ content, completedSections }: ModuleMarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: makeHeading('h1', completedSections, 'text-4xl mb-4 pb-3 border-b-2 border-gray-200 dark:border-gray-700', 'mb-6'),
        h2: makeHeading('h2', completedSections, 'text-3xl mb-3', 'mb-4 mt-8'),
        h3: makeHeading('h3', completedSections, 'text-2xl mb-2', 'mb-3 mt-6'),
        p: (props) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
        ul: (props) => <ul className="mb-4 ml-6 space-y-2 list-disc text-gray-700 dark:text-gray-200" {...props} />,
        ol: (props) => <ol className="mb-4 ml-6 space-y-2 list-decimal text-gray-700 dark:text-gray-200" {...props} />,
        li: (props) => <li className="leading-relaxed" {...props} />,
        blockquote: (props) => (
          <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400" {...props} />
        ),
        code: ({ className, children, ...props }) => {
          const isBlock = /language-/.test(className ?? '')
          if (!isBlock) {
            return (
              <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-red-600" {...props}>
                {children}
              </code>
            )
          }
          return (
            <code className="block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono overflow-x-auto mb-4" {...props}>
              {children}
            </code>
          )
        },
        table: (props) => (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props} />
          </div>
        ),
        th: (props) => (
          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left" {...props} />
        ),
        td: (props) => (
          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

'use client'

import { useState } from 'react'
import {
  CheckCircle, ChevronDown, ChevronRight, Clock,
  ExternalLink, Info, ShieldCheck, Link as LinkIcon, Volume2,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeInlineStyles from '../../lib/rehype-inline-styles'
import { cn } from '../../lib/utils/cn'

interface ModuleSection {
  id: string
  title: string
  content: string
  subsections?: ModuleSection[]
  legalReferences?: string[]
  officialLinks?: { title: string; url: string }[]
  keyPoints?: string[]
}

interface ModuleContentSectionProps {
  section: ModuleSection
  level?: number
  completedSections: Set<string>
  onMarkComplete: (sectionId: string) => void
  onReadSection: (title: string, content: string) => void
  sectionIndex?: number
}

const PROSE_COLLAPSE_THRESHOLD = 800

function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / 200)
}

const mdComponents = {
  h1: ({ node, ...props }: Record<string, unknown>) => <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4" {...props} />,
  h2: ({ node, ...props }: Record<string, unknown>) => <h5 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3" {...props} />,
  h3: ({ node, ...props }: Record<string, unknown>) => <h6 className="text-base font-bold text-gray-900 dark:text-gray-100 mt-5 mb-2" {...props} />,
  h4: ({ node, ...props }: Record<string, unknown>) => <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2" {...props} />,
  h5: ({ node, ...props }: Record<string, unknown>) => <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-3 mb-2" {...props} />,
  h6: ({ node, ...props }: Record<string, unknown>) => <h6 className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-3 mb-2" {...props} />,
  p: ({ node, ...props }: Record<string, unknown>) => <p className="mb-5 text-gray-800 dark:text-gray-200 text-base leading-loose" {...props} />,
  ul: ({ node, ...props }: Record<string, unknown>) => <ul className="list-disc list-outside ml-6 space-y-2 mb-5 text-gray-800 dark:text-gray-200" {...props} />,
  ol: ({ node, ...props }: Record<string, unknown>) => <ol className="list-decimal list-outside ml-6 space-y-2 mb-5 text-gray-800 dark:text-gray-200" {...props} />,
  li: ({ node, ...props }: Record<string, unknown>) => <li className="pl-1 leading-relaxed text-gray-800 dark:text-gray-200" {...props} />,
  blockquote: ({ node, ...props }: Record<string, unknown>) => (
    <blockquote className="border-l-4 border-blue-600 dark:border-blue-400 pl-4 sm:pl-5 py-3 my-4 sm:my-6 bg-blue-50 dark:bg-blue-950/40 text-gray-800 dark:text-gray-200 rounded-r-lg" {...props} />
  ),
  table: ({ node, ...props }: Record<string, unknown>) => (
    <div className="overflow-x-auto my-4 sm:my-6 border-2 border-blue-600 dark:border-blue-500 rounded-lg">
      <table className="min-w-full divide-y divide-blue-200 dark:divide-blue-700" {...props} />
    </div>
  ),
  thead: ({ node, ...props }: Record<string, unknown>) => <thead className="bg-gradient-to-r from-blue-600 to-blue-700" {...props} />,
  th: ({ node, ...props }: Record<string, unknown>) => <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wide border-b-2 border-blue-800" {...props} />,
  td: ({ node, ...props }: Record<string, unknown>) => <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-800 dark:text-gray-200 border-b border-blue-200 dark:border-blue-800" {...props} />,
  a: ({ node, ...props }: Record<string, unknown>) => (
    <a className="text-blue-700 dark:text-blue-400 font-semibold underline hover:text-blue-900 dark:hover:text-blue-300 hover:no-underline transition-all" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  strong: ({ node, ...props }: Record<string, unknown>) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
}

export function ModuleContentSection({
  section,
  level = 0,
  completedSections,
  onMarkComplete,
  onReadSection,
  sectionIndex,
}: ModuleContentSectionProps) {
  const isLong = section.content.length > PROSE_COLLAPSE_THRESHOLD
  const [isProseExpanded, setIsProseExpanded] = useState(!isLong)
  const [isLegalOpen, setIsLegalOpen] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  const readingTime = getReadingTime(section.content)
  const isCompleted = completedSections.has(section.id)
  const hasKeyPoints = section.keyPoints && section.keyPoints.length > 0
  const hasLegal = section.legalReferences && section.legalReferences.length > 0
  const hasLinks = section.officialLinks && section.officialLinks.length > 0

  function handleMarkComplete() {
    onMarkComplete(section.id)
    setJustCompleted(true)
  }

  return (
    <section
      id={section.id}
      className={cn(
        'scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-28 mb-8 sm:mb-10 lg:mb-12',
        level > 0 && 'rounded-xl bg-gray-50/60 dark:bg-gray-800/30 border border-gray-200/60 dark:border-gray-700/40 p-4 sm:p-5',
      )}
    >
      {/* --- Section Header --- */}
      <div className={cn('mb-4 sm:mb-5 pb-3 sm:pb-4', level === 0 && 'border-b border-gray-200 dark:border-gray-700')}>
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {level > 0 && sectionIndex != null && (
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
                {sectionIndex + 1}
              </span>
            )}
            <h3 className={cn(
              level === 0 ? 'text-xl sm:text-2xl font-bold' : 'text-lg sm:text-xl font-semibold',
              'text-gray-900 dark:text-white',
            )}>
              {section.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {level === 0 && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                {readingTime} min
              </span>
            )}
            {level === 0 && (
              <button
                onClick={() => onReadSection(section.title, section.content)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors touch-manipulation"
                title="Read this chapter"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- Quick Summary (Key Points FIRST) --- */}
      {hasKeyPoints && (
        <div className="mb-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/70 dark:border-blue-800/50 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
              <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide">Quick Summary</h4>
          </div>
          <ul className="space-y-2.5">
            {section.keyPoints!.map((point, idx) => (
              <li key={idx} className="flex items-start text-sm leading-relaxed">
                <CheckCircle className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2.5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- Prose Content (collapsible for long sections) --- */}
      <div className="relative">
        <div
          className={cn(
            'enhanced-module-content prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 transition-[max-height] duration-500 ease-in-out overflow-hidden',
            !isProseExpanded && 'max-h-[220px]',
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeInlineStyles]}
            components={mdComponents}
          >
            {section.content}
          </ReactMarkdown>
        </div>
        {isLong && !isProseExpanded && (
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />
        )}
        {isLong && (
          <button
            onClick={() => setIsProseExpanded((p) => !p)}
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors mt-2',
              !isProseExpanded && 'relative z-10',
            )}
          >
            <ChevronDown className={cn('w-4 h-4 transition-transform duration-300', isProseExpanded && 'rotate-180')} />
            {isProseExpanded ? 'Collapse section' : 'Read full section'}
          </button>
        )}
      </div>

      {/* --- Official Sources --- */}
      {hasLinks && (
        <div className="mt-5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="flex items-center mb-3">
            <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mr-2.5">
              <LinkIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Official Sources</h4>
          </div>
          <div className="space-y-1.5">
            {section.officialLinks!.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline touch-manipulation py-1.5 px-2 -mx-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <ExternalLink className="w-3 h-3 mr-2 flex-shrink-0" />
                <span className="break-words">{link.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* --- Legal References (collapsed accordion) --- */}
      {hasLegal && (
        <div className="mt-3">
          <button
            onClick={() => setIsLegalOpen((o) => !o)}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors py-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="font-medium">Legal Basis</span>
            <ChevronRight className={cn('w-3.5 h-3.5 transition-transform duration-200', isLegalOpen && 'rotate-90')} />
          </button>
          <div className={cn(
            'grid transition-[grid-template-rows] duration-300 ease-in-out',
            isLegalOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}>
            <div className="overflow-hidden">
              <div className="flex flex-wrap gap-2 pt-2 pb-1">
                {section.legalReferences!.map((ref, idx) => (
                  <span key={idx} className="px-2.5 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 font-medium">
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Mark as Read --- */}
      {level === 0 && (
        <div className="mt-5 flex justify-end">
          {isCompleted || justCompleted ? (
            <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 font-medium animate-[sip-fade-scale_0.4s_ease-out]">
              <CheckCircle className="w-5 h-5" />
              <span>Section complete</span>
            </div>
          ) : (
            <button
              onClick={handleMarkComplete}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-150"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as read
            </button>
          )}
        </div>
      )}

      {/* --- Subsections --- */}
      {section.subsections && section.subsections.length > 0 && (
        <div className="mt-6 space-y-4">
          {section.subsections.map((subsection, idx) => (
            <ModuleContentSection
              key={subsection.id}
              section={subsection}
              level={level + 1}
              sectionIndex={idx}
              completedSections={completedSections}
              onMarkComplete={onMarkComplete}
              onReadSection={onReadSection}
            />
          ))}
        </div>
      )}
    </section>
  )
}

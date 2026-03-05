'use client'

import { useState, useEffect, useCallback, useRef, useMemo, use } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CheckCircle, Clock, Play, FileText, Download, Award, HelpCircle, BarChart3, Menu, X, Maximize2, Minimize2, Bookmark } from 'lucide-react'
import { getAllModulesForAdmin, getModulePack, type Module } from '@/lib/content/pack-content'
import { PRICING_PACKS, type PackId } from '@/lib/pricing'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import EnhancedModuleDisplay from '@/components/modules/EnhancedModuleDisplay'
import AdminHeader from '@/components/layout/AdminHeader'
import { loadEnhancedModule } from '@/lib/content/enhanced-module-loader'
import type { EnhancedModule } from '@/lib/content/enhanced-modules/non-free-enhanced-modules'
import { useToast } from '@/components/providers/ToastProvider'

export default function AdminModuleView({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const router = useRouter()
  const resolvedParams = use(params)
  const moduleId = resolvedParams.id
  const { showToast } = useToast()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [module, setModule] = useState<Module | null>(null)
  const [enhancedContent, setEnhancedContent] = useState<EnhancedModule | null>(null)
  const [packInfo, setPackInfo] = useState<(typeof PRICING_PACKS)[PackId] | null>(null)
  const [progress, setProgress] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [showTableOfContents, setShowTableOfContents] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const [categories, setCategories] = useState<Array<{ title: string; sections: Array<{ id: string; title: string; level: number }> }>>([])
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const sidebarRef = useRef<HTMLDivElement>(null)
  const activeSectionRef = useRef<string>('')
  const contentRef = useRef<HTMLDivElement>(null)
  const visibleSectionsRef = useRef<Set<string>>(new Set())
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Define helper functions using useCallback to ensure they're available
  const extractSectionsLocal = useCallback((content: string): Array<{ id: string; title: string; level: number }> => {
    const lines = content.split('\n')
    const sections: Array<{ id: string; title: string; level: number }> = []
    
    // Helper function to strip HTML tags from text
    const stripHtml = (html: string): string => {
      return html.replace(/<[^>]*>/g, '').trim()
    }
    
    lines.forEach((line) => {
      if (line.startsWith('#')) {
        const level = (line.match(/^#+/)?.[0] || '').length
        const title = line.replace(/^#+\s*/, '').trim()
        // Strip HTML tags from title for display
        const cleanTitle = stripHtml(title)
        const id = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        sections.push({ id, title: cleanTitle, level })
      }
    })
    
    return sections
  }, [])

  const organizeSectionsIntoCategoriesLocal = useCallback((sections: Array<{ id: string; title: string; level: number }>): Array<{ title: string; sections: Array<{ id: string; title: string; level: number }> }> => {
    const categories: Array<{ title: string; sections: Array<{ id: string; title: string; level: number }> }> = []
    let currentCategory: { title: string; sections: Array<{ id: string; title: string; level: number }> } | null = null

    sections.forEach((section) => {
      if (section.level === 1) {
        if (currentCategory) {
          categories.push(currentCategory)
        }
        currentCategory = {
          title: section.title,
          sections: []
        }
      } else {
        if (!currentCategory) {
          currentCategory = {
            title: 'Introduction',
            sections: []
          }
        }
        currentCategory.sections.push(section)
      }
    })

    if (currentCategory) {
      categories.push(currentCategory)
    }

    if (categories.length === 0) {
      categories.push({
        title: 'Module Content',
        sections
      })
    }

    return categories
  }, [])

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated' || !session) {
      router.push('/auth/login')
      return
    }

    if (!session.user.isAdmin) {
      router.push('/dashboard')
      return
    }

    if (!moduleId) return

    const modules = getAllModulesForAdmin()
    const matched = modules.find((mod) => mod.id === moduleId)

    if (matched) {
      setModule(matched)
      const packId = getModulePack(matched.id)
      setPackInfo(PRICING_PACKS[packId as keyof typeof PRICING_PACKS] || null)

      if (matched.content) {
        const sections = extractSectionsLocal(matched.content)
        const organized = organizeSectionsIntoCategoriesLocal(sections)
        setCategories(organized)
        const firstSectionId = sections[0]?.id || ''
        activeSectionRef.current = firstSectionId
        setActiveSection(firstSectionId)
        // Show first section immediately
        visibleSectionsRef.current = new Set([firstSectionId])
        setVisibleSections(new Set([firstSectionId]))
      }
    }

    setLoading(false)
  }, [session, status, router, moduleId, extractSectionsLocal, organizeSectionsIntoCategoriesLocal])

  // ── Lazy-load enhanced module content ──────────────────────────
  useEffect(() => {
    if (!module) return
    let cancelled = false
    loadEnhancedModule(module.id).then((content) => {
      if (!cancelled) setEnhancedContent(content)
    })
    return () => { cancelled = true }
  }, [module])

  // Compute sections early (before early returns) to avoid hook order issues
  // Use useMemo to ensure stable reference - use module?.id to avoid reference issues
  const sections = useMemo(() => {
    if (!module?.content) return []
    return extractSectionsLocal(module.content)
  }, [module?.id, module?.content, extractSectionsLocal])

  // Track scroll position and update active section
  useEffect(() => {
    if (!module?.content || sections.length === 0) return

    const handleScroll = () => {
      // Clear any pending timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Throttle state updates to prevent infinite loops
      scrollTimeoutRef.current = setTimeout(() => {
        // Use contentRef if available, otherwise query
        const mainContent = contentRef.current || document.querySelector('.flex-1.overflow-y-auto') as HTMLElement
        const scrollPosition = mainContent 
          ? mainContent.scrollTop + 150 
          : window.scrollY + 150 // Offset for header
        
        // Find which section is currently in view
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i]
          const element = document.getElementById(section.id)
          if (element) {
            const elementTop = mainContent 
              ? element.offsetTop - mainContent.offsetTop
              : element.offsetTop
            
            if (scrollPosition >= elementTop) {
              // Only update state if the active section actually changed
              if (activeSectionRef.current !== section.id) {
                activeSectionRef.current = section.id
                setActiveSection(section.id)
              }
              
              // Track visible sections in ref first, then update state only if needed
              const needsUpdate = !visibleSectionsRef.current.has(section.id)
              if (needsUpdate) {
                visibleSectionsRef.current.add(section.id)
                // Also add next section if it exists
                const currentIndex = sections.findIndex(s => s.id === section.id)
                if (currentIndex < sections.length - 1) {
                  visibleSectionsRef.current.add(sections[currentIndex + 1].id)
                }
                // Update state with a new Set to trigger re-render
                setVisibleSections(new Set(visibleSectionsRef.current))
              }
              
              // Calculate progress based on scroll position
              if (mainContent) {
                const scrollTop = mainContent.scrollTop
                const scrollHeight = mainContent.scrollHeight
                const clientHeight = mainContent.clientHeight
                const scrollableHeight = scrollHeight - clientHeight
                if (scrollableHeight > 0) {
                  const progressPercent = Math.round((scrollTop / scrollableHeight) * 100)
                  setProgress(progressPercent)
                }
              }
              
              break
            }
          }
        }
      }, 100) // Throttle to 100ms
    }

    // Listen to both window and content container scroll
    const mainContent = contentRef.current || document.querySelector('.flex-1.overflow-y-auto') as HTMLElement
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll, { passive: true })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      if (mainContent) {
        mainContent.removeEventListener('scroll', handleScroll)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [module?.id, sections.length, showTableOfContents])

  const handleQuizSubmit = () => {
    const questions = module?.quiz?.questions
    if (!questions?.length) return
    const correct = questions.reduce((count, q, idx) => {
      return quizAnswers[idx] === q.options[q.correct] ? count + 1 : count
    }, 0)
    setQuizScore(Math.round((correct / questions.length) * 100))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    )
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Module Not Found
          </h1>
          <Link href="/admin" className="text-purple-600 hover:text-purple-700">
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Check if enhanced content has been lazily loaded
  if (enhancedContent) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <AdminHeader />
        <div className="py-4 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="mb-4 sm:mb-6">
              <Link
                href="/admin"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin Dashboard
              </Link>
            </div>

            {/* Enhanced Module Display */}
            <EnhancedModuleDisplay module={enhancedContent} moduleId={moduleId} />
          </div>
        </div>
      </div>
    )
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(sectionId)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex">
            {/* Left Sidebar - Table of Contents - Sticky */}
            {showTableOfContents && (
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen fixed left-0 top-0 flex-shrink-0 z-[9999]"
                style={{ 
                  maxHeight: '100vh'
                }}
              >
          {/* Sidebar Header - Fixed */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/admin"
                className="flex items-center text-purple-600 hover:text-purple-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Back to Admin</span>
              </Link>
              <button
                onClick={() => setShowTableOfContents(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Collapse sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                {packInfo?.name || 'Module'}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                {module.type}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {module.title}
            </h2>
            {module.duration && (
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mt-2">
                <Clock className="w-4 h-4" />
                <span>{module.duration}</span>
              </div>
            )}
          </div>

          {/* Table of Contents - Organized by Categories */}
          <div 
            ref={sidebarRef}
            className="flex-1 p-4 min-h-0 hide-scrollbar" 
            style={{ 
              overflowY: 'auto', 
              overflowX: 'hidden', 
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth'
            }}
          >
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 uppercase tracking-wide">
              Table of Contents
            </h3>
            <nav className="space-y-4">
              {categories.map((category, catIdx) => (
                <div key={catIdx} className="space-y-2">
                  {/* Category Header */}
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                      {category.title}
                    </h4>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  
                  {/* Category Sections */}
                  {category.sections.map((section, idx) => {
                    const isVisible = visibleSections.has(section.id)
                    
                    return (
                      <motion.button
                        key={`${catIdx}-${idx}`}
                        data-section-id={section.id}
                        onClick={() => {
                          scrollToSection(section.id)
                          setVisibleSections(prev => {
                            const newSet = new Set(prev)
                            newSet.add(section.id)
                            return newSet
                          })
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0 
                        }}
                        transition={{ duration: 0.3 }}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 mb-2 ${
                          activeSection === section.id
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md'
                        }`}
                        style={{ paddingLeft: `${(section.level - 1) * 12 + 16}px` }}
                      >
                        <div className="flex items-start">
                          <span className="flex-1 leading-relaxed">{section.title}</span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Bookmark className="w-4 h-4" />
                  <span>Bookmark</span>
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-purple-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Left Tab Button - Always visible and sticky */}
      <button
        onClick={() => setShowTableOfContents(!showTableOfContents)}
        className="fixed left-0 top-24 z-[10000] bg-purple-600 hover:bg-purple-700 text-white px-2 py-3 rounded-r-lg shadow-lg transition-colors"
        title={showTableOfContents ? "Close sidebar" : "Open sidebar"}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Content Area */}
      <div className={`flex-1 min-h-screen ${showTableOfContents ? 'ml-80' : ''}`}>
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {module.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {module.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Chat button removed */}
          </div>
        </div>

        {/* Content Layout */}
        <div className="w-full">
          {/* Main Content */}
          <div className="overflow-y-auto" ref={contentRef} style={{ paddingBottom: '140px' }}>
            <div className="mx-auto px-6 py-8 max-w-[95%] lg:max-w-[98%]">
              {/* Module Content */}
              {module.content && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-sm lg:prose-base max-w-none mb-8 dark:prose-invert"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="scroll-mt-20 font-bold" style={{ fontSize: showTableOfContents ? '2rem' : '1.75rem' }} {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="scroll-mt-20 font-bold" style={{ fontSize: showTableOfContents ? '1.5rem' : '1.25rem' }} {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="scroll-mt-20 font-semibold" style={{ fontSize: showTableOfContents ? '1.25rem' : '1.125rem' }} {...props} />
                      ),
                      h4: ({ node, ...props }) => (
                        <h4 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="scroll-mt-20 font-semibold mt-6 mb-3" style={{ fontSize: showTableOfContents ? '1.125rem' : '1rem' }} {...props} />
                      ),
                      h5: ({ node, ...props }) => (
                        <h5 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="scroll-mt-20 font-medium mt-4 mb-2" style={{ fontSize: showTableOfContents ? '1rem' : '0.875rem' }} {...props} />
                      ),
                      h6: ({ node, ...props }) => (
                        <h6 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="scroll-mt-20 font-medium mt-4 mb-2" style={{ fontSize: showTableOfContents ? '0.875rem' : '0.75rem' }} {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-4 leading-relaxed" style={{ fontSize: showTableOfContents ? '1rem' : '0.875rem' }} {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="mb-4 ml-6 list-disc space-y-2" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="mb-4 ml-6 list-decimal space-y-2" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="leading-relaxed" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold" {...props} />
                      ),
                      em: ({ node, ...props }) => (
                        <em className="italic" {...props} />
                      ),
                      span: ({ node, className, ...props }) => {
                        const isNotranslate = className?.includes('notranslate')
                        return (
                          <span
                            className={className || ''}
                            translate={isNotranslate ? 'no' : undefined}
                            {...props}
                          />
                        )
                      },
                      code: ({ node, className, children, ...props }) => {
                        const isBlock = typeof className === 'string' && /language-/.test(className)
                        if (!isBlock) {
                          return <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>
                        }
                        return <code className="bg-gray-100 dark:bg-gray-700 block p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4" {...props}>{children}</code>
                      },
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4" {...props} />
                      ),
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-6">
                          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props} />
                        </div>
                      ),
                      th: ({ node, ...props }) => (
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-700 font-semibold text-left" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props} />
                      ),
                    }}
                  >
                    {module.content}
                  </ReactMarkdown>
                </motion.div>
              )}

              {/* Interactive Quiz */}
              {module.quiz && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-8 mb-8 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <HelpCircle className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Interactive Quiz
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {module.quiz.questions?.map((q, idx: number) => (
                      <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <span className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                            {idx + 1}
                          </span>
                          {q.question}
                        </h3>
                        <div className="space-y-2 ml-11">
                          {q.options?.map((opt: string, optIdx: number) => (
                            <label
                              key={optIdx}
                              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${
                                quizAnswers[idx] === opt
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${idx}`}
                                value={opt}
                                checked={quizAnswers[idx] === opt}
                                onChange={(e) => setQuizAnswers({ ...quizAnswers, [idx]: e.target.value })}
                                className="w-4 h-4 text-purple-600"
                              />
                              <span className="text-gray-700 dark:text-gray-200">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length !== module.quiz.questions.length}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Quiz
                    </button>
                    {quizScore !== null && (
                      <div className="text-center p-6 bg-gradient-to-r from-green-50 to-purple-50 dark:from-green-900/30 dark:to-purple-900/30 rounded-lg border border-green-200 dark:border-gray-700">
                        <Award className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {quizScore}%
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {quizScore >= 80
                            ? 'Excellent work! 🎉 You mastered this module!'
                            : quizScore >= 60
                            ? 'Good job! 👍 Keep practicing!'
                            : 'Keep learning! 💪 Review the content and try again!'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Practice Exercises */}
              {module.exercises && module.exercises.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Practice Exercises
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {module.exercises.map((exercise, idx: number) => (
                      <div
                        key={idx}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-purple-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 text-green-700 rounded-lg flex items-center justify-center text-sm font-bold">
                              {idx + 1}
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {exercise.title}
                            </h3>
                          </div>
                          <CheckCircle className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {exercise.description}
                        </p>
                        <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                          Start Exercise
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Attachments */}
              {module.attachments && module.attachments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <Download className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Downloads
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {module.attachments.map((attachment: string, idx: number) => (
                      <a
                        key={idx}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                          <span className="text-gray-700 dark:text-gray-200 font-medium">
                            {attachment.split('/').pop() || `Attachment ${idx + 1}`}
                          </span>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Completion Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => {
                    setProgress(100)
                    showToast('Module completed! 🎉', 'success')
                  }}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Mark as Complete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - AI Chat removed */}
        </div>
      </div>

          {/* Mobile TOC Toggle */}
          {!showTableOfContents && (
            <button
              onClick={() => setShowTableOfContents(true)}
              className="fixed bottom-24 left-6 lg:hidden bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
      </div>
    )
}


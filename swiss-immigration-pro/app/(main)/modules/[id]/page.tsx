'use client'

import { useState, useEffect, useRef, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft, BookOpen, CheckCircle, Clock, Play, FileText, Download,
  Award, HelpCircle, BarChart3, Menu, X, ChevronRight,
  Bookmark, Share2, Maximize2, Minimize2, Book, Video, CheckSquare,
  Sparkles, Layers
} from 'lucide-react'
import { getAllModules, getAllModulesForAdmin, getModulePack, type Module } from '@/lib/content/pack-content'
import { PRICING_PACKS } from '@/lib/pricing'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import EnhancedModuleDisplay from '@/components/modules/EnhancedModuleDisplay'
import AITutorBot from '@/components/modules/AITutorBot'
import { useToast } from '@/components/providers/ToastProvider'

export default function ModuleView({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { showToast } = useToast()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [module, setModule] = useState<any>(null)
  const [packInfo, setPackInfo] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [showTableOfContents, setShowTableOfContents] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const contentRef = useRef<HTMLDivElement>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({})
  const [sectionReadTime, setSectionReadTime] = useState<Record<string, number>>({})
  const sectionTimers = useRef<Record<string, NodeJS.Timeout>>({})
  const [categories, setCategories] = useState<Array<{ title: string; sections: Array<{ id: string; title: string; level: number }> }>>([])
  const [isLocked, setIsLocked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [expandedExercises, setExpandedExercises] = useState<Record<number, boolean>>({})

  // Helper functions - defined before useEffect to avoid hoisting issues
  const extractSections = (content: string) => {
    const lines = content.split('\n')
    const sections: Array<{ id: string; title: string; level: number }> = []

    lines.forEach((line) => {
      if (line.startsWith('#')) {
        const level = (line.match(/^#+/)?.[0] || '').length
        const title = line.replace(/^#+\s*/, '').trim()
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        sections.push({ id, title, level })
      }
    })

    return sections
  }

  const organizeSectionsIntoCategories = (sections: Array<{ id: string; title: string; level: number }>) => {
    const categories: Array<{ title: string; sections: Array<{ id: string; title: string; level: number }> }> = []
    let currentCategory: { title: string; sections: Array<{ id: string; title: string; level: number }> } | null = null

    sections.forEach((section) => {
      // H1 sections are category headers
      if (section.level === 1) {
        // Save previous category if exists
        if (currentCategory) {
          categories.push(currentCategory)
        }
        // Start new category
        currentCategory = {
          title: section.title,
          sections: []
        }
      } else {
        // Add to current category or create default
        if (!currentCategory) {
          currentCategory = {
            title: 'Introduction',
            sections: []
          }
        }
        currentCategory.sections.push(section)
      }
    })

    // Add last category
    if (currentCategory) {
      categories.push(currentCategory)
    }

    // If no categories found, create one default
    if (categories.length === 0) {
      categories.push({
        title: 'Module Content',
        sections
      })
    }

    return categories
  }

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated' || !session) {
      router.push('/auth/login')
      return
    }

    const adminStatus = session?.user?.isAdmin || false
    setIsAdmin(adminStatus)
    const userPackId = session?.user?.packId || 'free'

    const moduleId = resolvedParams.id
    let foundModule: Module | null = null
    let foundPack: any = null
    let locked = false

    if (adminStatus) {
      const allModules = getAllModulesForAdmin()
      const matched = allModules.find((mod) => mod.id === moduleId)
      if (matched) {
        foundModule = matched
        const packId = getModulePack(matched.id)
        foundPack = PRICING_PACKS[packId as keyof typeof PRICING_PACKS] || null
      }
    } else {
      const modules = getAllModules(userPackId)
      const matched = modules.find((mod) => mod.id === moduleId)
      if (matched) {
        foundModule = matched
        foundPack = PRICING_PACKS[userPackId as keyof typeof PRICING_PACKS] || null
      } else {
        const allModules = getAllModulesForAdmin()
        const fallback = allModules.find((mod) => mod.id === moduleId)
        if (fallback) {
          foundModule = fallback
          const packId = getModulePack(fallback.id)
          foundPack = PRICING_PACKS[packId as keyof typeof PRICING_PACKS] || null
          locked = true
        }
      }
    }

    if (!foundModule) {
      router.push('/dashboard')
      return
    }

    setIsLocked(locked)
    setModule(foundModule)
    setPackInfo(foundPack)
    
    // Extract sections from markdown for table of contents
    if (foundModule.content) {
      const sections = extractSections(foundModule.content)
      setActiveSection(sections[0]?.id || '')
      
      // Organize sections into categories
      const organized = organizeSectionsIntoCategories(sections)
      setCategories(organized)
      
      if (!locked) {
        loadProgress(foundModule.id)
      }
    }

    setLoading(false)
  }, [session, status, router, resolvedParams])

  const loadProgress = async (moduleId: string) => {
    if (isLocked) return
    try {
      const res = await fetch(`/api/modules/progress?moduleId=${moduleId}`)
      if (res.ok) {
        const data = await res.json()
        setProgress(data.progress || 0)
        setCompletedSections(data.sections || {})
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  const updateSectionProgress = useCallback(async (sectionId: string, completed: boolean) => {
    if (!module || isLocked) return
    
    setCompletedSections(prev => {
      const updated = { ...prev, [sectionId]: completed }
      
      // Recalculate overall progress
      const allSections = extractSections(module.content || '')
      const total = allSections.length
      const completedCount = Object.values(updated).filter(Boolean).length
      const newProgress = total > 0 ? Math.round((completedCount / total) * 100) : 0
      setProgress(newProgress)
      
      return updated
    })
    
    try {
      await fetch('/api/modules/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: module.id,
          sectionId,
          completed
        })
      })
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }, [module, isLocked])


  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(sectionId)
    }
  }

  // Track scroll position and mark sections as read
  useEffect(() => {
    if (!contentRef.current || !module) return

    const handleScroll = () => {
      const sections = extractSections(module.content || '')
      const viewportHeight = window.innerHeight

      sections.forEach((section) => {
        const element = document.getElementById(section.id)
        if (!element) return

        const rect = element.getBoundingClientRect()

        // Update active section based on scroll (section is near top of viewport)
        if (rect.top <= 150 && rect.bottom >= 100) {
          setActiveSection(section.id)
        }
      })
    }

    // Use Intersection Observer for better performance
    const observerOptions = {
      root: null,
      rootMargin: '-200px 0px -200px 0px',
      threshold: 0.3
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id
        if (entry.isIntersecting && !completedSections[sectionId]) {
          if (!sectionTimers.current[sectionId]) {
            sectionTimers.current[sectionId] = setTimeout(() => {
              updateSectionProgress(sectionId, true)
              delete sectionTimers.current[sectionId]
            }, 3000) // 3 seconds minimum reading time
          }
        } else if (!entry.isIntersecting && sectionTimers.current[sectionId]) {
          // Clear timer if section is no longer in view
          clearTimeout(sectionTimers.current[sectionId])
          delete sectionTimers.current[sectionId]
        }
      })
    }, observerOptions)

    // Observe all section elements
    const sections = extractSections(module.content || '')
    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        observer.observe(element)
      }
    })

    // Also listen to scroll for active section tracking
    const contentElement = contentRef.current
    contentElement.addEventListener('scroll', handleScroll)
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => {
      contentElement.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
      // Clear all timers
      Object.values(sectionTimers.current).forEach(timer => clearTimeout(timer))
    }
  }, [module, completedSections, updateSectionProgress])

  const handleQuizSubmit = () => {
    if (!module.quiz) return
    
    const totalQuestions = module.quiz.questions.length
    let correct = 0
    
    module.quiz.questions.forEach((q: any, idx: number) => {
      if (quizAnswers[idx] === q.options[q.correct]) {
        correct++
      }
    })
    
    const score = Math.round((correct / totalQuestions) * 100)
    setQuizScore(score)
    setQuizSubmitted(true)
    
    // Update progress
    if (score >= 80) {
      setProgress(100)
    } else if (score >= 60) {
      setProgress(75)
    } else {
      setProgress(50)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Module Not Found
          </h1>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Check if this is an enhanced module with interactive components
  if (module.enhancedModule && !isLocked) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href={isAdmin ? "/admin" : "/dashboard"}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {isAdmin ? "Admin" : "Dashboard"}
            </Link>
          </div>
          
          {/* Enhanced Module Display */}
          <EnhancedModuleDisplay
            module={module.enhancedModule}
            moduleId={resolvedParams.id}
            quiz={module.quiz}
          />
        </div>
      </div>
    )
  }

  if (isLocked) {
    const owningPackId = getModulePack(module.id)
    const owningPack = PRICING_PACKS[owningPackId as keyof typeof PRICING_PACKS]

    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-3">
                  Locked Premium Module
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {module.title}
                </h1>
                <p className="text-gray-600">
                  This expert module lives inside the {owningPack?.name || 'premium'} plan. Upgrade to unlock the full legal strategy, checklists, and interactive tools.
                </p>
              </div>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-blue-900 transition-all"
              >
                View Upgrade Options →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What you'll unlock
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Full legal references and SEM-backed playbook</li>
                  <li>• Downloadable templates, checklists, and calculators</li>
                  <li>• Interactive progress tracking and milestone reminders</li>
                </ul>
              </div>
              <div className="p-5 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Module snapshot
                </h3>
                <p className="text-sm text-gray-600">
                  {module.description}
                </p>
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                  Part of {owningPack?.name || 'Premium Pack'}
                </div>
              </div>
            </div>
            <div className="mt-8 text-center text-gray-500 text-sm">
              Already upgraded? Make sure you’re logged in with the right account.
            </div>
          </div>
        </div>
      </div>
    )
  }

  const sections = module.content ? extractSections(module.content) : []

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-4">
              <Link 
                href={isAdmin ? "/admin" : "/dashboard"}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
                {module.description && (
                  <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Desktop */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Table of Contents</h3>
                </div>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      style={{ paddingLeft: `${(section.level - 1) * 12 + 12}px` }}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile TOC Toggle */}
            <button
              onClick={() => setShowTableOfContents(!showTableOfContents)}
              className="lg:hidden mb-6 w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Table of Contents</span>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform ${showTableOfContents ? 'rotate-90' : ''}`} />
            </button>

            {/* Mobile TOC */}
            <AnimatePresence>
              {showTableOfContents && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden mb-6 overflow-hidden"
                >
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <nav className="space-y-2">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                            activeSection === section.id
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 font-medium border border-blue-200 dark:border-gray-600'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                          }`}
                          style={{ paddingLeft: `${(section.level - 1) * 12 + 12}px` }}
                        >
                          {section.title}
                        </button>
                      ))}
                    </nav>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content Area */}
            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-200 prose-p:leading-relaxed prose-ul:text-gray-700 dark:prose-ul:text-gray-200 prose-li:text-gray-700 dark:prose-li:text-gray-200 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-white" ref={contentRef}>
              {/* Module Header with Categories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <Layers className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        {categories.length} Categories
                      </span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                      {module.title}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                      {module.description}
                    </p>
                  </div>
                  <div className="ml-6 flex flex-col items-end space-y-2">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {progress}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Complete</div>
                    </div>
                    {progress === 100 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
                      >
                        <Award className="w-6 h-6 text-green-600" />
                      </motion.div>
                    )}
                  </div>
                </div>
                
                {/* Category Pills */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {categories.map((category, idx) => {
                      const categorySections = category.sections
                      const completedCount = categorySections.filter(s => completedSections[s.id]).length
                      const totalCount = categorySections.length
                      const categoryProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
                      
                      return (
                        <div
                          key={idx}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            categoryProgress === 100
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700'
                              : categoryProgress > 0
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span>{category.title}</span>
                            {categoryProgress === 100 && (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            <span className="text-xs opacity-75">
                              ({completedCount}/{totalCount})
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>

              {/* Video Placeholder */}
              {module.type === 'video' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Play className="w-20 h-20 text-blue-600 mb-4" />
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Video Content Coming Soon
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        This module includes video explanations
                      </p>
                    </div>
                  </div>
                  {module.content && (
                    <div className="mt-6 prose prose-lg max-w-none">
                      <h3 className="text-xl font-bold mb-4">Video Transcript</h3>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {module.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Interactive Checklist Section */}
              {module.content && module.content.includes('## Interactive Checklist') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <CheckSquare className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Interactive Checklist
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Track your progress as you work through this module
                  </p>
                  <div className="space-y-3">
                    {module.content.split('\n').filter((line: string) => line.trim().startsWith('- [ ]')).slice(0, 10).map((line: string, idx: number) => {
                      const item = line.replace('- [ ]', '').trim()
                      return (
                        <label key={idx} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                          <span className="text-gray-700 dark:text-gray-200">{item}</span>
                        </label>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Module Content */}
              {module.content && (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                      h1: ({ node, ...props }) => {
                        const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
                        const isCompleted = completedSections[id]
                        return (
                          <div className="relative group mb-6">
                            <h1 
                              id={id} 
                              className="scroll-mt-20 text-4xl font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b-2 border-gray-200 dark:border-gray-700 flex items-center justify-between"
                            >
                              <span {...props} />
                              {isCompleted && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-4 flex-shrink-0"
                                >
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  </div>
                                </motion.div>
                              )}
                            </h1>
                            {isCompleted && (
                              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                        )
                      },
                      h2: ({ node, ...props }) => {
                        const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
                        const isCompleted = completedSections[id]
                        return (
                          <div className="relative group mb-4 mt-8">
                            <h2 
                              id={id} 
                              className="scroll-mt-20 text-3xl font-bold text-gray-900 mb-3 flex items-center justify-between"
                            >
                              <span {...props} />
                              {isCompleted && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-4 flex-shrink-0"
                                >
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                </motion.div>
                              )}
                            </h2>
                            {isCompleted && (
                              <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                        )
                      },
                      h3: ({ node, ...props }) => {
                        const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
                        const isCompleted = completedSections[id]
                        return (
                          <div className="relative group mb-3 mt-6">
                            <h3 
                              id={id} 
                              className="scroll-mt-20 text-2xl font-semibold text-gray-900 mb-2 flex items-center justify-between"
                            >
                              <span {...props} />
                              {isCompleted && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-3 flex-shrink-0"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                </motion.div>
                              )}
                            </h3>
                          </div>
                        )
                      },
                      p: ({ node, ...props }) => (
                        <p className="mb-4 text-gray-700 leading-relaxed" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="mb-4 ml-6 space-y-2 list-disc text-gray-700 dark:text-gray-200" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="mb-4 ml-6 space-y-2 list-decimal text-gray-700 dark:text-gray-200" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="leading-relaxed" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400" {...props} />
                      ),
                      code: ({ node, inline, ...props }: any) => {
                        if (inline) {
                          return (
                            <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-red-600" {...props} />
                          )
                        }
                        return (
                          <code className="block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono overflow-x-auto mb-4" {...props} />
                        )
                      },
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-6">
                          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props} />
                        </div>
                      ),
                      th: ({ node, ...props }) => (
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props} />
                      ),
                    }}
                  >
                    {module.content}
                  </ReactMarkdown>
              )}

              {/* Interactive Quiz */}
              {module.quiz && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Knowledge Check
                      </h2>
                    </div>
                    {quizSubmitted && (
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        (quizScore || 0) >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        (quizScore || 0) >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {quizScore}% correct
                      </span>
                    )}
                  </div>
                  <div className="space-y-6">
                    {module.quiz.questions.map((q: any, idx: number) => {
                      const userAnswer = quizAnswers[idx]
                      const correctAnswer = q.options[q.correct]
                      const isCorrect = userAnswer === correctAnswer
                      const showFeedback = quizSubmitted && userAnswer !== undefined

                      return (
                        <div key={idx} className={`border rounded-lg p-6 transition-all ${
                          showFeedback
                            ? isCorrect
                              ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                              : 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                              showFeedback
                                ? isCorrect
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            }`}>
                              {showFeedback ? (isCorrect ? '✓' : '✗') : idx + 1}
                            </span>
                            {q.question}
                          </h3>
                          <div className="space-y-2 ml-11">
                            {q.options.map((opt: string, optIdx: number) => {
                              const isThisCorrect = optIdx === q.correct
                              const isThisSelected = userAnswer === opt

                              let optionStyle = 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                              if (quizSubmitted) {
                                if (isThisCorrect) {
                                  optionStyle = 'border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/30'
                                } else if (isThisSelected && !isThisCorrect) {
                                  optionStyle = 'border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/30'
                                } else {
                                  optionStyle = 'border-gray-200 dark:border-gray-600 opacity-60'
                                }
                              } else if (isThisSelected) {
                                optionStyle = 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30'
                              }

                              return (
                                <label
                                  key={optIdx}
                                  className={`flex items-center space-x-3 p-3 border rounded-lg transition-all ${
                                    quizSubmitted ? 'cursor-default' : 'cursor-pointer'
                                  } ${optionStyle}`}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${idx}`}
                                    value={opt}
                                    checked={isThisSelected}
                                    onChange={(e) => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [idx]: e.target.value })}
                                    disabled={quizSubmitted}
                                    className="w-4 h-4 text-blue-600"
                                  />
                                  <span className={`flex-1 ${
                                    quizSubmitted && isThisCorrect
                                      ? 'text-green-700 dark:text-green-300 font-medium'
                                      : quizSubmitted && isThisSelected && !isThisCorrect
                                      ? 'text-red-700 dark:text-red-300 line-through'
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}>{opt}</span>
                                  {quizSubmitted && isThisCorrect && (
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                  )}
                                </label>
                              )
                            })}
                          </div>
                          {showFeedback && !isCorrect && (
                            <div className="mt-3 ml-11 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                              <span className="font-medium text-green-700 dark:text-green-400">Correct answer:</span> {correctAnswer}
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {!quizSubmitted ? (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length !== module.quiz.questions.length}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Check Answers ({Object.keys(quizAnswers).length}/{module.quiz.questions.length} answered)
                      </button>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className={`flex-1 text-center p-4 rounded-lg border ${
                          (quizScore || 0) >= 80
                            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                            : (quizScore || 0) >= 60
                            ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700'
                            : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                        }`}>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {quizScore}%
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {(quizScore || 0) >= 80
                              ? 'Excellent! You\'ve mastered this material.'
                              : (quizScore || 0) >= 60
                              ? 'Good effort! Review the highlighted questions.'
                              : 'Review the content above and try again.'}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setQuizAnswers({})
                            setQuizScore(null)
                            setQuizSubmitted(false)
                          }}
                          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-all"
                        >
                          Try Again
                        </button>
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
                  <div className="flex items-center space-x-3 mb-2">
                    <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Practice Exercises
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 ml-9">Apply what you learned. Click each exercise to see the instructions.</p>
                  <div className="space-y-4">
                    {module.exercises.map((exercise: any, idx: number) => {
                      const isExpanded = expandedExercises[idx] || false
                      return (
                        <div
                          key={idx}
                          className={`border rounded-lg transition-all ${
                            isExpanded
                              ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedExercises(prev => ({ ...prev, [idx]: !prev[idx] }))}
                            className="w-full p-5 flex items-start justify-between text-left"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {idx + 1}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {exercise.title}
                                </h3>
                                {!isExpanded && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{exercise.description}</p>
                                )}
                              </div>
                            </div>
                            <ChevronRight className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </button>
                          {isExpanded && (
                            <div className="px-5 pb-5 pt-0">
                              <div className="ml-11 p-4 bg-white dark:bg-gray-700/50 rounded-lg border border-green-200 dark:border-green-800">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {exercise.description}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Attachments */}
              {module.attachments && module.attachments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <Download className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
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
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                          <span className="text-gray-700 font-medium">
                            {attachment.split('/').pop() || `Attachment ${idx + 1}`}
                          </span>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
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
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Mark as Complete</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}


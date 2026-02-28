'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen, Clock, Award, Maximize2, Minimize2, Sparkles
} from 'lucide-react'
import AITutorBot from './AITutorBot'
import { ModuleSidebar } from './ModuleSidebar'
import { ModuleQuiz } from './ModuleQuiz'
import { ModuleTTS, type ModuleTTSHandle } from './ModuleTTS'
import { ModuleContentSection } from './ModuleContentSection'
import { enhancedModuleStyles } from './moduleStyles'

interface ModuleSection {
  id: string
  title: string
  content: string
  subsections?: ModuleSection[]
  legalReferences?: string[]
  officialLinks?: { title: string; url: string }[]
  keyPoints?: string[]
}

interface EnhancedModule {
  title: string
  description: string
  sections: ModuleSection[]
  estimatedReadTime?: string
  lastUpdated?: string
}

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
}

interface EnhancedModuleDisplayProps {
  module: EnhancedModule
  moduleId: string
  quiz?: { questions: QuizQuestion[] }
}

export default function EnhancedModuleDisplay({ module, moduleId, quiz }: EnhancedModuleDisplayProps) {
  if (!module || !module.title || !module.sections || !Array.isArray(module.sections)) {
    console.error('Invalid module structure:', module)
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 p-8">
        <div className="max-w-2xl mx-auto pt-24 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Module Not Available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This module content could not be loaded. Please try refreshing the page or contact support if the issue persists.
          </p>
          <a href="/dashboard" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Back to Dashboard
          </a>
        </div>
      </div>
    )
  }

  const [activeSection, setActiveSection] = useState<string>(module.sections[0]?.id || '')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [focusMode, setFocusMode] = useState(false)
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())
  const sectionTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const ttsRef = useRef<ModuleTTSHandle>(null)

  // Load saved progress on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sip_token') : null
    if (!token || !moduleId) return
    fetch(`/api/modules/progress?moduleId=${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.sections?.length) {
          setCompletedSections(new Set(data.sections))
        }
      })
      .catch(() => {})
  }, [moduleId])

  const markSectionComplete = useCallback((sectionId: string) => {
    setCompletedSections(prev => {
      if (prev.has(sectionId)) return prev
      const next = new Set(prev)
      next.add(sectionId)
      const token = typeof window !== 'undefined' ? localStorage.getItem('sip_token') : null
      if (token && moduleId) {
        fetch('/api/modules/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ moduleId, sectionId, completed: false }),
        }).catch(() => {})
      }
      return next
    })
  }, [moduleId])

  // Intersection Observer to update active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )

    module.sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
      section.subsections?.forEach(sub => {
         const subEl = document.getElementById(sub.id)
         if (subEl) observer.observe(subEl)
      })
    })

    return () => observer.disconnect()
  }, [module.sections])

  // 5-second read timer
  useEffect(() => {
    const timers = sectionTimers.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id
          if (entry.isIntersecting && !completedSections.has(id)) {
            const timer = setTimeout(() => markSectionComplete(id), 5000)
            timers.set(id, timer)
          } else {
            const existing = timers.get(id)
            if (existing) { clearTimeout(existing); timers.delete(id) }
          }
        })
      },
      { threshold: 0.3 }
    )
    module.sections.forEach((section) => {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    })
    return () => {
      observer.disconnect()
      timers.forEach(t => clearTimeout(t))
      timers.clear()
    }
  }, [module.sections, completedSections, markSectionComplete])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  const handleReadSection = useCallback((title: string, content: string) => {
    ttsRef.current?.readSection(title, content)
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: enhancedModuleStyles }} />
      <div className="relative min-h-screen" style={{ color: '#000000' }}>
        <ModuleSidebar
          sections={module.sections}
          activeSection={activeSection}
          completedSections={completedSections}
          sidebarOpen={sidebarOpen}
          focusMode={focusMode}
          estimatedReadTime={module.estimatedReadTime}
          lastUpdated={module.lastUpdated}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          onScrollToSection={scrollToSection}
        />

        {/* Floating AI Assistant - Desktop */}
        {!aiAssistantOpen && (
          <motion.button
            onClick={() => setAiAssistantOpen(true)}
            className="fixed bottom-6 right-6 z-[9998] p-4 bg-blue-600 text-white rounded-full shadow-2xl hover:shadow-3xl flex items-center space-x-3 transition-all duration-300 hover:scale-110 group hidden lg:flex"
            title="Open Learning Assistant"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
            <span className="font-semibold">AI Tutor</span>
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        )}

        {aiAssistantOpen && (
          <div className="fixed bottom-6 right-6 z-[9998] w-full max-w-md h-[600px] hidden lg:block">
            <AITutorBot
              moduleTitle={module.title}
              moduleDescription={module.description}
              currentSection={activeSection ? module.sections.find(s => s.id === activeSection)?.title || '' : ''}
              currentSectionContent={activeSection ? module.sections.find(s => s.id === activeSection)?.content || '' : ''}
              moduleId={module.title}
              isEmbedded={false}
              onClose={() => setAiAssistantOpen(false)}
            />
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="transition-all duration-300">
          {/* Header with Focus Mode Toggle */}
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            {module.sections.length > 0 && (
              <div className="h-1 bg-gray-100 w-full">
                <div
                  className="h-1 bg-green-500 transition-all duration-500"
                  style={{ width: `${Math.round(completedSections.size / module.sections.length * 100)}%` }}
                />
              </div>
            )}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-3 lg:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 lg:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                <h2 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-black truncate pr-2">{module.title}</h2>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-200 flex-shrink-0">
                  {completedSections.size}/{module.sections.length}
                </span>
              </div>
              <button
                onClick={() => setFocusMode(!focusMode)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg transition-colors flex-shrink-0 touch-manipulation ${
                  focusMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
              >
                {focusMode ? (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Exit Focus</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4" />
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Focus Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className={`max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6 xl:py-8 ${focusMode ? 'max-w-5xl' : ''}`}>
            {/* Module Header */}
            {!focusMode && (
              <div className="bg-white rounded-lg border border-gray-200 mb-4 sm:mb-6 lg:mb-8 p-4 sm:p-5 lg:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">Official Guide</span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-blue-700 text-white">Verified 2025</span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">{module.title}</h1>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">{module.description}</p>
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  {module.estimatedReadTime && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-blue-600 flex-shrink-0" />
                      <span>{module.estimatedReadTime}</span>
                    </div>
                  )}
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-blue-600 flex-shrink-0" />
                    <span>{module.sections.length} Sections</span>
                  </div>
                </div>
              </div>
            )}

            {/* Content Sections */}
            {module.sections.map(section => (
              <ModuleContentSection
                key={section.id}
                section={section}
                completedSections={completedSections}
                onMarkComplete={markSectionComplete}
                onReadSection={handleReadSection}
              />
            ))}

            {/* Quiz */}
            {quiz && quiz.questions.length > 0 && (
              <ModuleQuiz questions={quiz.questions} moduleId={moduleId} />
            )}

            {/* Module Completion */}
            <div className="mt-16 pt-8 border-t border-gray-200 text-center">
              <div className={`inline-flex items-center justify-center p-4 rounded-full mb-4 ${
                completedSections.size === module.sections.length ? 'bg-green-600' : 'bg-blue-600'
              }`}>
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {completedSections.size === module.sections.length ? '\uD83C\uDF89 Module Complete!' : 'Keep Reading'}
              </h3>
              <p className="text-gray-700">
                {completedSections.size === module.sections.length
                  ? "You've completed all sections in this module."
                  : `${completedSections.size} of ${module.sections.length} sections read.`}
              </p>
            </div>
          </div>
        </div>

        <ModuleTTS
          ref={ttsRef}
          activeSection={activeSection}
          sections={module.sections}
          aiAssistantOpen={aiAssistantOpen}
        />
      </div>
    </>
  )
}

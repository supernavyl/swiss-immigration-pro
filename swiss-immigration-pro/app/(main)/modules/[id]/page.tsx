'use client'

import { useState, useEffect, useRef, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Play, CheckSquare, CheckCircle } from 'lucide-react'
import { getAllModules, getAllModulesForAdmin, getModulePack, type Module } from '@/lib/content/pack-content'
import { PRICING_PACKS } from '@/lib/pricing'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import EnhancedModuleDisplay from '@/components/modules/EnhancedModuleDisplay'
import { loadEnhancedModule } from '@/lib/content/enhanced-module-loader'
import type { EnhancedModule } from '@/lib/content/enhanced-modules/non-free-enhanced-modules'
import { useToast } from '@/components/providers/ToastProvider'
import { extractSections, organizeSectionsIntoCategories, type TocSection, type TocCategory } from '@/lib/content/section-helpers'
import { api } from '@/lib/api'

// Extracted components
import LockedModuleView from '@/components/modules/LockedModuleView'
import ModuleTableOfContents from '@/components/modules/ModuleTableOfContents'
import ModuleContentHeader from '@/components/modules/ModuleContentHeader'
import ModuleMarkdown from '@/components/modules/ModuleMarkdown'
import ModuleStandardQuiz from '@/components/modules/ModuleStandardQuiz'
import ModuleExercises from '@/components/modules/ModuleExercises'
import ModuleAttachments from '@/components/modules/ModuleAttachments'

type PackValue = (typeof PRICING_PACKS)[keyof typeof PRICING_PACKS]

export default function ModuleView({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { showToast } = useToast()
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(true)
  const [module, setModule] = useState<Module | null>(null)
  const [enhancedContent, setEnhancedContent] = useState<EnhancedModule | null>(null)
  const [enhancedLoading, setEnhancedLoading] = useState(false)
  const [packInfo, setPackInfo] = useState<PackValue | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const [progress, setProgress] = useState(0)
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({})
  const [activeSection, setActiveSection] = useState('')
  const [categories, setCategories] = useState<TocCategory[]>([])
  const [sections, setSections] = useState<TocSection[]>([])

  const contentRef = useRef<HTMLDivElement>(null)
  const sectionTimers = useRef<Record<string, NodeJS.Timeout>>({})

  // ── Load module ──────────────────────────────────────────────────
  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated' || !session) {
      router.push('/auth/login')
      return
    }

    const adminStatus = session.user?.isAdmin ?? false
    setIsAdmin(adminStatus)
    const userPackId = session.user?.packId ?? 'free'
    const moduleId = resolvedParams.id

    let foundModule: Module | null = null
    let foundPack: PackValue | null = null
    let locked = false

    if (adminStatus) {
      const matched = getAllModulesForAdmin().find((m) => m.id === moduleId)
      if (matched) {
        foundModule = matched
        const packId = getModulePack(matched.id)
        foundPack = PRICING_PACKS[packId as keyof typeof PRICING_PACKS] ?? null
      }
    } else {
      const matched = getAllModules(userPackId).find((m) => m.id === moduleId)
      if (matched) {
        foundModule = matched
        foundPack = PRICING_PACKS[userPackId as keyof typeof PRICING_PACKS] ?? null
      } else {
        const fallback = getAllModulesForAdmin().find((m) => m.id === moduleId)
        if (fallback) {
          foundModule = fallback
          foundPack = PRICING_PACKS[getModulePack(fallback.id) as keyof typeof PRICING_PACKS] ?? null
          locked = true
        }
      }
    }

    if (!foundModule) { router.push('/dashboard'); return }

    setIsLocked(locked)
    setModule(foundModule)
    setPackInfo(foundPack)

    if (foundModule.content) {
      const secs = extractSections(foundModule.content)
      setSections(secs)
      setActiveSection(secs[0]?.id ?? '')
      setCategories(organizeSectionsIntoCategories(secs))
      if (!locked) loadProgress(foundModule.id)
    }

    setLoading(false)
  }, [session, status, router, resolvedParams])

  // ── Lazy-load enhanced module content ──────────────────────────
  useEffect(() => {
    if (!module || isLocked) return
    let cancelled = false
    setEnhancedLoading(true)
    loadEnhancedModule(module.id).then((content) => {
      if (!cancelled) {
        setEnhancedContent(content)
        setEnhancedLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [module, isLocked])

  // ── Progress tracking ────────────────────────────────────────────
  const loadProgress = async (moduleId: string) => {
    try {
      const data = await api.get<{ progress?: number; sections?: Record<string, boolean> }>(
        `/modules/progress?moduleId=${moduleId}`
      )
      setProgress(data.progress ?? 0)
      setCompletedSections(data.sections ?? {})
    } catch {
      /* non-critical — default to 0 */
    }
  }

  const updateSectionProgress = useCallback(
    async (sectionId: string, completed: boolean) => {
      if (!module || isLocked) return

      setCompletedSections((prev) => {
        const updated = { ...prev, [sectionId]: completed }
        const allSecs = extractSections(module.content ?? '')
        const total = allSecs.length
        const done = Object.values(updated).filter(Boolean).length
        setProgress(total > 0 ? Math.round((done / total) * 100) : 0)
        return updated
      })

      try {
        await api.post('/modules/progress', { moduleId: module.id, sectionId, completed })
      } catch {
        /* non-critical */
      }
    },
    [module, isLocked],
  )

  // ── Scroll / intersection observer ───────────────────────────────
  useEffect(() => {
    if (!contentRef.current || !module) return

    const handleScroll = () => {
      const secs = extractSections(module.content ?? '')
      secs.forEach((s) => {
        const el = document.getElementById(s.id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (rect.top <= 150 && rect.bottom >= 100) setActiveSection(s.id)
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sid = entry.target.id
          if (entry.isIntersecting && !completedSections[sid]) {
            if (!sectionTimers.current[sid]) {
              sectionTimers.current[sid] = setTimeout(() => {
                updateSectionProgress(sid, true)
                delete sectionTimers.current[sid]
              }, 3000)
            }
          } else if (!entry.isIntersecting && sectionTimers.current[sid]) {
            clearTimeout(sectionTimers.current[sid])
            delete sectionTimers.current[sid]
          }
        })
      },
      { root: null, rootMargin: '-200px 0px -200px 0px', threshold: 0.3 },
    )

    const secs = extractSections(module.content ?? '')
    secs.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    const el = contentRef.current
    el.addEventListener('scroll', handleScroll)
    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      el.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
      Object.values(sectionTimers.current).forEach((t) => clearTimeout(t))
    }
  }, [module, completedSections, updateSectionProgress])

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(sectionId)
  }

  // ── Early returns ────────────────────────────────────────────────
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h1>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (enhancedLoading && !isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading module content...</p>
        </div>
      </div>
    )
  }

  if (enhancedContent && !isLocked) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <Link
              href={isAdmin ? '/admin' : '/dashboard'}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {isAdmin ? 'Admin' : 'Dashboard'}
            </Link>
          </div>
          <EnhancedModuleDisplay
            module={enhancedContent}
            moduleId={resolvedParams.id}
            quiz={module.quiz}
          />
        </div>
      </div>
    )
  }

  if (isLocked) return <LockedModuleView module={module} />

  // ── Main content ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href={isAdmin ? '/admin' : '/dashboard'}
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
          <ModuleTableOfContents
            sections={sections}
            activeSection={activeSection}
            onScrollTo={scrollToSection}
          />

          <main className="flex-1 min-w-0">
            <div
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-200 prose-p:leading-relaxed prose-ul:text-gray-700 dark:prose-ul:text-gray-200 prose-li:text-gray-700 dark:prose-li:text-gray-200 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-white"
              ref={contentRef}
            >
              <ModuleContentHeader
                title={module.title}
                description={module.description}
                progress={progress}
                categories={categories}
                completedSections={completedSections}
              />

              {/* Video placeholder */}
              {module.type === 'video' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Play className="w-20 h-20 text-blue-600 mb-4" />
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Video Content Coming Soon</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This module includes video explanations</p>
                    </div>
                  </div>
                  {module.content && (
                    <div className="mt-6 prose prose-lg max-w-none">
                      <h3 className="text-xl font-bold mb-4">Video Transcript</h3>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{module.content}</ReactMarkdown>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Interactive checklist */}
              {module.content?.includes('## Interactive Checklist') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <CheckSquare className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Interactive Checklist</h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Track your progress as you work through this module</p>
                  <div className="space-y-3">
                    {module.content
                      .split('\n')
                      .filter((line) => line.trim().startsWith('- [ ]'))
                      .slice(0, 10)
                      .map((line, idx) => (
                        <label key={idx} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                          <span className="text-gray-700 dark:text-gray-200">{line.replace('- [ ]', '').trim()}</span>
                        </label>
                      ))}
                  </div>
                </motion.div>
              )}

              {/* Module markdown content */}
              {module.content && (
                <ModuleMarkdown content={module.content} completedSections={completedSections} />
              )}

              {/* Quiz */}
              {module.quiz && (
                <ModuleStandardQuiz
                  questions={module.quiz.questions}
                  onComplete={(score) => {
                    if (score >= 80) setProgress(100)
                    else if (score >= 60) setProgress(75)
                    else setProgress(50)
                  }}
                />
              )}

              {/* Exercises */}
              {module.exercises && module.exercises.length > 0 && (
                <ModuleExercises exercises={module.exercises} />
              )}

              {/* Attachments */}
              {module.attachments && module.attachments.length > 0 && (
                <ModuleAttachments attachments={module.attachments} />
              )}

              {/* Completion button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => {
                    setProgress(100)
                    showToast('Module completed!', 'success')
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

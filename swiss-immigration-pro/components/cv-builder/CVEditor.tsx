'use client'

import { useEffect, useState } from 'react'
import { useCVBuilderStore } from '@/store/cvBuilderStore'
import SectionNav from './SectionNav'
import TemplateStrip from './TemplateStrip'
import ExportBar from './ExportBar'
import CVPreview from './CVPreview'
import AIQuickBar from './AIQuickBar'
import ATSScoreBadge from './ATSScoreBadge'
import PersonalInfoForm from './forms/PersonalInfoForm'
import SummaryForm from './forms/SummaryForm'
import ExperienceForm from './forms/ExperienceForm'
import EducationForm from './forms/EducationForm'
import SkillsForm from './forms/SkillsForm'
import LanguagesForm from './forms/LanguagesForm'
import CertificationsForm from './forms/CertificationsForm'
import ReferencesForm from './forms/ReferencesForm'
import ProjectsForm from './forms/ProjectsForm'
import CustomSectionForm from './forms/CustomSectionForm'
import { Eye, EyeOff, ArrowLeft, Loader2, Check } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

const SECTION_FORMS: Record<string, React.FC> = {
  personal: PersonalInfoForm,
  summary: SummaryForm,
  experience: ExperienceForm,
  education: EducationForm,
  skills: SkillsForm,
  languages: LanguagesForm,
  certifications: CertificationsForm,
  references: ReferencesForm,
  projects: ProjectsForm,
  custom: CustomSectionForm,
}

const SECTION_LABELS: Record<string, string> = {
  personal: 'Personal Information',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  languages: 'Languages',
  certifications: 'Certifications',
  references: 'References',
  projects: 'Projects',
  custom: 'Custom Section',
}

export default function CVEditor() {
  const { activeSection, isDirty, isSaving, saveCVToBackend, exportPDF } = useCVBuilderStore()
  const [mobilePreview, setMobilePreview] = useState(false)

  const ActiveForm = SECTION_FORMS[activeSection] || PersonalInfoForm

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveCVToBackend()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        exportPDF().then((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'cv.pdf'
            a.click()
            URL.revokeObjectURL(url)
          }
        })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [saveCVToBackend, exportPDF])

  // Auto-save
  useEffect(() => {
    if (!isDirty) return
    const t = setTimeout(() => saveCVToBackend(), 8000)
    return () => clearTimeout(t)
  }, [isDirty, saveCVToBackend])

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Slim top bar */}
      <header className="flex-shrink-0 h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-30">
        {/* Left: back link */}
        <Link
          href="/tools"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline font-medium">CV Builder</span>
        </Link>

        {/* Center: auto-save status */}
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : isDirty ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Unsaved changes</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-gray-400 dark:text-gray-500">All saved</span>
            </>
          )}
        </div>

        {/* Right: export bar */}
        <ExportBar />
      </header>

      {/* Main 3-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar: AI + SectionNav + ATS */}
        <div
          className={cn(
            'flex-shrink-0 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-14 xl:w-52',
            mobilePreview ? 'hidden lg:flex' : 'flex',
          )}
        >
          {/* AI Quick Actions at top */}
          <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800">
            <AIQuickBar />
          </div>

          {/* Section Nav */}
          <div className="flex-1 overflow-y-auto p-2">
            <SectionNav />
          </div>

          {/* ATS Score at bottom */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 p-2">
            <ATSScoreBadge />
          </div>
        </div>

        {/* Center: form area */}
        <div
          className={cn(
            'flex-1 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-hidden',
            mobilePreview ? 'hidden lg:flex' : 'flex',
          )}
        >
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 lg:p-8 max-w-2xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {SECTION_LABELS[activeSection] || 'Section'}
              </h2>
              <ActiveForm />
            </div>
          </div>
        </div>

        {/* Right panel: preview */}
        <div
          className={cn(
            'flex-1 flex-col bg-gray-100 dark:bg-gray-900/50 overflow-hidden',
            mobilePreview ? 'flex' : 'hidden lg:flex',
          )}
        >
          {/* Template strip at top */}
          <div className="flex-shrink-0 px-4 pt-3 pb-4 border-b border-gray-200/50 dark:border-gray-800/50">
            <TemplateStrip />
          </div>

          {/* Live preview with float effect */}
          <div className="flex-1 overflow-auto flex items-start justify-center p-4">
            <div className="shadow-xl rounded-sm">
              <CVPreview />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile preview toggle — floating pill */}
      <button
        onClick={() => setMobilePreview(!mobilePreview)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full px-5 py-2.5 text-sm font-semibold shadow-xl lg:hidden"
      >
        {mobilePreview ? (
          <>
            <EyeOff className="w-4 h-4" />
            Edit
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            Preview
          </>
        )}
      </button>
    </div>
  )
}

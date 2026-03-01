'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import type { CVSection } from '@/types/cv-builder'
import {
  User, FileText, Briefcase, GraduationCap, Wrench,
  Globe, Award, Users, FolderOpen, LayoutList,
} from 'lucide-react'

const SECTIONS: { id: CVSection; label: string; icon: typeof User }[] = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'languages', label: 'Languages', icon: Globe },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'references', label: 'References', icon: Users },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'custom', label: 'Custom', icon: LayoutList },
]

export default function SectionNav() {
  const { activeSection, setActiveSection } = useCVBuilderStore()

  return (
    <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible p-1">
      {SECTIONS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveSection(id)}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 whitespace-nowrap ${
            activeSection === id
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          <span className="hidden xl:inline">{label}</span>
        </button>
      ))}
    </nav>
  )
}

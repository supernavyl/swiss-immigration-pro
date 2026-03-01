'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { Check } from 'lucide-react'

const TEMPLATES = [
  { id: 'swiss-classic', name: 'Swiss Classic', color: '#1a1a2e' },
  { id: 'modern-zurich', name: 'Modern Zürich', color: '#1e3a5f' },
  { id: 'executive-geneva', name: 'Executive Geneva', color: '#c9a84c' },
  { id: 'tech-startup', name: 'Tech Startup', color: '#6366f1' },
  { id: 'creative-portfolio', name: 'Creative Portfolio', color: '#7c3aed' },
  { id: 'minimal-basel', name: 'Minimal Basel', color: '#18181b' },
  { id: 'academic-bern', name: 'Academic Bern', color: '#0369a1' },
  { id: 'finance-lucerne', name: 'Finance Lucerne', color: '#0d4f4f' },
  { id: 'healthcare-pro', name: 'Healthcare Pro', color: '#0891b2' },
  { id: 'legal-precision', name: 'Legal Precision', color: '#1c1917' },
  { id: 'consultant-elite', name: 'Consultant Elite', color: '#1d4ed8' },
  { id: 'marketing-bold', name: 'Marketing Bold', color: '#be123c' },
  { id: 'engineering-blue', name: 'Engineering Blue', color: '#2563eb' },
  { id: 'hospitality-warm', name: 'Hospitality Warm', color: '#b45309' },
  { id: 'retail-fresh', name: 'Retail Fresh', color: '#15803d' },
]

export default function TemplateStrip() {
  const { activeTemplate, setActiveTemplate } = useCVBuilderStore()

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => setActiveTemplate(t.id)}
          className={`flex-shrink-0 group relative rounded-lg transition-all duration-150 ${
            activeTemplate === t.id
              ? 'ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900'
              : 'ring-1 ring-slate-200 hover:ring-slate-300 dark:ring-slate-700'
          }`}
        >
          <div
            className="w-16 h-20 rounded-lg flex flex-col items-center justify-center gap-1"
            style={{ background: `linear-gradient(135deg, ${t.color}22, ${t.color}08)` }}
          >
            <div className="w-8 h-1.5 rounded-full" style={{ backgroundColor: t.color }} />
            <div className="w-6 h-0.5 rounded-full bg-slate-300" />
            <div className="w-7 h-0.5 rounded-full bg-slate-200" />
            <div className="w-5 h-0.5 rounded-full bg-slate-200" />
            <div className="w-7 h-0.5 rounded-full bg-slate-200" />
          </div>
          {activeTemplate === t.id && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {t.name}
          </div>
        </button>
      ))}
    </div>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { Check, Sparkles, Loader2, X } from 'lucide-react'

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
  const [showAIPicker, setShowAIPicker] = useState(false)
  const [jobInput, setJobInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiResult, setAiResult] = useState<{ templateId: string; reason: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showAIPicker) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [showAIPicker])

  const handleAIPick = async () => {
    if (!jobInput.trim()) return
    setIsLoading(true)
    setAiResult(null)
    try {
      const res = await fetch('/api/cv/recommend-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle: jobInput }),
      })
      const data = await res.json() as { templateId?: string; reason?: string }
      if (data.templateId) {
        setAiResult({ templateId: data.templateId, reason: data.reason ?? '' })
        setActiveTemplate(data.templateId)
      }
    } catch {
      // silent fail — user can still pick manually
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {/* AI Picker panel */}
      {showAIPicker ? (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800">
          <Sparkles className="w-4 h-4 text-violet-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={jobInput}
            onChange={(e) => setJobInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAIPick()}
            placeholder="e.g. Software Engineer, Marketing Manager…"
            className="flex-1 text-xs bg-transparent outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
          />
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-violet-500 animate-spin flex-shrink-0" />
          ) : (
            <button
              onClick={handleAIPick}
              disabled={!jobInput.trim()}
              className="text-[10px] font-semibold px-2 py-1 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-40 transition-colors flex-shrink-0"
            >
              Pick
            </button>
          )}
          <button onClick={() => { setShowAIPicker(false); setAiResult(null) }} className="text-slate-400 hover:text-slate-600 flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAIPicker(true)}
          className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:from-violet-600 hover:to-indigo-700 transition-all shadow-sm"
        >
          <Sparkles className="w-3 h-3" />
          AI Pick
        </button>
      )}

      {/* AI result reason */}
      {aiResult && (
        <p className="text-[10px] text-violet-600 dark:text-violet-400 px-1 leading-snug">
          ✦ {aiResult.reason}
        </p>
      )}

      {/* Template strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTemplate(t.id)}
            className={`flex-shrink-0 group relative rounded-lg transition-all duration-150 ${
              activeTemplate === t.id
                ? 'ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900'
                : 'ring-1 ring-slate-200 hover:ring-slate-300 dark:ring-slate-700'
            } ${aiResult?.templateId === t.id ? 'ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-slate-900' : ''}`}
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
            {aiResult?.templateId === t.id && activeTemplate !== t.id && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            )}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-medium text-slate-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {t.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

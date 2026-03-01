'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { Sparkles, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function SummaryForm() {
  const { cvData, updateSummary } = useCVBuilderStore()
  const [improving, setImproving] = useState(false)

  const handleImprove = async () => {
    if (!cvData.summary.trim()) return
    setImproving(true)
    try {
      const res = await fetch('/api/cv/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'summary', content: cvData.summary, tone: 'professional' }),
      })
      if (res.ok) {
        const { improved } = await res.json()
        if (improved) updateSummary(improved)
      }
    } finally {
      setImproving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Professional Summary</h3>
          <p className="text-xs text-slate-400 mt-0.5">A compelling 3-4 sentence overview of your qualifications</p>
        </div>
        <button
          onClick={handleImprove}
          disabled={improving || !cvData.summary.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300 disabled:opacity-40 transition-colors"
        >
          {improving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          AI Improve
        </button>
      </div>
      <textarea
        value={cvData.summary}
        onChange={(e) => updateSummary(e.target.value)}
        rows={6}
        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all outline-none resize-none"
        placeholder="Experienced software engineer with 8+ years building scalable distributed systems. Proven track record of leading cross-functional teams and delivering high-impact solutions in fast-paced environments..."
      />
      <div className="text-right text-[10px] font-medium text-slate-400">
        {cvData.summary.length} characters
        {cvData.summary.length > 0 && cvData.summary.length < 100 && ' — aim for 150-300'}
      </div>
    </div>
  )
}

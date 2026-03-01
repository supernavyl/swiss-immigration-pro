'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { Sparkles, Wand2, Loader2, Zap } from 'lucide-react'
import { useState } from 'react'
import { cvDataToAPI } from '@/types/cv-builder'

export default function AIQuickBar() {
  const { cvData, loadCVData, isGenerating } = useCVBuilderStore()
  const [generating, setGenerating] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [jobDesc, setJobDesc] = useState('')

  const handleGenerate = async () => {
    if (!jobDesc.trim()) return
    setGenerating(true)
    try {
      const res = await fetch('/api/cv/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: jobDesc,
          personal_info: cvDataToAPI(cvData).personal_info,
        }),
      })
      if (res.ok) {
        const { data } = await res.json()
        if (data) {
          const updated = { ...cvData }
          if (data.summary) updated.summary = data.summary
          if (data.skills?.length) {
            updated.skills = data.skills.map((s: { name: string; category?: string }, i: number) => ({
              id: `ai-skill-${i}`,
              name: s.name,
              category: s.category || 'technical',
              proficiency: 3,
            }))
          }
          if (data.work_experience?.length) {
            updated.workExperience = data.work_experience.map((w: { job_title: string; company?: string; achievements?: string[] }, i: number) => ({
              id: `ai-exp-${i}`,
              jobTitle: w.job_title || '',
              company: w.company || '',
              location: '',
              startDate: '',
              endDate: '',
              isCurrent: false,
              achievements: w.achievements || [],
              tags: [],
            }))
          }
          loadCVData(updated)
          setShowGenerator(false)
          setJobDesc('')
        }
      }
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="px-4 py-2.5">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-600/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Generate
        </button>
        <button
          onClick={() => useCVBuilderStore.getState().runATSAnalysis()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          ATS Check
        </button>
      </div>

      {showGenerator && (
        <div className="mt-3 p-3 bg-violet-50 dark:bg-violet-950/30 rounded-xl border border-violet-200 dark:border-violet-800/50 space-y-2">
          <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">Paste a job description and AI will generate tailored CV content</p>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 resize-none"
            placeholder="Paste the job description here..."
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowGenerator(false)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-800">Cancel</button>
            <button
              onClick={handleGenerate}
              disabled={generating || !jobDesc.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 transition-colors"
            >
              {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
              Generate
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

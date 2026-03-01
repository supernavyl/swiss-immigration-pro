'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import type { WorkExperience } from '@/types/cv-builder'
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react'
import { useState } from 'react'

const inputCls = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-300 transition-all outline-none"

export default function ExperienceForm() {
  const { cvData, addWorkExperience, updateWorkExperience, removeWorkExperience } = useCVBuilderStore()
  const [expanded, setExpanded] = useState<string | null>(null)

  const handleAdd = () => {
    const id = `exp-${Date.now()}`
    addWorkExperience({ id, jobTitle: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, achievements: [''], tags: [] })
    setExpanded(id)
  }

  const addAchievement = (id: string) => {
    const job = cvData.workExperience.find((j) => j.id === id)
    if (job) updateWorkExperience(id, { achievements: [...job.achievements, ''] })
  }

  const updateAchievement = (jobId: string, idx: number, value: string) => {
    const job = cvData.workExperience.find((j) => j.id === jobId)
    if (job) {
      const achievements = [...job.achievements]
      achievements[idx] = value
      updateWorkExperience(jobId, { achievements })
    }
  }

  const removeAchievement = (jobId: string, idx: number) => {
    const job = cvData.workExperience.find((j) => j.id === jobId)
    if (job) updateWorkExperience(jobId, { achievements: job.achievements.filter((_, i) => i !== idx) })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Work Experience</h3>
        <button onClick={handleAdd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Position
        </button>
      </div>

      {cvData.workExperience.length === 0 && (
        <div className="text-center py-10 text-slate-400">
          <p className="text-sm font-medium">No experience added yet</p>
          <p className="text-xs mt-1">Click "Add Position" to get started</p>
        </div>
      )}

      {cvData.workExperience.map((job) => (
        <div key={job.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === job.id ? null : job.id)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{job.jobTitle || 'New Position'}</p>
              <p className="text-xs text-slate-500">{job.company}{job.startDate && ` · ${job.startDate}`}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); removeWorkExperience(job.id) }} className="p-1 text-red-400 hover:text-red-600">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {expanded === job.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {expanded === job.id && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={job.jobTitle} onChange={(e) => updateWorkExperience(job.id, { jobTitle: e.target.value })} className={inputCls} placeholder="Job Title" />
                <input value={job.company} onChange={(e) => updateWorkExperience(job.id, { company: e.target.value })} className={inputCls} placeholder="Company" />
              </div>
              <input value={job.location} onChange={(e) => updateWorkExperience(job.id, { location: e.target.value })} className={inputCls} placeholder="Location" />
              <div className="grid grid-cols-2 gap-3">
                <input type="month" value={job.startDate} onChange={(e) => updateWorkExperience(job.id, { startDate: e.target.value })} className={inputCls} />
                <input type="month" value={job.endDate} onChange={(e) => updateWorkExperience(job.id, { endDate: e.target.value })} className={inputCls} disabled={job.isCurrent} placeholder="End Date" />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <input type="checkbox" checked={job.isCurrent} onChange={(e) => updateWorkExperience(job.id, { isCurrent: e.target.checked, endDate: '' })} className="rounded border-slate-300" />
                I currently work here
              </label>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500">Key Achievements</p>
                {job.achievements.map((a, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-blue-500 mt-2.5 text-sm">▸</span>
                    <input value={a} onChange={(e) => updateAchievement(job.id, i, e.target.value)} className={inputCls + ' flex-1'} placeholder="Describe a quantified achievement..." />
                    <button onClick={() => removeAchievement(job.id, i)} className="p-2 text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                <button onClick={() => addAchievement(job.id)} className="text-xs font-semibold text-blue-600 hover:text-blue-700">+ Add Achievement</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

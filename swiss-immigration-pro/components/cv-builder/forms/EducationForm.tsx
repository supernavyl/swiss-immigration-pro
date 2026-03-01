'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react'
import { useState } from 'react'

const inputCls = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-300 transition-all outline-none"

export default function EducationForm() {
  const { cvData, addEducation, updateEducation, removeEducation } = useCVBuilderStore()
  const [expanded, setExpanded] = useState<string | null>(null)

  const handleAdd = () => {
    const id = `edu-${Date.now()}`
    addEducation({ id, degree: '', institution: '', location: '', startDate: '', endDate: '', isCurrent: false, gpa: '', honors: [] })
    setExpanded(id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Education</h3>
        <button onClick={handleAdd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Education
        </button>
      </div>

      {cvData.education.length === 0 && (
        <div className="text-center py-10 text-slate-400">
          <p className="text-sm font-medium">No education added yet</p>
        </div>
      )}

      {cvData.education.map((edu) => (
        <div key={edu.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <button onClick={() => setExpanded(expanded === edu.id ? null : edu.id)} className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{edu.degree || 'New Education'}</p>
              <p className="text-xs text-slate-500">{edu.institution}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); removeEducation(edu.id) }} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              {expanded === edu.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {expanded === edu.id && (
            <div className="p-4 space-y-3">
              <input value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} className={inputCls} placeholder="Degree (e.g., MSc Computer Science)" />
              <input value={edu.institution} onChange={(e) => updateEducation(edu.id, { institution: e.target.value })} className={inputCls} placeholder="Institution (e.g., ETH Zürich)" />
              <input value={edu.location} onChange={(e) => updateEducation(edu.id, { location: e.target.value })} className={inputCls} placeholder="Location" />
              <div className="grid grid-cols-2 gap-3">
                <input type="month" value={edu.startDate} onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })} className={inputCls} />
                <input type="month" value={edu.endDate} onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })} className={inputCls} disabled={edu.isCurrent} />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <input type="checkbox" checked={edu.isCurrent} onChange={(e) => updateEducation(edu.id, { isCurrent: e.target.checked, endDate: '' })} className="rounded border-slate-300" />
                Currently studying
              </label>
              <input value={edu.gpa} onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })} className={inputCls} placeholder="GPA (optional)" />

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500">Honors / Awards</p>
                {edu.honors.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={h} onChange={(e) => { const honors = [...edu.honors]; honors[i] = e.target.value; updateEducation(edu.id, { honors }) }} className={inputCls + ' flex-1'} placeholder="Honor or award..." />
                    <button onClick={() => updateEducation(edu.id, { honors: edu.honors.filter((_, idx) => idx !== i) })} className="p-2 text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                <button onClick={() => updateEducation(edu.id, { honors: [...edu.honors, ''] })} className="text-xs font-semibold text-blue-600 hover:text-blue-700">+ Add Honor</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

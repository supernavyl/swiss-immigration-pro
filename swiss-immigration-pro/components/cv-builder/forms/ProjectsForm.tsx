'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react'
import { useState } from 'react'

const inputCls = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-300 transition-all outline-none"

export default function ProjectsForm() {
  const { cvData, addProject, updateProject, removeProject } = useCVBuilderStore()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')

  const handleAdd = () => {
    const id = `proj-${Date.now()}`
    addProject({ id, name: '', description: '', url: '', technologies: [], startDate: '', endDate: '' })
    setExpanded(id)
  }

  const addTech = (projId: string) => {
    if (!tagInput.trim()) return
    const proj = cvData.projects.find((p) => p.id === projId)
    if (proj) {
      updateProject(projId, { technologies: [...proj.technologies, tagInput.trim()] })
      setTagInput('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Projects</h3>
        <button onClick={handleAdd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {cvData.projects.length === 0 && <div className="text-center py-10 text-slate-400"><p className="text-sm font-medium">No projects added</p></div>}

      {cvData.projects.map((proj) => (
        <div key={proj.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <button onClick={() => setExpanded(expanded === proj.id ? null : proj.id)} className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors">
            <p className="text-sm font-semibold text-slate-900 dark:text-white text-left">{proj.name || 'New Project'}</p>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); removeProject(proj.id) }} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              {expanded === proj.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>
          {expanded === proj.id && (
            <div className="p-4 space-y-3">
              <input value={proj.name} onChange={(e) => updateProject(proj.id, { name: e.target.value })} className={inputCls} placeholder="Project name" />
              <textarea value={proj.description} onChange={(e) => updateProject(proj.id, { description: e.target.value })} className={inputCls + ' resize-none'} rows={3} placeholder="Brief description..." />
              <input value={proj.url} onChange={(e) => updateProject(proj.id, { url: e.target.value })} className={inputCls} placeholder="Project URL (optional)" />

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500">Technologies</p>
                <div className="flex flex-wrap gap-1.5">
                  {proj.technologies.map((t, i) => (
                    <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium">
                      {t}
                      <button onClick={() => updateProject(proj.id, { technologies: proj.technologies.filter((_, idx) => idx !== i) })} className="text-blue-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(proj.id) } }} className={inputCls + ' flex-1'} placeholder="Add technology..." />
                  <button onClick={() => addTech(proj.id)} className="px-3 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700">Add</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const inputCls = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-300 transition-all outline-none"

export default function ReferencesForm() {
  const { cvData, addReference, updateReference, removeReference } = useCVBuilderStore()
  const [expanded, setExpanded] = useState<string | null>(null)

  const handleAdd = () => {
    const id = `ref-${Date.now()}`
    addReference({ id, name: '', title: '', company: '', email: '', phone: '', relationship: '' })
    setExpanded(id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">References</h3>
        <button onClick={handleAdd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {cvData.references.length === 0 && <div className="text-center py-10 text-slate-400"><p className="text-sm font-medium">No references added</p></div>}

      {cvData.references.map((ref) => (
        <div key={ref.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <button onClick={() => setExpanded(expanded === ref.id ? null : ref.id)} className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors">
            <p className="text-sm font-semibold text-slate-900 dark:text-white text-left">{ref.name || 'New Reference'}</p>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); removeReference(ref.id) }} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              {expanded === ref.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>
          {expanded === ref.id && (
            <div className="p-4 space-y-3">
              <input value={ref.name} onChange={(e) => updateReference(ref.id, { name: e.target.value })} className={inputCls} placeholder="Full name" />
              <div className="grid grid-cols-2 gap-3">
                <input value={ref.title} onChange={(e) => updateReference(ref.id, { title: e.target.value })} className={inputCls} placeholder="Job title" />
                <input value={ref.company} onChange={(e) => updateReference(ref.id, { company: e.target.value })} className={inputCls} placeholder="Company" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="email" value={ref.email} onChange={(e) => updateReference(ref.id, { email: e.target.value })} className={inputCls} placeholder="Email" />
                <input type="tel" value={ref.phone} onChange={(e) => updateReference(ref.id, { phone: e.target.value })} className={inputCls} placeholder="Phone" />
              </div>
              <input value={ref.relationship} onChange={(e) => updateReference(ref.id, { relationship: e.target.value })} className={inputCls} placeholder="Relationship (e.g., Former Manager)" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

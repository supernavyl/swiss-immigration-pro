'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { Plus, Trash2, X } from 'lucide-react'

const inputCls = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-300 transition-all outline-none"

export default function CustomSectionForm() {
  const { cvData, addCustomSection, updateCustomSection, removeCustomSection } = useCVBuilderStore()

  const handleAdd = () => {
    addCustomSection({ id: `custom-${Date.now()}`, title: '', items: [''] })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Custom Sections</h3>
          <p className="text-xs text-slate-400 mt-0.5">Add any additional sections (Volunteering, Publications, etc.)</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Section
        </button>
      </div>

      {cvData.customSections.length === 0 && <div className="text-center py-10 text-slate-400"><p className="text-sm font-medium">No custom sections</p></div>}

      {cvData.customSections.map((section) => (
        <div key={section.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
          <div className="flex gap-2 items-center">
            <input value={section.title} onChange={(e) => updateCustomSection(section.id, { title: e.target.value })} className={inputCls + ' flex-1 font-bold'} placeholder="Section Title" />
            <button onClick={() => removeCustomSection(section.id)} className="p-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
          </div>
          {section.items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input value={item} onChange={(e) => { const items = [...section.items]; items[i] = e.target.value; updateCustomSection(section.id, { items }) }} className={inputCls + ' flex-1'} placeholder="Item..." />
              <button onClick={() => updateCustomSection(section.id, { items: section.items.filter((_, idx) => idx !== i) })} className="p-2 text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
            </div>
          ))}
          <button onClick={() => updateCustomSection(section.id, { items: [...section.items, ''] })} className="text-xs font-semibold text-blue-600 hover:text-blue-700">+ Add Item</button>
        </div>
      ))}
    </div>
  )
}

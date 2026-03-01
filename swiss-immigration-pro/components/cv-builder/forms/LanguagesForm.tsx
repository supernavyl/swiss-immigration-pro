'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import type { CEFRLevel } from '@/types/cv-builder'
import { Plus, Trash2 } from 'lucide-react'

const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native']
const COMMON_LANGS = ['German', 'French', 'Italian', 'English', 'Spanish', 'Portuguese', 'Romansh']

const inputCls = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 rounded-xl text-sm font-medium text-slate-900 dark:text-white transition-all outline-none"

const LEVEL_WIDTH: Record<string, string> = { A1: '16%', A2: '28%', B1: '42%', B2: '58%', C1: '75%', C2: '90%', Native: '100%' }

export default function LanguagesForm() {
  const { cvData, addLanguage, updateLanguage, removeLanguage } = useCVBuilderStore()

  const handleAdd = () => {
    addLanguage({ id: `lang-${Date.now()}`, name: '', level: 'B1', certificate: '' })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Languages</h3>
          <p className="text-xs text-slate-400 mt-0.5">Swiss employers highly value multilingual candidates</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {cvData.languages.length === 0 && (
        <div className="text-center py-10 text-slate-400">
          <p className="text-sm font-medium">No languages added</p>
          <p className="text-xs mt-1">Add German, French, Italian, or English with CEFR levels</p>
        </div>
      )}

      {cvData.languages.map((lang) => (
        <div key={lang.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <select value={COMMON_LANGS.includes(lang.name) ? lang.name : '__custom'} onChange={(e) => updateLanguage(lang.id, { name: e.target.value === '__custom' ? '' : e.target.value })} className={inputCls}>
                <option value="">Select language...</option>
                {COMMON_LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
                <option value="__custom">Other...</option>
              </select>
            </div>
            <div className="w-28">
              <select value={lang.level} onChange={(e) => updateLanguage(lang.id, { level: e.target.value as CEFRLevel })} className={inputCls}>
                {CEFR_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button onClick={() => removeLanguage(lang.id)} className="p-2.5 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
          </div>

          {!COMMON_LANGS.includes(lang.name) && lang.name !== '' && (
            <input value={lang.name} onChange={(e) => updateLanguage(lang.id, { name: e.target.value })} className={inputCls} placeholder="Language name" />
          )}

          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: LEVEL_WIDTH[lang.level] || '50%' }} />
            </div>
            <span className="text-xs font-bold text-blue-600 w-12 text-right">{lang.level}</span>
          </div>

          <input value={lang.certificate} onChange={(e) => updateLanguage(lang.id, { certificate: e.target.value })} className={inputCls} placeholder="Certificate (e.g., Goethe B2, DELF C1)" />
        </div>
      ))}
    </div>
  )
}

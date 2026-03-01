'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import type { SkillCategory } from '@/types/cv-builder'
import { Plus, X } from 'lucide-react'

const CATEGORIES: { value: SkillCategory; label: string }[] = [
  { value: 'technical', label: 'Technical' },
  { value: 'soft', label: 'Soft Skills' },
  { value: 'tools', label: 'Tools' },
  { value: 'other', label: 'Other' },
]

export default function SkillsForm() {
  const { cvData, addSkill, updateSkill, removeSkill } = useCVBuilderStore()

  const handleAdd = (category: SkillCategory) => {
    addSkill({ id: `skill-${Date.now()}`, name: '', category, proficiency: 3 })
  }

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    skills: cvData.skills.filter((s) => s.category === cat.value),
  }))

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Skills</h3>

      {grouped.map((group) => (
        <div key={group.value} className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{group.label}</p>
            <button onClick={() => handleAdd(group.value)} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg pl-3 pr-1 py-1">
                <input
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                  className="bg-transparent text-sm font-medium text-slate-900 dark:text-white outline-none w-24 min-w-0"
                  placeholder="Skill name"
                />
                <div className="flex gap-0.5 mx-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => updateSkill(skill.id, { proficiency: level })}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        level <= skill.proficiency ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <button onClick={() => removeSkill(skill.id)} className="p-1 text-slate-400 hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {group.skills.length === 0 && <p className="text-xs text-slate-400 italic">No {group.label.toLowerCase()} added</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

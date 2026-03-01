'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const inputCls = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-300 transition-all outline-none"

export default function CertificationsForm() {
  const { cvData, addCertification, updateCertification, removeCertification } = useCVBuilderStore()
  const [expanded, setExpanded] = useState<string | null>(null)

  const handleAdd = () => {
    const id = `cert-${Date.now()}`
    addCertification({ id, name: '', issuer: '', date: '', expiry: '', url: '' })
    setExpanded(id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Certifications</h3>
        <button onClick={handleAdd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {cvData.certifications.length === 0 && <div className="text-center py-10 text-slate-400"><p className="text-sm font-medium">No certifications added</p></div>}

      {cvData.certifications.map((cert) => (
        <div key={cert.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <button onClick={() => setExpanded(expanded === cert.id ? null : cert.id)} className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors">
            <p className="text-sm font-semibold text-slate-900 dark:text-white text-left">{cert.name || 'New Certification'}</p>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); removeCertification(cert.id) }} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              {expanded === cert.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>
          {expanded === cert.id && (
            <div className="p-4 space-y-3">
              <input value={cert.name} onChange={(e) => updateCertification(cert.id, { name: e.target.value })} className={inputCls} placeholder="Certification name" />
              <input value={cert.issuer} onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })} className={inputCls} placeholder="Issuing organization" />
              <div className="grid grid-cols-2 gap-3">
                <input type="month" value={cert.date} onChange={(e) => updateCertification(cert.id, { date: e.target.value })} className={inputCls} placeholder="Issue date" />
                <input type="month" value={cert.expiry} onChange={(e) => updateCertification(cert.id, { expiry: e.target.value })} className={inputCls} placeholder="Expiry (optional)" />
              </div>
              <input value={cert.url} onChange={(e) => updateCertification(cert.id, { url: e.target.value })} className={inputCls} placeholder="Credential URL (optional)" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

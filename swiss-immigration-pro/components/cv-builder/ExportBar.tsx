'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { Download, FileText, Save, Loader2 } from 'lucide-react'

export default function ExportBar() {
  const { isSaving, isExporting, isDirty, saveCVToBackend, exportPDF } = useCVBuilderStore()

  const handleExportPDF = async () => {
    const blob = await exportPDF()
    if (blob) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'cv.pdf'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => saveCVToBackend()}
        disabled={isSaving || !isDirty}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-40 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save
      </button>
      <button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-40 bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25"
      >
        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        Export PDF
      </button>
    </div>
  )
}

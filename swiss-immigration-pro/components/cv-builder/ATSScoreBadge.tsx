'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { useState } from 'react'
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react'

export default function ATSScoreBadge() {
  const { atsResult, setATSResult } = useCVBuilderStore()
  const [showDetails, setShowDetails] = useState(false)

  if (!atsResult) return null

  const color =
    atsResult.score >= 80 ? 'emerald' :
    atsResult.score >= 60 ? 'amber' : 'red'

  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-700 ring-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300',
    amber: 'bg-amber-100 text-amber-700 ring-amber-300 dark:bg-amber-900/30 dark:text-amber-300',
    red: 'bg-red-100 text-red-700 ring-red-300 dark:bg-red-900/30 dark:text-red-300',
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ring-1 transition-all ${colorClasses[color]}`}
      >
        ATS {atsResult.score}
      </button>

      {showDetails && (
        <div className="absolute top-10 right-0 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">ATS Analysis</h4>
            <button onClick={() => setShowDetails(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex items-center gap-3">
            <div className={`text-2xl font-black ${color === 'emerald' ? 'text-emerald-600' : color === 'amber' ? 'text-amber-600' : 'text-red-600'}`}>
              {atsResult.score}
            </div>
            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${atsResult.score}%` }}
              />
            </div>
          </div>

          {atsResult.issues.length > 0 && (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {atsResult.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  {issue.severity === 'critical' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                  ) : issue.severity === 'warning' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">{issue.message}</p>
                    <p className="text-slate-400">{issue.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {atsResult.keywordsMissing.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Missing Keywords</p>
              <div className="flex flex-wrap gap-1">
                {atsResult.keywordsMissing.slice(0, 10).map((k, i) => (
                  <span key={i} className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-medium dark:bg-red-900/20 dark:text-red-400">{k}</span>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => { setATSResult(null); setShowDetails(false) }} className="w-full text-center text-xs text-slate-400 hover:text-slate-600 py-1">Dismiss</button>
        </div>
      )}
    </div>
  )
}

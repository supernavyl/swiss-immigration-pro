'use client'

import { useState } from 'react'
import { Award } from 'lucide-react'
import { useToast } from '@/components/providers/ToastProvider'

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
}

interface ModuleQuizProps {
  questions: QuizQuestion[]
  moduleId: string
}

export function ModuleQuiz({ questions, moduleId }: ModuleQuizProps) {
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = () => {
    const score = questions.filter((q, i) => quizAnswers[i] === q.correct).length
    const pct = Math.round(score / questions.length * 100)
    setQuizScore(pct)
    setQuizSubmitted(true)
    if (pct >= 60) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('sip_token') : null
      if (token && moduleId) {
        fetch('/api/modules/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ moduleId, completed: true }),
        })
          .then(r => {
            if (r.ok) {
              showToast('Progress saved!', 'success')
            } else {
              showToast('Failed to save progress. Try refreshing the page.', 'error')
            }
          })
          .catch(() => {
            showToast('Failed to save progress. Try refreshing the page.', 'error')
          })
      }
    }
  }

  const handleRetry = () => {
    setQuizAnswers({})
    setQuizScore(null)
    setQuizSubmitted(false)
  }

  const answeredCount = Object.keys(quizAnswers).length

  return (
    <div className="mt-16 pt-8 border-t border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.15)]">
          <Award className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Knowledge Check
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
              {questions.length}Q
            </span>
          </h3>
          <p className="text-xs text-slate-400">Pass with 60% or higher</p>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, qi) => {
          const chosen = quizAnswers[qi]
          const isCorrect = quizSubmitted && chosen === q.correct

          let cardClass = 'bg-white/[0.02] border-white/[0.07]'
          if (quizSubmitted) {
            cardClass = isCorrect
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : chosen !== undefined
              ? 'bg-red-500/5 border-red-500/20'
              : 'bg-white/[0.02] border-white/[0.07]'
          }

          return (
            <div key={qi} className={`rounded-2xl border p-5 transition-colors ${cardClass}`}>
              <p className="text-sm font-semibold text-white mb-3 leading-relaxed">
                <span className="text-cyan-400 font-bold mr-2">{qi + 1}.</span>
                {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  let optClass = 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-400/50 hover:bg-cyan-400/[0.06] hover:text-white'
                  if (quizSubmitted) {
                    if (oi === q.correct) {
                      optClass = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-medium shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                    } else if (oi === chosen) {
                      optClass = 'border-red-500/40 bg-red-500/10 text-red-400 line-through'
                    } else {
                      optClass = 'border-white/5 bg-transparent text-slate-600 cursor-default'
                    }
                  } else if (chosen === oi) {
                    optClass = 'border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.2)]'
                  }
                  return (
                    <button
                      key={oi}
                      disabled={quizSubmitted}
                      onClick={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs transition-all disabled:cursor-default ${optClass}`}
                    >
                      <span className="font-mono text-[10px] mr-2 opacity-50">{String.fromCharCode(65 + oi)}.</span>
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {!quizSubmitted ? (
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-xs text-slate-500 px-0.5">
            <span>{answeredCount} of {questions.length} answered</span>
            <span>{Math.round(answeredCount / questions.length * 100)}%</span>
          </div>
          <div className="w-full bg-slate-800/60 rounded-full h-1 overflow-hidden">
            <div
              className="h-1 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-300"
              style={{ width: `${Math.round(answeredCount / questions.length * 100)}%` }}
            />
          </div>
          <button
            disabled={answeredCount < questions.length}
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:from-cyan-400 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_28px_rgba(6,182,212,0.35)]"
          >
            Submit Quiz
          </button>
        </div>
      ) : (
        <div className={`mt-6 p-6 rounded-2xl border text-center ${
          quizScore! >= 80 ? 'border-emerald-500/25 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.08)]' :
          quizScore! >= 60 ? 'border-cyan-500/25 bg-cyan-500/5 shadow-[0_0_30px_rgba(6,182,212,0.08)]' :
          'border-orange-500/25 bg-orange-500/5'
        }`}>
          <div className="text-3xl mb-2">
            {quizScore! >= 80 ? '🎉' : quizScore! >= 60 ? '✅' : '📖'}
          </div>
          <p className={`text-3xl font-bold mb-1 ${
            quizScore! >= 80 ? 'text-emerald-400' :
            quizScore! >= 60 ? 'text-cyan-400' :
            'text-orange-400'
          }`}>
            {quizScore}%
          </p>
          <p className="text-sm text-slate-400">
            {quizScore! >= 80 ? 'Excellent — module completed!' :
             quizScore! >= 60 ? 'Passed — keep going.' :
             'Not quite — review the sections and try again.'}
          </p>
          {quizScore! < 60 && (
            <button
              onClick={handleRetry}
              className="mt-4 px-5 py-2 text-xs font-semibold rounded-xl border border-white/10 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-300 transition-all"
            >
              Retry Quiz
            </button>
          )}
        </div>
      )}
    </div>
  )
}

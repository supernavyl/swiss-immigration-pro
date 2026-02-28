'use client'

import { useState } from 'react'
import { Award } from 'lucide-react'

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
        }).catch(() => {})
      }
    }
  }

  const handleRetry = () => {
    setQuizAnswers({})
    setQuizScore(null)
    setQuizSubmitted(false)
  }

  return (
    <div className="mt-16 pt-8 border-t-2 border-blue-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Award className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Knowledge Check</h3>
          <p className="text-sm text-gray-600">{questions.length} questions · Pass with 60%</p>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, qi) => {
          const chosen = quizAnswers[qi]
          const isCorrect = chosen === q.correct
          return (
            <div key={qi} className={`rounded-xl border-2 p-5 transition-colors ${
              quizSubmitted
                ? isCorrect ? 'border-green-300 bg-green-50' : 'border-red-200 bg-red-50'
                : 'border-gray-200 bg-white'
            }`}>
              <p className="font-semibold text-gray-900 mb-3">
                <span className="text-blue-600 mr-2">{qi + 1}.</span>{q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  let optStyle = 'border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                  if (quizSubmitted) {
                    if (oi === q.correct) optStyle = 'border-green-400 bg-green-100 text-green-800 font-semibold'
                    else if (oi === chosen) optStyle = 'border-red-300 bg-red-100 text-red-700 line-through'
                    else optStyle = 'border-gray-100 bg-gray-50 text-gray-400'
                  } else if (chosen === oi) {
                    optStyle = 'border-blue-500 bg-blue-50 text-blue-800 font-medium'
                  }
                  return (
                    <button
                      key={oi}
                      disabled={quizSubmitted}
                      onClick={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                      className={`w-full text-left px-4 py-2.5 rounded-lg border-2 transition-all text-sm ${optStyle} disabled:cursor-default`}
                    >
                      <span className="font-mono text-xs mr-2 opacity-60">{String.fromCharCode(65 + oi)}.</span>
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
        <button
          disabled={Object.keys(quizAnswers).length < questions.length}
          onClick={handleSubmit}
          className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Quiz
        </button>
      ) : (
        <div className={`mt-6 p-5 rounded-xl text-center border-2 ${
          quizScore! >= 80 ? 'border-green-300 bg-green-50' :
          quizScore! >= 60 ? 'border-blue-300 bg-blue-50' :
          'border-orange-300 bg-orange-50'
        }`}>
          <div className="text-4xl mb-2">
            {quizScore! >= 80 ? '\uD83C\uDF89' : quizScore! >= 60 ? '\u2705' : '\uD83D\uDCD6'}
          </div>
          <p className="text-2xl font-bold mb-1" style={{ color: quizScore! >= 60 ? '#16a34a' : '#ea580c' }}>
            {quizScore}%
          </p>
          <p className="text-sm font-medium text-gray-700">
            {quizScore! >= 80 ? 'Excellent! Module completed.' :
             quizScore! >= 60 ? 'Passed! Keep going.' :
             'Not quite \u2014 review the sections and try again.'}
          </p>
          {quizScore! < 60 && (
            <button
              onClick={handleRetry}
              className="mt-3 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retry Quiz
            </button>
          )}
        </div>
      )}
    </div>
  )
}

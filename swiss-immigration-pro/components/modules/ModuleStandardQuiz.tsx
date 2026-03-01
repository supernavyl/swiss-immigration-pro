'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, CheckCircle } from 'lucide-react'

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
}

interface ModuleStandardQuizProps {
  questions: QuizQuestion[]
  /** Called after grading with the percentage score (0-100). */
  onComplete: (score: number) => void
}

export default function ModuleStandardQuiz({ questions, onComplete }: ModuleStandardQuizProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [score, setScore] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    let correct = 0
    questions.forEach((q, idx) => {
      if (answers[idx] === q.options[q.correct]) correct++
    })
    const pct = Math.round((correct / questions.length) * 100)
    setScore(pct)
    setSubmitted(true)
    onComplete(pct)
  }

  const handleRetry = () => {
    setAnswers({})
    setScore(null)
    setSubmitted(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <HelpCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Knowledge Check</h2>
        </div>
        {submitted && (
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              (score ?? 0) >= 80
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : (score ?? 0) >= 60
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}
          >
            {score}% correct
          </span>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => {
          const userAnswer = answers[idx]
          const correctAnswer = q.options[q.correct]
          const isCorrect = userAnswer === correctAnswer
          const showFeedback = submitted && userAnswer !== undefined

          return (
            <div
              key={idx}
              className={`border rounded-lg p-6 transition-all ${
                showFeedback
                  ? isCorrect
                    ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                    : 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                    showFeedback
                      ? isCorrect
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  }`}
                >
                  {showFeedback ? (isCorrect ? '\u2713' : '\u2717') : idx + 1}
                </span>
                {q.question}
              </h3>

              <div className="space-y-2 ml-11">
                {q.options.map((opt, optIdx) => {
                  const isThisCorrect = optIdx === q.correct
                  const isThisSelected = userAnswer === opt

                  let style =
                    'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  if (submitted) {
                    if (isThisCorrect)
                      style =
                        'border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/30'
                    else if (isThisSelected)
                      style =
                        'border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/30'
                    else style = 'border-gray-200 dark:border-gray-600 opacity-60'
                  } else if (isThisSelected) {
                    style =
                      'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30'
                  }

                  return (
                    <label
                      key={optIdx}
                      className={`flex items-center space-x-3 p-3 border rounded-lg transition-all ${
                        submitted ? 'cursor-default' : 'cursor-pointer'
                      } ${style}`}
                    >
                      <input
                        type="radio"
                        name={`question-${idx}`}
                        value={opt}
                        checked={isThisSelected}
                        onChange={(e) =>
                          !submitted && setAnswers({ ...answers, [idx]: e.target.value })
                        }
                        disabled={submitted}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span
                        className={`flex-1 ${
                          submitted && isThisCorrect
                            ? 'text-green-700 dark:text-green-300 font-medium'
                            : submitted && isThisSelected && !isThisCorrect
                              ? 'text-red-700 dark:text-red-300 line-through'
                              : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {opt}
                      </span>
                      {submitted && isThisCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                    </label>
                  )
                })}
              </div>

              {showFeedback && !isCorrect && (
                <div className="mt-3 ml-11 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <span className="font-medium text-green-700 dark:text-green-400">
                    Correct answer:
                  </span>{' '}
                  {correctAnswer}
                </div>
              )}
            </div>
          )
        })}

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== questions.length}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Answers ({Object.keys(answers).length}/{questions.length} answered)
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <div
              className={`flex-1 text-center p-4 rounded-lg border ${
                (score ?? 0) >= 80
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                  : (score ?? 0) >= 60
                    ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700'
                    : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
              }`}
            >
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{score}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {(score ?? 0) >= 80
                  ? "Excellent! You've mastered this material."
                  : (score ?? 0) >= 60
                    ? 'Good effort! Review the highlighted questions.'
                    : 'Review the content above and try again.'}
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

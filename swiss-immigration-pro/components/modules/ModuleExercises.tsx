'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, ChevronRight } from 'lucide-react'

interface Exercise {
  title: string
  description: string
}

interface ModuleExercisesProps {
  exercises: Exercise[]
}

export default function ModuleExercises({ exercises }: ModuleExercisesProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="flex items-center space-x-3 mb-2">
        <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Practice Exercises
        </h2>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 ml-9">
        Apply what you learned. Click each exercise to see the instructions.
      </p>
      <div className="space-y-4">
        {exercises.map((exercise, idx) => {
          const isExpanded = expanded[idx] ?? false
          return (
            <div
              key={idx}
              className={`border rounded-lg transition-all ${
                isExpanded
                  ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                className="w-full p-5 flex items-start justify-between text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {exercise.title}
                    </h3>
                    {!isExpanded && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {exercise.description}
                      </p>
                    )}
                  </div>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              </button>
              {isExpanded && (
                <div className="px-5 pb-5 pt-0">
                  <div className="ml-11 p-4 bg-white dark:bg-gray-700/50 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {exercise.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

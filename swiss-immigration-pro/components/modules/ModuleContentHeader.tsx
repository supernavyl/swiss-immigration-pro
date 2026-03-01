'use client'

import { motion } from 'framer-motion'
import { Layers, CheckCircle, Award } from 'lucide-react'
import type { TocCategory } from '@/lib/content/section-helpers'

interface ModuleContentHeaderProps {
  title: string
  description?: string
  progress: number
  categories: TocCategory[]
  completedSections: Record<string, boolean>
}

export default function ModuleContentHeader({
  title,
  description,
  progress,
  categories,
  completedSections,
}: ModuleContentHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <Layers className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {categories.length} Categories
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{title}</h1>
          {description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{description}</p>
          )}
        </div>
        <div className="ml-6 flex flex-col items-end space-y-2">
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{progress}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Complete</div>
          </div>
          {progress === 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
            >
              <Award className="w-6 h-6 text-green-600" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((cat, idx) => {
            const completedCount = cat.sections.filter((s) => completedSections[s.id]).length
            const totalCount = cat.sections.length
            const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

            return (
              <div
                key={idx}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  pct === 100
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700'
                    : pct > 0
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{cat.title}</span>
                  {pct === 100 && <CheckCircle className="w-4 h-4" />}
                  <span className="text-xs opacity-75">
                    ({completedCount}/{totalCount})
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

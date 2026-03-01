'use client'

import { motion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import type { TabProps, DashboardModule } from './types'

const ACHIEVEMENTS = [
  { name: 'Getting Started', description: 'Complete your first module', threshold: 0 },
  { name: 'Quarter Way', description: 'Complete 25% of content', threshold: 25 },
  { name: 'Halfway Hero', description: 'Complete 50% of content', threshold: 50 },
  { name: 'Almost There', description: 'Complete 75% of content', threshold: 75 },
  { name: 'Complete!', description: 'Finish all modules', threshold: 100 },
]

export default function ProgressTab({ modules, progress = 0 }: TabProps) {
  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Learning Progress</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-900 dark:text-white">Overall Completion</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
                className="bg-blue-600 h-4 rounded-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{modules.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Modules</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {modules.filter((m: DashboardModule) => m.completed).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((a, idx) => {
            const unlocked = idx === 0 || progress >= a.threshold
            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  unlocked
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60'
                }`}
              >
                {unlocked ? (
                  <Check className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                ) : (
                  <Lock className="w-6 h-6 text-gray-400 mb-2" />
                )}
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{a.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{a.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

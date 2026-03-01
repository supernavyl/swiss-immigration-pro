'use client'

import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import type { TabProps } from './types'

const RESOURCES: Record<string, Array<{ name: string; type: string; category: string }>> = {
  immigration: [
    { name: 'Work Permit Application Form', type: 'PDF', category: 'Forms' },
    { name: 'Employment Contract Template', type: 'Template', category: 'Templates' },
    { name: 'Document Checklist', type: 'PDF', category: 'Checklists' },
    { name: 'Quota Tracker Spreadsheet', type: 'Excel', category: 'Tools' },
  ],
  advanced: [
    { name: 'Integration Test Prep Guide', type: 'PDF', category: 'Exam Prep' },
    { name: 'Tax Optimization Strategies', type: 'PDF', category: 'Financial' },
    { name: 'Housing Application Templates', type: 'Template', category: 'Housing' },
  ],
  citizenship: [
    { name: 'Citizenship Application Form', type: 'PDF', category: 'Forms' },
    { name: 'Integration Practice Exam', type: 'PDF', category: 'Exam Prep' },
    { name: 'Language B1 Study Guide', type: 'PDF', category: 'Language' },
  ],
}

export default function ResourcesTab({ user, isFree }: Pick<TabProps, 'user' | 'isFree'>) {
  if (isFree) {
    return (
      <div className="text-center py-12">
        <Download className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upgrade to Download Resources</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Access all templates, checklists, and guides</p>
        <a href="/pricing" className="inline-block btn-primary">
          View Pricing &rarr;
        </a>
      </div>
    )
  }

  const packResources = RESOURCES[user.packId] ?? []

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Downloads</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packResources.map((resource, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="card p-4 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded">
                {resource.type}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{resource.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{resource.category}</p>
            <button className="mt-4 w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
              Download &rarr;
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronRight } from 'lucide-react'
import type { TocSection } from '@/lib/content/section-helpers'

interface ModuleTableOfContentsProps {
  sections: TocSection[]
  activeSection: string
  onScrollTo: (sectionId: string) => void
}

export default function ModuleTableOfContents({
  sections,
  activeSection,
  onScrollTo,
}: ModuleTableOfContentsProps) {
  const [mobileOpen, setMobileOpen] = useState(true)

  return (
    <>
      {/* Desktop — sticky sidebar */}
      <aside className="hidden lg:block lg:w-64 flex-shrink-0">
        <div className="sticky top-24">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Table of Contents</h3>
            </div>
            <nav className="space-y-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onScrollTo(s.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                    activeSection === s.id
                      ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  style={{ paddingLeft: `${(s.level - 1) * 12 + 12}px` }}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Mobile — collapsible toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Table of Contents</span>
          </div>
          <ChevronRight
            className={`w-5 h-5 transition-transform ${mobileOpen ? 'rotate-90' : ''}`}
          />
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-2"
            >
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <nav className="space-y-2">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onScrollTo(s.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                        activeSection === s.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 font-medium border border-blue-200 dark:border-gray-600'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                      style={{ paddingLeft: `${(s.level - 1) * 12 + 12}px` }}
                    >
                      {s.title}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

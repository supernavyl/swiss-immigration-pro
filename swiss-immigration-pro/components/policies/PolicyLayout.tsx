'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Search, X, BookOpen, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface PolicySection {
  id: string
  title: string
  level: number
}

interface PolicyLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
  sections: PolicySection[]
  disclaimer?: React.ReactNode
}

export default function PolicyLayout({ 
  title, 
  lastUpdated, 
  children, 
  sections,
  disclaimer 
}: PolicyLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedSections, setHighlightedSections] = useState<Set<string>>(new Set())
  const [isTocOpen, setIsTocOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Filter sections based on search
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections
    
    const query = searchQuery.toLowerCase()
    return sections.filter(section => 
      section.title.toLowerCase().includes(query)
    )
  }, [sections, searchQuery])

  // Highlight matching text in content
  useEffect(() => {
    if (!searchQuery.trim() || !contentRef.current) {
      setHighlightedSections(new Set())
      return
    }

    const query = searchQuery.toLowerCase()
    const newHighlighted = new Set<string>()
    
    sections.forEach(section => {
      if (section.title.toLowerCase().includes(query)) {
        newHighlighted.add(section.id)
      }
    })

    setHighlightedSections(newHighlighted)

    // Highlight text in content
    const walker = document.createTreeWalker(
      contentRef.current,
      NodeFilter.SHOW_TEXT,
      null
    )

    const textNodes: Text[] = []
    let node
    while (node = walker.nextNode()) {
      if (node.textContent && node.textContent.toLowerCase().includes(query)) {
        textNodes.push(node as Text)
      }
    }

    // Note: We'll handle highlighting via CSS classes in the content
  }, [searchQuery, sections])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsTocOpen(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header with Search */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="sip-container-wide py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-500 mt-1">Last updated: {lastUpdated}</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search policy..."
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                  {filteredSections.length > 0 ? (
                    <div className="p-2">
                      {filteredSections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-md transition-colors text-sm text-gray-700"
                        >
                          <div className="font-medium">{section.title}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="sip-container-wide py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Desktop */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Table of Contents</h3>
                </div>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const isHighlighted = highlightedSections.has(section.id)
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                          isHighlighted
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 font-medium border border-blue-200 dark:border-blue-800'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        style={{ paddingLeft: `${(section.level - 1) * 12 + 12}px` }}
                      >
                        {section.title}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile TOC Toggle */}
            <button
              onClick={() => setIsTocOpen(!isTocOpen)}
              className="lg:hidden mb-6 w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Table of Contents</span>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform ${isTocOpen ? 'rotate-90' : ''}`} />
            </button>

            {/* Mobile TOC */}
            <AnimatePresence>
              {isTocOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden mb-6 overflow-hidden"
                >
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <nav className="space-y-2">
                      {sections.map((section) => {
                        const isHighlighted = highlightedSections.has(section.id)
                        return (
                          <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                              isHighlighted
                                ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                            style={{ paddingLeft: `${(section.level - 1) * 12 + 12}px` }}
                          >
                            {section.title}
                          </button>
                        )
                      })}
                    </nav>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Disclaimer */}
            {disclaimer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                {disclaimer}
              </motion.div>
            )}

            {/* Content */}
            <div 
              ref={contentRef}
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-white"
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}




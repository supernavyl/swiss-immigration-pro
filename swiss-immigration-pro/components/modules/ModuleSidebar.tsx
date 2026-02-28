'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, FileText, Clock,
  PanelLeftOpen, PanelLeftClose, Menu, X, GripVertical
} from 'lucide-react'
import { ModuleTOC } from './ModuleTOC'

interface ModuleSection {
  id: string
  title: string
  content: string
  subsections?: ModuleSection[]
  legalReferences?: string[]
  officialLinks?: { title: string; url: string }[]
  keyPoints?: string[]
}

interface ModuleSidebarProps {
  sections: ModuleSection[]
  activeSection: string
  completedSections: Set<string>
  sidebarOpen: boolean
  focusMode: boolean
  estimatedReadTime?: string
  lastUpdated?: string
  onSidebarToggle: () => void
  onScrollToSection: (sectionId: string) => void
}

export function ModuleSidebar({
  sections,
  activeSection,
  completedSections,
  sidebarOpen,
  focusMode,
  estimatedReadTime,
  lastUpdated,
  onSidebarToggle,
  onScrollToSection,
}: ModuleSidebarProps) {
  const [sidebarWidth, setSidebarWidth] = useState(256)
  const [isResizingSidebar, setIsResizingSidebar] = useState(false)

  // Constrain sidebar width on mount and resize
  useEffect(() => {
    const constrainSidebars = () => {
      const contentContainer = document.querySelector('.max-w-7xl')
      if (!contentContainer) return

      const containerRect = contentContainer.getBoundingClientRect()
      const maxSidebarWidth = Math.max(200, containerRect.left - 48)
      if (sidebarOpen && sidebarWidth > maxSidebarWidth) {
        setSidebarWidth(maxSidebarWidth)
      }
    }

    const timeoutId = setTimeout(constrainSidebars, 150)
    window.addEventListener('resize', constrainSidebars)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', constrainSidebars)
    }
  }, [sidebarOpen, sidebarWidth])

  // Resize handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingSidebar) {
        const newWidth = e.clientX
        const contentContainer = document.querySelector('.max-w-7xl')
        let maxWidth = 350
        if (contentContainer) {
          const containerRect = contentContainer.getBoundingClientRect()
          maxWidth = Math.max(200, containerRect.left - 48)
        }
        const constrainedWidth = Math.min(Math.max(200, newWidth), maxWidth)
        setSidebarWidth(constrainedWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizingSidebar(false)
    }

    if (isResizingSidebar) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizingSidebar])

  const sidebarFooter = (
    <>
      {estimatedReadTime && (
        <div className="flex items-center text-xs text-gray-600 mb-1">
          <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
          <span>{estimatedReadTime}</span>
        </div>
      )}
      {lastUpdated && (
        <div className="flex items-center text-xs text-gray-500">
          <FileText className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
          <span>Updated {lastUpdated}</span>
        </div>
      )}
    </>
  )

  return (
    <>
      {/* FIXED SIDEBAR - Resizable - Hidden on mobile */}
      <div
        className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 hidden lg:block ${
          sidebarOpen && !focusMode ? '' : 'w-0'
        }`}
        style={{ width: sidebarOpen && !focusMode ? `${sidebarWidth}px` : '0px' }}
      >
        <AnimatePresence>
          {sidebarOpen && !focusMode && (
            <motion.div
              initial={{ x: -sidebarWidth, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -sidebarWidth, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="h-full bg-white border-r border-gray-200 shadow-xl flex flex-col relative"
              style={{ width: `${sidebarWidth}px` }}
            >
              {/* Resize Handle */}
              <div
                onMouseDown={(e) => {
                  e.preventDefault()
                  setIsResizingSidebar(true)
                }}
                className="absolute right-0 top-0 w-3 h-full cursor-col-resize hover:bg-blue-100 transition-colors z-10 flex items-center justify-center group"
                title="Drag to resize"
              >
                <GripVertical className="w-3 h-3 text-gray-300 group-hover:text-blue-400 transition-colors" />
              </div>

              {/* Sidebar Header */}
              <div className="flex-shrink-0 px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-600 rounded-lg mr-2">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Contents
                    </h3>
                  </div>
                  <button
                    onClick={onSidebarToggle}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-gray-700"
                    title="Close sidebar"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 ml-12">{sections.length} sections</p>
              </div>

              {/* Sidebar Navigation - Scrollable */}
              <div className="flex-1 overflow-y-auto px-3 py-3">
                <ModuleTOC
                  sections={sections}
                  activeSection={activeSection}
                  completedSections={completedSections}
                  onScrollToSection={onScrollToSection}
                />
              </div>

              {/* Sidebar Footer */}
              <div className="flex-shrink-0 px-5 py-3 border-t border-gray-200 bg-gray-50">
                {sidebarFooter}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button - Hide in focus mode, only on desktop */}
      {!focusMode && (
        <button
          onClick={onSidebarToggle}
          className="fixed z-50 top-1/2 -translate-y-1/2 transition-all duration-300 bg-blue-600 text-white p-2.5 rounded-r-lg hover:bg-blue-700 shadow-md hidden lg:flex items-center justify-center"
          style={{ left: sidebarOpen ? `${sidebarWidth}px` : '0px' }}
          title={sidebarOpen ? "Close table of contents" : "Open table of contents"}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeftOpen className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Mobile Sidebar Toggle Button */}
      {!focusMode && (
        <button
          onClick={onSidebarToggle}
          className="fixed z-50 top-20 left-4 lg:hidden bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
          title="Table of contents"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && !focusMode && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onSidebarToggle}
        />
      )}

      {/* Mobile Sidebar */}
      {sidebarOpen && !focusMode && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="fixed left-0 top-0 h-screen w-80 max-w-[85vw] bg-white border-r border-gray-200 shadow-2xl z-50 lg:hidden flex flex-col"
        >
          {/* Mobile Sidebar Header */}
          <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 rounded-lg mr-2">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Contents
                </h3>
              </div>
              <button
                onClick={onSidebarToggle}
                className="p-2 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-gray-700"
                title="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 ml-12">{sections.length} sections</p>
          </div>

          {/* Mobile Sidebar Navigation - Scrollable */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <ModuleTOC
              sections={sections}
              activeSection={activeSection}
              completedSections={completedSections}
              onScrollToSection={onScrollToSection}
            />
          </div>

          {/* Mobile Sidebar Footer */}
          <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200 bg-gray-50">
            {sidebarFooter}
          </div>
        </motion.div>
      )}
    </>
  )
}

'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, CheckCircle } from 'lucide-react'

interface ModuleSection {
  id: string
  title: string
  content: string
  subsections?: ModuleSection[]
  legalReferences?: string[]
  officialLinks?: { title: string; url: string }[]
  keyPoints?: string[]
}

interface ModuleTOCProps {
  sections: ModuleSection[]
  activeSection: string
  completedSections: Set<string>
  onScrollToSection: (sectionId: string) => void
}

export function ModuleTOC({ sections, activeSection, completedSections, onScrollToSection }: ModuleTOCProps) {
  const [expandedTocSections, setExpandedTocSections] = useState<Set<string>>(new Set([sections[0]?.id]))

  const toggleTocSection = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newExpanded = new Set(expandedTocSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedTocSections(newExpanded)
  }

  const renderTocItem = (section: ModuleSection, level: number = 0) => {
    const isActive = activeSection === section.id
    const isComplete = completedSections.has(section.id)
    const hasSubsections = section.subsections && section.subsections.length > 0
    const isExpanded = expandedTocSections.has(section.id) || isActive

    return (
      <div key={section.id} className="mb-0.5">
        <div
          className={`group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all duration-150 ${
            isActive
              ? 'bg-blue-600 text-white font-medium'
              : isComplete
              ? 'text-green-700 hover:bg-green-50'
              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
          } ${level > 0 ? 'ml-3 text-xs' : 'text-sm'}`}
          onClick={() => onScrollToSection(section.id)}
        >
          <div className="flex items-center flex-1 min-w-0">
            {level === 0 && (
              isComplete ? (
                <CheckCircle className={`w-3 h-3 mr-2 flex-shrink-0 ${isActive ? 'text-white' : 'text-green-500'}`} />
              ) : (
                <div className={`w-1 h-1 rounded-full mr-2 flex-shrink-0 ${
                  isActive ? 'bg-white' : 'bg-blue-600'
                }`} />
              )
            )}
            <span className={`truncate ${isActive ? 'text-white' : isComplete ? 'text-green-700' : 'text-gray-700'}`}>
              {section.title}
            </span>
          </div>
          {hasSubsections && (
            <button
              onClick={(e) => toggleTocSection(section.id, e)}
              className={`p-0.5 rounded transition-colors flex-shrink-0 ml-1.5 ${
                isActive
                  ? 'text-white/90 hover:bg-white/20'
                  : 'text-gray-400 group-hover:text-blue-600'
              }`}
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
        </div>

        {hasSubsections && isExpanded && (
          <div className="mt-0.5 ml-3 pl-2 border-l border-gray-200 space-y-0.5">
            {section.subsections!.map(sub => renderTocItem(sub, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      {sections.map(section => renderTocItem(section))}
    </div>
  )
}

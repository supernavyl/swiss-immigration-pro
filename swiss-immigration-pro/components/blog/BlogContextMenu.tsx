'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { MessageSquare, Copy, Share2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatbot } from '@/components/chatbot/ChatbotProvider'

interface SelectionMenuProps {
  containerRef: React.RefObject<HTMLElement>
}

export function BlogContextMenu({ containerRef }: SelectionMenuProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [selection, setSelection] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const { openChatbot, setInitialMessage } = useChatbot()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setPosition(null)
        return
      }

      // Check if selection is within the container
      if (containerRef.current && !containerRef.current.contains(selection.anchorNode)) {
        setPosition(null)
        return
      }

      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      
      // Calculate position (centered above selection)
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10 + window.scrollY
      })
      setSelection(selection.toString())
    }

    document.addEventListener('selectionchange', handleSelection)
    return () => document.removeEventListener('selectionchange', handleSelection)
  }, [containerRef])

  const handleAskLawyer = () => {
    // Open chat sidebar/modal and pre-fill context
    setInitialMessage(`I'm reading the blog and have a question about this text: "${selection}"\n\nCan you explain how this applies to my situation?`)
    openChatbot()
    
    // Clear selection
    window.getSelection()?.removeAllRanges()
    setPosition(null)
  }

  if (!mounted || !position) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.9 }}
        style={{ 
          position: 'absolute', 
          left: position.x, 
          top: position.y,
          transform: 'translate(-50%, -100%)' 
        }}
        className="z-50 flex items-center gap-1 p-1 bg-gray-900 text-white rounded-lg shadow-xl"
      >
        <button 
          onClick={handleAskLawyer}
          className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium hover:bg-gray-700 rounded transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
          Ask AI Lawyer
        </button>
        <div className="w-px h-4 bg-gray-700 mx-0.5" />
        <button 
          onClick={() => navigator.clipboard.writeText(selection)}
          className="p-1.5 hover:bg-gray-700 rounded transition-colors"
          aria-label="Copy"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button 
          className="p-1.5 hover:bg-gray-700 rounded transition-colors"
          aria-label="Share"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
        
        {/* Arrow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900" />
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info } from 'lucide-react'

interface TooltipProps {
  content: string | React.ReactNode
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
  showIcon?: boolean
  maxWidth?: string
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
  showIcon = false,
  maxWidth = '300px'
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    let top = 0
    let left = 0

    switch (position) {
      case 'top':
        top = triggerRect.top + scrollY - tooltipRect.height - 8
        left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2
        break
      case 'bottom':
        top = triggerRect.bottom + scrollY + 8
        left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2
        break
      case 'left':
        top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2
        left = triggerRect.left + scrollX - tooltipRect.width - 8
        break
      case 'right':
        top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2
        left = triggerRect.right + scrollX + 8
        break
    }

    // Keep tooltip within viewport
    const padding = 10
    if (left < padding) left = padding
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding
    }
    if (top < padding + scrollY) top = padding + scrollY
    if (top + tooltipRect.height > window.innerHeight + scrollY - padding) {
      top = window.innerHeight + scrollY - tooltipRect.height - padding
    }

    setTooltipPosition({ top, left })
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      setTimeout(updatePosition, 10)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    if (isVisible) {
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [isVisible])

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`inline-block ${className}`}
      >
        {showIcon ? (
          <span className="inline-flex items-center gap-1">
            {children}
            <Info className="w-4 h-4 text-blue-500 cursor-help" />
          </span>
        ) : (
          children
        )}
      </span>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0, x: position === 'left' ? 10 : position === 'right' ? -10 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              zIndex: 9999,
              maxWidth,
              pointerEvents: 'none'
            }}
            className="bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg px-3 py-2 shadow-xl border border-gray-700"
          >
            <div className="relative">
              {typeof content === 'string' ? (
                <p className="whitespace-normal">{content}</p>
              ) : (
                content
              )}
              {/* Arrow */}
              <div
                className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 border border-gray-700 transform rotate-45 ${
                  position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-0 border-l-0' :
                  position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2 border-b-0 border-r-0' :
                  position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2 border-l-0 border-b-0' :
                  'left-[-4px] top-1/2 -translate-y-1/2 border-r-0 border-t-0'
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}




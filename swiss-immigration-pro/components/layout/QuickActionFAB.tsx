'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, Search, LayoutDashboard, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useHaptic } from '@/lib/hooks/useHaptic'
import { useIsMobile } from '@/lib/hooks/useMediaQuery'

interface QuickAction {
  id: string
  icon: React.ReactNode
  label: string
  href?: string
  onClick?: () => void
  color: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'consultation',
    icon: <Phone className="w-5 h-5" />,
    label: 'Book Consultation',
    href: '/consultation',
    color: 'from-green-600 to-emerald-600',
  },
  {
    id: 'contact',
    icon: <Mail className="w-5 h-5" />,
    label: 'Contact Us',
    href: '/contact',
    color: 'from-purple-600 to-violet-600',
  },
  {
    id: 'dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: 'Dashboard',
    href: '/dashboard',
    color: 'from-orange-600 to-amber-600',
  },
]

export default function QuickActionFAB() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { haptic } = useHaptic()
  const isMobile = useIsMobile()

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => {
      const newState = !prev
      haptic(newState ? 'medium' : 'light')
      return newState
    })
  }, [haptic])

  const handleActionClick = useCallback(() => {
    setIsExpanded(false)
    haptic('light')
  }, [haptic])

  // Only show on mobile
  if (!isMobile) return null

  return (
    <div className="fixed bottom-32 right-4 z-40">
      {/* Quick Action Menu */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
            className="absolute bottom-16 right-0 space-y-2 mb-2"
          >
            {QUICK_ACTIONS.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <Link
                  href={action.href || '#'}
                  onClick={handleActionClick}
                  className={`flex items-center gap-3 bg-gradient-to-r ${action.color} text-white rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all active:scale-95 touch-manipulation whitespace-nowrap`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {action.icon}
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Toggle Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleExpanded}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all touch-manipulation ${
          isExpanded
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
        }`}
        aria-label={isExpanded ? 'Close quick actions' : 'Open quick actions'}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

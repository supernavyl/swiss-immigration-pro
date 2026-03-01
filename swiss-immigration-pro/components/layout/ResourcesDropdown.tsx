'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Wrench, BookOpen, HelpCircle, FileText, Mail } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

const LINKS = [
  { href: '/tools', label: 'Tools', icon: Wrench, desc: 'Permit calculator, CV builder, timeline' },
  { href: '/blog', label: 'Blog', icon: BookOpen, desc: 'Guides, updates, success stories' },
  { href: '/faq', label: 'FAQ', icon: HelpCircle, desc: 'Common immigration questions' },
  { href: '/visas', label: 'Visa Guides', icon: FileText, desc: 'Complete permit documentation' },
  { href: '/contact', label: 'Contact', icon: Mail, desc: 'Reach our immigration team' },
]

export default function ResourcesDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-md transition-colors duration-150',
          open
            ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800/60'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900',
        )}
      >
        Resources
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-150', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white dark:bg-gray-950 rounded-xl shadow-xl shadow-black/10 border border-gray-200/80 dark:border-gray-800 overflow-hidden z-50"
          >
            <div className="p-1.5">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group/item"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 shrink-0 mt-0.5 group-hover/item:bg-red-50 dark:group-hover/item:bg-red-950/30 transition-colors">
                    <link.icon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 group-hover/item:text-red-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white leading-none mb-0.5">{link.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

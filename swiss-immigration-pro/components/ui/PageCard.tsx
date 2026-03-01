'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface PageCardProps {
  title: string
  description: string
  url: string
  category?: 'guide' | 'tool' | 'module' | 'service'
}

const CATEGORY_COLORS: Record<string, string> = {
  guide: 'border-l-blue-500',
  tool: 'border-l-green-500',
  module: 'border-l-purple-500',
  service: 'border-l-orange-500',
}

export function PageCard({ title, description, url, category = 'guide' }: PageCardProps) {
  return (
    <Link
      href={url}
      className={cn(
        'block border-l-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group',
        CATEGORY_COLORS[category] || CATEGORY_COLORS.guide,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
            {description}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 flex-shrink-0 transition-colors" />
      </div>
    </Link>
  )
}

'use client'

import { useRef } from 'react'
import { BlogContextMenu } from '@/components/blog/BlogContextMenu'

export function BlogContentWrapper({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={contentRef} className="relative">
      <BlogContextMenu containerRef={contentRef} />
      {children}
    </div>
  )
}

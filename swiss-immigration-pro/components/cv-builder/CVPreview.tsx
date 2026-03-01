'use client'

import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { useMemo, useRef, useState, useEffect } from 'react'
import { getTemplateComponent } from './templates'

export default function CVPreview() {
  const { cvData, activeTemplate } = useCVBuilderStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.55)

  const TemplateComponent = useMemo(() => getTemplateComponent(activeTemplate), [activeTemplate])

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return
      const containerWidth = containerRef.current.clientWidth - 32
      const a4Width = 794
      setScale(Math.min(containerWidth / a4Width, 0.75))
    }
    updateScale()
    const observer = new ResizeObserver(updateScale)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  if (!TemplateComponent) {
    return (
      <div ref={containerRef} className="w-full flex items-center justify-center p-8 text-gray-500">
        Select a template to preview your CV
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <div
        className="origin-top shadow-2xl shadow-slate-900/10 rounded-lg overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700"
        style={{ transform: `scale(${scale})`, width: 794, minHeight: 1123 }}
      >
        <div className="bg-white text-black" style={{ width: 794, minHeight: 1123 }}>
          <TemplateComponent data={cvData} />
        </div>
      </div>
    </div>
  )
}

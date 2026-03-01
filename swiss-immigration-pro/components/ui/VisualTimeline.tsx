'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface TimelineStep {
  month: string
  action: string
}

export default function VisualTimeline({
  steps,
  className,
}: {
  steps: TimelineStep[]
  className?: string
}) {
  return (
    <div className={cn('overflow-x-auto pb-4', className)}>
      <div className="flex items-start gap-0 min-w-max">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="flex flex-col items-center w-36"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md">
                {idx + 1}
              </div>
              <div className="mt-3 text-center">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  {step.month}
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 leading-relaxed px-2">
                  {step.action}
                </p>
              </div>
            </motion.div>
            {idx < steps.length - 1 && (
              <div className="w-12 h-[2px] bg-blue-200 dark:bg-blue-800 mt-5 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

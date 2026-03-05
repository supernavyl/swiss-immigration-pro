'use client'

import { cn } from '@/lib/utils/cn'

interface SectionDividerProps {
  variant: 'wave' | 'diagonal' | 'curve' | 'peak'
  className?: string
  flip?: boolean
}

const PATHS: Record<SectionDividerProps['variant'], string> = {
  wave: 'M0,64 C320,120 640,0 960,64 C1280,128 1440,32 1440,32 L1440,160 L0,160 Z',
  diagonal: 'M0,0 L1440,96 L1440,160 L0,160 Z',
  curve: 'M0,128 Q720,0 1440,128 L1440,160 L0,160 Z',
  peak: 'M0,128 L720,0 L1440,128 L1440,160 L0,160 Z',
}

export default function SectionDivider({
  variant,
  className,
  flip = false,
}: SectionDividerProps): React.ReactElement {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden leading-none -mb-px',
        flip && 'rotate-180',
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="block w-full h-12 sm:h-16 lg:h-24"
      >
        <path d={PATHS[variant]} className="fill-current" />
      </svg>
    </div>
  )
}

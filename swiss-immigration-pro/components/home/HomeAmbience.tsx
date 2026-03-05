'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

interface HomeAmbienceProps {
  children: React.ReactNode
}

export default function HomeAmbience({ children }: HomeAmbienceProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 })
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const handleMove = (e: MouseEvent): void => {
      setMouse({ x: e.clientX, y: e.clientY + window.scrollY })
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [mounted])

  return (
    <div ref={containerRef} className="relative">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
        style={{
          scaleX,
          background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #c026d3 100%)',
        }}
      />

      {/* Cursor spotlight (desktop only) */}
      {mounted && (
        <div
          className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-300 hidden lg:block"
          style={{
            background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y - (typeof window !== 'undefined' ? window.scrollY : 0)}px, rgba(59,130,246,0.05), transparent 80%)`,
          }}
        />
      )}

      {/* Noise grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[2] opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
          animation: 'grain-shift 4s steps(6) infinite',
        }}
      />

      {/* Content */}
      <div className="relative z-[3]">
        {children}
      </div>
    </div>
  )
}

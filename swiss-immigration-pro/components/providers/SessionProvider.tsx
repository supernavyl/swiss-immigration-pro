'use client'

import { AuthProvider } from '@/lib/auth-client'
import { ReactNode } from 'react'

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

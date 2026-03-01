'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react'

// ---------- Types ----------
interface User {
  id: string
  email: string
  name?: string | null
  packId?: string
  isAdmin?: boolean
}

interface Session {
  user: User
  expires: string
}

type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface SessionContextValue {
  data: Session | null
  status: SessionStatus
  update: () => Promise<void>
}

// ---------- Token helpers ----------
const TOKEN_KEY = 'sip_token'
const REFRESH_KEY = 'sip_refresh'
// Refresh the access token when it has less than 2 minutes left
const REFRESH_THRESHOLD_MS = 2 * 60 * 1000

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_KEY)
}

function setTokens(accessToken: string, refreshToken?: string) {
  localStorage.setItem(TOKEN_KEY, accessToken)
  if (refreshToken) {
    localStorage.setItem(REFRESH_KEY, refreshToken)
  }
  document.cookie = `sip_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`
}

function removeTokens() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  document.cookie = 'sip_token=; path=/; max-age=0; SameSite=Lax'
}

function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

// ---------- Token refresh ----------
let refreshPromise: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  // Deduplicate concurrent refresh calls
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return false

    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (!res.ok) {
        removeTokens()
        return false
      }

      const data = await res.json()
      if (data.token) {
        setTokens(data.token, data.refreshToken)
        return true
      }
      return false
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

function isTokenExpiringSoon(token: string): boolean {
  const payload = parseJwt(token)
  if (!payload?.exp) return true
  return payload.exp * 1000 - Date.now() < REFRESH_THRESHOLD_MS
}

// ---------- Context ----------
const SessionContext = createContext<SessionContextValue>({
  data: null,
  status: 'loading',
  update: async () => {},
})

// ---------- Provider (replaces NextAuth SessionProvider) ----------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<SessionStatus>('loading')
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const loadSession = useCallback(async () => {
    let token = getToken()
    if (!token) {
      setSession(null)
      setStatus('unauthenticated')
      return
    }

    const payload = parseJwt(token)
    if (!payload) {
      removeTokens()
      setSession(null)
      setStatus('unauthenticated')
      return
    }

    // If access token is expired or expiring soon, try refresh
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      const refreshed = await refreshAccessToken()
      if (!refreshed) {
        removeTokens()
        setSession(null)
        setStatus('unauthenticated')
        return
      }
      token = getToken()!
      const newPayload = parseJwt(token)
      if (!newPayload) {
        removeTokens()
        setSession(null)
        setStatus('unauthenticated')
        return
      }
      setSessionFromPayload(newPayload)
    } else {
      setSessionFromPayload(payload)
    }

    // Schedule auto-refresh
    scheduleRefresh(token)
  }, [])

  const setSessionFromPayload = (payload: any) => {
    setSession({
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name || payload.email,
        packId: payload.pack_id || 'free',
        isAdmin: payload.is_admin || false,
      },
      expires: new Date(payload.exp * 1000).toISOString(),
    })
    setStatus('authenticated')
  }

  const scheduleRefresh = (token: string) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
    const payload = parseJwt(token)
    if (!payload?.exp) return

    // Refresh 2 minutes before expiry
    const msUntilRefresh = Math.max(payload.exp * 1000 - Date.now() - REFRESH_THRESHOLD_MS, 5000)
    refreshTimerRef.current = setTimeout(async () => {
      const ok = await refreshAccessToken()
      if (ok) {
        const newToken = getToken()
        if (newToken) {
          const p = parseJwt(newToken)
          if (p) {
            setSessionFromPayload(p)
            scheduleRefresh(newToken)
          }
        }
      } else {
        removeTokens()
        setSession(null)
        setStatus('unauthenticated')
      }
    }, msUntilRefresh)
  }

  useEffect(() => {
    loadSession()
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
    }
  }, [loadSession])

  const update = useCallback(async () => {
    await loadSession()
  }, [loadSession])

  return (
    <SessionContext.Provider value={{ data: session, status, update }}>
      {children}
    </SessionContext.Provider>
  )
}

// ---------- Hook (drop-in replacement for next-auth useSession) ----------
export function useSession() {
  return useContext(SessionContext)
}

// ---------- signIn (drop-in replacement) ----------
export async function signIn(
  _provider: string,
  options: { email: string; password: string; redirect?: boolean }
): Promise<{ ok?: boolean; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: options.email, password: options.password }),
    })

    const data = await res.json()

    if (!res.ok || data.error || !data.token) {
      return { error: data.error || data.detail || 'Login failed' }
    }

    setTokens(data.token, data.refreshToken)
    // Trigger a storage event so other tabs sync
    window.dispatchEvent(new Event('storage'))

    return { ok: true }
  } catch (err: any) {
    return { error: err.message || 'Login failed' }
  }
}

// ---------- signOut (drop-in replacement) ----------
export async function signOut(options?: { callbackUrl?: string }) {
  removeTokens()
  window.dispatchEvent(new Event('storage'))
  if (options?.callbackUrl) {
    window.location.href = options.callbackUrl
  } else {
    window.location.href = '/'
  }
}

// ---------- Helper to get auth header for fetch calls ----------
export async function getAuthHeader(): Promise<Record<string, string>> {
  let token = getToken()
  if (!token) return {}

  // Auto-refresh if expiring soon
  if (isTokenExpiringSoon(token)) {
    const ok = await refreshAccessToken()
    if (ok) token = getToken()
  }

  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

// Synchronous version for cases where you can't await
export function getAuthHeaderSync(): Record<string, string> {
  const token = getToken()
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

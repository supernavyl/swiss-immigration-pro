/**
 * Centralized API client with auth headers, error handling, and timeout.
 */

const API_TIMEOUT_MS = 30_000

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
    public body?: unknown,
  ) {
    super(detail)
    this.name = 'ApiError'
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('sip_token') || null
  } catch {
    return null
  }
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

async function request<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...options.headers,
      },
    })

    if (!res.ok) {
      let detail = `HTTP ${res.status}`
      try {
        const body = await res.json()
        detail = body.detail || body.error || body.message || detail
      } catch {
        // response body is not JSON
      }
      throw new ApiError(res.status, detail)
    }

    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return (await res.json()) as T
    }
    return (await res.text()) as unknown as T
  } finally {
    clearTimeout(timer)
  }
}

export const api = {
  get<T = unknown>(url: string, init?: RequestInit) {
    return request<T>(url, { method: 'GET', ...init })
  },

  post<T = unknown>(url: string, body?: unknown, init?: RequestInit) {
    return request<T>(url, {
      method: 'POST',
      body: body != null ? JSON.stringify(body) : undefined,
      ...init,
    })
  },

  put<T = unknown>(url: string, body?: unknown, init?: RequestInit) {
    return request<T>(url, {
      method: 'PUT',
      body: body != null ? JSON.stringify(body) : undefined,
      ...init,
    })
  },

  delete<T = unknown>(url: string, init?: RequestInit) {
    return request<T>(url, { method: 'DELETE', ...init })
  },
}

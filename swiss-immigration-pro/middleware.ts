import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/admin', '/b2b/dashboard', '/b2b/employees', '/b2b/alerts', '/b2b/reports', '/b2b/settings', '/b2b/onboarding', '/modules', '/dashboard', '/profile']
const ADMIN_PATHS = ['/admin']
const LOGIN_PATH = '/auth/login'

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get('sip_token')?.value
  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = LOGIN_PATH
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  const payload = parseJwtPayload(token)
  if (!payload || (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now())) {
    const url = request.nextUrl.clone()
    url.pathname = LOGIN_PATH
    url.searchParams.set('redirect', pathname)
    const response = NextResponse.redirect(url)
    response.cookies.delete('sip_token')
    return response
  }

  const isAdminRoute = ADMIN_PATHS.some((p) => pathname.startsWith(p))
  if (isAdminRoute && !payload.is_admin) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/b2b/dashboard/:path*', '/b2b/employees/:path*', '/b2b/alerts/:path*', '/b2b/reports/:path*', '/b2b/settings/:path*', '/b2b/onboarding/:path*', '/modules/:path*', '/dashboard/:path*', '/profile/:path*'],
}

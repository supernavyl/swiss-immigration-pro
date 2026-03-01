import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'

export async function GET(req: NextRequest) {
  const search = req.nextUrl.search
  const res = await fetch(`${BACKEND}/api/apartments${search}`, {
    headers: {
      ...(req.headers.get('authorization')
        ? { Authorization: req.headers.get('authorization')! }
        : {}),
    },
  })
  const data = await res.json().catch(() => ({ properties: [], total: 0 }))
  return NextResponse.json(data, { status: res.status })
}

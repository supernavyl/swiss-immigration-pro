import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const res = await fetch(`${BACKEND}/api/chatbot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(req.headers.get('authorization')
        ? { Authorization: req.headers.get('authorization')! }
        : {}),
    },
    body,
  })
  const data = await res.json().catch(() => ({ error: 'upstream error' }))
  return NextResponse.json(data, { status: res.status })
}

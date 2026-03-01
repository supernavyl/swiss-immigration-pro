import { NextRequest } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const upstream = await fetch(`${BACKEND}/api/chatbot/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(req.headers.get('authorization')
        ? { Authorization: req.headers.get('authorization')! }
        : {}),
    },
    body,
  })

  // Stream the response directly to the client
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('content-type') || 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  })
}

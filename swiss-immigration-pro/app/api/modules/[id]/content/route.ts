import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getAllModulesForAdmin, getModulePack } from '@/lib/content/pack-content'

// Pack access hierarchy — each pack also grants access to lower packs
const PACK_LEVELS: Record<string, number> = {
  free: 0,
  immigration: 1,
  advanced: 2,
  citizenship: 3,
}

function hasAccess(userPackId: string, modulePackId: string): boolean {
  if (userPackId === 'admin') return true
  const userLevel = PACK_LEVELS[userPackId] ?? -1
  const moduleLevel = PACK_LEVELS[modulePackId] ?? 99
  return userLevel >= moduleLevel
}

/**
 * Verify a HS256 JWT using the shared SECRET_KEY.
 * Returns the payload or null if invalid/expired/tampered.
 */
function verifyJwt(token: string): Record<string, unknown> | null {
  const secret = process.env.SECRET_KEY
  if (!secret) {
    console.error('[modules/content] SECRET_KEY env var not set — rejecting all tokens')
    return null
  }

  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [headerB64, payloadB64, sigB64] = parts

  // Verify HMAC-SHA256 signature using constant-time comparison to prevent timing attacks
  const signingInput = `${headerB64}.${payloadB64}`
  const expected = createHmac('sha256', secret).update(signingInput).digest('base64url')

  try {
    const expectedBuf = Buffer.from(expected)
    const actualBuf = Buffer.from(sigB64)
    if (expectedBuf.length !== actualBuf.length || !timingSafeEqual(expectedBuf, actualBuf)) {
      return null
    }
  } catch {
    return null
  }

  // Decode and parse payload only after signature is verified
  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'))
  } catch {
    return null
  }

  // Check expiry
  if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
    return null
  }

  return payload
}

function stripMarkdown(text: string): string {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`[^`]+`/g, '')
    .trim()
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const auth = request.headers.get('authorization') || ''
  const token = auth.replace('Bearer ', '').trim()

  let packId = 'free'
  let isAdmin = false

  if (token) {
    const payload = verifyJwt(token)
    if (payload) {
      packId = typeof payload.pack_id === 'string' ? payload.pack_id : 'free'
      isAdmin = payload.is_admin === true
    }
    // Invalid/forged token → treat as unauthenticated (free tier)
  }

  const allModules = getAllModulesForAdmin()
  const module = allModules.find(m => m.id === id)

  if (!module) {
    return NextResponse.json({ error: 'Module not found' }, { status: 404 })
  }

  const modulePackId = getModulePack(id)
  if (!hasAccess(isAdmin ? 'admin' : packId, modulePackId)) {
    return NextResponse.json(
      { error: 'Access denied — upgrade your plan to unlock this module' },
      { status: 403 }
    )
  }

  const enhanced = module.enhancedModule

  return NextResponse.json({
    id: module.id,
    title: module.title,
    description: module.description,
    estimatedReadTime: enhanced?.estimatedReadTime || module.duration || null,
    lastUpdated: enhanced?.lastUpdated || null,
    sections: enhanced?.sections?.map((s: { id: string; title: string; content?: string; keyPoints?: string[] }) => ({
      id: s.id,
      title: s.title,
      content: stripMarkdown(s.content || ''),
      keyPoints: s.keyPoints || [],
    })) || [],
    quiz: module.quiz || null,
  })
}

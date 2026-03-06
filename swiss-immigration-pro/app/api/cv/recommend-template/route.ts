import { NextRequest, NextResponse } from 'next/server'

const TEMPLATE_DESCRIPTIONS = `
swiss-classic: Traditional serif layout, conservative and authoritative. Best for: finance, law, government, banking, accounting, audit.
modern-zurich: Clean bold sans-serif, polished business look. Best for: business development, project management, operations, general corporate.
tech-startup: Minimal with strong hierarchy, tech-forward. Best for: software engineers, developers, data scientists, product managers, DevOps.
executive-geneva: Ultra-prestigious layout, commanding presence. Best for: C-suite executives, senior directors, VP+ roles, board positions.
engineering-blue: Technical section emphasis, structured. Best for: mechanical engineers, civil engineers, electrical engineers, STEM roles.
consultant-elite: Two-column structured layout, analytical feel. Best for: management consultants, strategy analysts, business analysts, advisors.
creative-portfolio: Visual-heavy, bold color blocks, dynamic. Best for: graphic designers, UX/UI designers, art directors, creative directors, media.
academic-bern: Publication-ready, dense structured layout. Best for: academics, researchers, PhD candidates, professors, scientists, post-docs.
hospitality-warm: Warm earthy palette, approachable. Best for: hotel management, tourism, event planning, F&B, HR, customer relations.
healthcare-pro: Clean clinical aesthetic, precise. Best for: doctors, nurses, pharmacists, clinical researchers, medical technicians, healthcare admin.
retail-fresh: Energetic, consumer-friendly. Best for: retail managers, sales representatives, customer service, e-commerce, store operations.
finance-lucerne: Authoritative dark palette, numbers-focused. Best for: investment banking, private equity, asset management, CFO roles, financial analysis.
legal-precision: Dense structured layout, detail-oriented. Best for: lawyers, attorneys, compliance officers, legal counsel, paralegal, judicial roles.
minimal-basel: Ultra-minimal whitespace, elegant. Best for: architects, design-conscious industries, luxury brands, high-end consulting, minimalist sectors.
marketing-bold: High contrast, brand-aware, impactful. Best for: marketing managers, brand strategists, PR professionals, communications, growth roles.
`

const TEMPLATE_IDS = [
  'swiss-classic', 'modern-zurich', 'tech-startup', 'executive-geneva',
  'engineering-blue', 'consultant-elite', 'creative-portfolio', 'academic-bern',
  'hospitality-warm', 'healthcare-pro', 'retail-fresh', 'finance-lucerne',
  'legal-precision', 'minimal-basel', 'marketing-bold',
]

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json().catch(() => ({})) as { jobTitle?: string; industry?: string }
  const { jobTitle = '', industry = '' } = body

  if (!jobTitle && !industry) {
    return NextResponse.json({ error: 'jobTitle or industry required' }, { status: 400 })
  }

  const userQuery = [jobTitle, industry].filter(Boolean).join(', ')

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 })
  }

  const systemPrompt = `You are a Swiss CV template expert. Given a job title or industry, recommend the single best CV template from the list below.

Templates:
${TEMPLATE_DESCRIPTIONS}

Respond ONLY with a valid JSON object in this exact format:
{"templateId": "<id>", "reason": "<one sentence why this template fits>", "confidence": <number 0.7-1.0>}

The templateId MUST be one of: ${TEMPLATE_IDS.join(', ')}`

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Recommend a template for: ${userQuery}` },
      ],
      temperature: 0.2,
      max_tokens: 120,
    }),
  }).catch(() => null)

  if (!groqRes?.ok) {
    return NextResponse.json({ error: 'AI service error' }, { status: 502 })
  }

  const groqData = await groqRes.json() as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const raw = groqData.choices?.[0]?.message?.content?.trim() ?? ''

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(jsonMatch?.[0] ?? raw) as {
      templateId?: string
      reason?: string
      confidence?: number
    }
    const templateId = TEMPLATE_IDS.includes(parsed.templateId ?? '') ? parsed.templateId : 'modern-zurich'
    return NextResponse.json({
      templateId,
      reason: parsed.reason ?? 'Best fit for your target role.',
      confidence: parsed.confidence ?? 0.8,
    })
  } catch {
    return NextResponse.json({ templateId: 'modern-zurich', reason: 'General professional template.', confidence: 0.7 })
  }
}

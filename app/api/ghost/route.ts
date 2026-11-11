import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '../../../lib/server/session'
import { rateLimit } from '../../../lib/server/ratelimit'
import { buildProfile } from '../../../lib/server/profile'
import { ensureSchema } from '../../../lib/server/schema'
import { GHOST_FALLBACK_MODEL, GHOST_MODEL, buildChatPrompt, taskPrompt, Learner, SurfaceContext } from '../../../lib/ghost/prompt'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

type Msg = { role: 'user' | 'assistant'; content: string }

// POST /api/ghost  { messages, path?, mode?: 'chat' | 'attack-narrative' | 'report', context? }
// The system prompt is always assembled here; the browser only sends the conversation and where it is.
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req)
    if (!user) return NextResponse.json({ error: 'Sign in to talk to GHOST.' }, { status: 401 })
    await ensureSchema()

    if (!(await rateLimit('ghost:burst:' + user.id, 20, 600))) return NextResponse.json({ error: 'Slow down a little: try again in a few minutes.' }, { status: 429 })
    if (!(await rateLimit('ghost:day:' + user.id, 200, 86400))) return NextResponse.json({ error: 'Daily GHOST limit reached. It resets tomorrow.' }, { status: 429 })

    const body = await req.json().catch(() => ({}))
    const mode = typeof body.mode === 'string' ? body.mode : 'chat'
    const raw = Array.isArray(body.messages) ? body.messages : null
    if (!raw || raw.length === 0 || raw.length > 40) return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    const messages: Msg[] = []
    for (const m of raw) {
      if ((m?.role !== 'user' && m?.role !== 'assistant') || typeof m.content !== 'string' || m.content.length > 6000) {
        return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
      }
      messages.push({ role: m.role, content: m.content })
    }
    // Keep the last 12 turns to bound cost.
    const recent = messages.slice(-12)

    let system: string
    if (mode === 'chat') {
      const p = await buildProfile(user.id)
      const learner: Learner | null = p ? {
        username: p.username, xp: p.xp, skill_level: p.skill_level, labs_completed: p.labs_completed,
        chapters_read: p.chapters_read, goal: p.goal, modules: p.modules.map(m => ({ id: m.id, percent: m.percent })),
      } : null
      const path = typeof body.path === 'string' ? body.path.slice(0, 120) : '/'
      const ctx = body.context && typeof body.context === 'object' ? (body.context as SurfaceContext) : null
      system = buildChatPrompt(path, learner, ctx)
    } else {
      const t = taskPrompt(mode)
      if (!t) return NextResponse.json({ error: 'Unknown mode' }, { status: 400 })
      system = t
    }

    const apiKey = process.env.GROQ_API_KEY || ''
    if (!apiKey) return NextResponse.json({ error: 'GHOST is not configured yet.' }, { status: 503 })

    const call = (model: string) => fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      signal: req.signal,
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
      body: JSON.stringify({
        model,
        max_completion_tokens: mode === 'chat' ? 2048 : 3000,
        temperature: 0.4,
        reasoning_effort: 'low',
        include_reasoning: false,
        messages: [{ role: 'system', content: system }, ...recent],
      }),
    })

    let res = await call(GHOST_MODEL)
    let data = await res.json().catch(() => ({}))
    // If the primary model is retired or unavailable, fall back once.
    if (!res.ok && (res.status === 404 || res.status === 400 || res.status === 503) && GHOST_FALLBACK_MODEL !== GHOST_MODEL) {
      console.error('[ghost] primary model failed', res.status, data?.error?.message)
      res = await call(GHOST_FALLBACK_MODEL)
      data = await res.json().catch(() => ({}))
    }
    if (!res.ok) {
      console.error('[ghost] groq error', res.status, data?.error?.message)
      return NextResponse.json({ error: res.status === 429 ? 'GHOST is busy right now. Try again in a minute.' : 'GHOST could not answer right now.' }, { status: 502 })
    }
    const text: string = data.choices?.[0]?.message?.content || ''
    return NextResponse.json({ text })
  } catch (err) {
    if ((err as { name?: string })?.name === 'AbortError') return NextResponse.json({ error: 'Cancelled' }, { status: 499 })
    console.error('[ghost]', err)
    return NextResponse.json({ error: 'GHOST could not answer right now.' }, { status: 500 })
  }
}

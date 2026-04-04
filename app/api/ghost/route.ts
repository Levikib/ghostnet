import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

// Per-session in-memory rate limit: max 60 requests per rolling hour per user/IP.
// Simple map — resets on server restart. Sufficient for the Groq free tier (14,400/day).
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT = 60                  // requests per hour per identity

const rateLimitMap = new Map<string, { count: number; windowStart: number }>()

function checkRateLimit(identity: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(identity)
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateLimitMap.set(identity, { count: 1, windowStart: now })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    // Require authentication — Ghost Agent is for authenticated operators only
    const authClient = createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit by user ID
    if (!checkRateLimit(user.id)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 })
    }

    const body = await req.json()
    const { messages, systemPrompt } = body

    // Validate inputs
    if (!Array.isArray(messages) || messages.length > 40) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    for (const msg of messages) {
      if (typeof msg.content !== 'string' || msg.content.length > 4000) {
        return NextResponse.json({ error: 'Message content too long' }, { status: 400 })
      }
      if (msg.role !== 'user' && msg.role !== 'assistant') {
        return NextResponse.json({ error: 'Invalid message role' }, { status: 400 })
      }
    }

    if (typeof systemPrompt !== 'string' || systemPrompt.length > 8000) {
      return NextResponse.json({ error: 'Invalid systemPrompt' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY || ''
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 })
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 2048, // Capped server-side — client cannot override
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Groq API error' }, { status: response.status })
    }

    const text = data.choices?.[0]?.message?.content || ''
    return NextResponse.json({ text })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

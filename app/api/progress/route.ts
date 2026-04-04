import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '../../../lib/supabase-server'
import { createClient } from '../../../lib/supabase/server'

// Canonical XP rewards per lab — single source of truth for server-side validation.
// Client-submitted xp_earned is checked against this table; any value not matching is rejected.
const LAB_XP: Record<string, number> = {
  'tor-lab':                345,
  'osint-lab':              305,
  'crypto-lab':             405,
  'offensive-lab':          400,
  'active-directory-lab':   495,
  'web-attacks-lab':        445,
  'malware-lab':            465,
  'network-attacks-lab':    445,
  'cloud-security-lab':     490,
  'social-engineering-lab': 300,
  'red-team-lab':           465,
  'wireless-attacks-lab':   455,
  'mobile-security-lab':    435,
}

// GET /api/progress?user_id=xxx  — fetch all lab progress for a user (own data only)
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('user_id')
  if (!userId) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  try {
    // Verify the caller is authenticated and requesting their own data
    const authClient = createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('lab_progress')
      .select('*')
      .eq('user_id', userId)
    if (error) throw error
    return NextResponse.json({ progress: data })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

// POST /api/progress — mark a lab complete and award XP
export async function POST(req: NextRequest) {
  try {
    // Verify the caller is authenticated
    const authClient = createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { user_id, lab_id, module_id, xp_earned, notes } = body

    if (!user_id || !lab_id || !module_id) {
      return NextResponse.json({ error: 'user_id, lab_id, module_id required' }, { status: 400 })
    }

    // Caller can only submit progress for themselves
    if (user.id !== user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Validate lab_id is known and XP matches the server-authoritative value
    const authorativeXp = LAB_XP[lab_id as string]
    if (authorativeXp === undefined) {
      return NextResponse.json({ error: 'Unknown lab_id' }, { status: 400 })
    }
    // Accept the server value regardless of what the client sent
    const validatedXp = authorativeXp

    const supabase = createServerClient()

    // Upsert lab progress
    const { data: existing } = await supabase
      .from('lab_progress')
      .select('id, completed, xp_earned')
      .eq('user_id', user_id)
      .eq('lab_id', lab_id)
      .single()

    const alreadyCompleted = existing?.completed === true

    const { error: upsertError } = await supabase
      .from('lab_progress')
      .upsert({
        user_id,
        lab_id,
        module_id,
        completed: true,
        xp_earned: alreadyCompleted ? (existing?.xp_earned || 0) : validatedXp,
        completed_at: alreadyCompleted ? undefined : new Date().toISOString(),
        attempts: 1,
        notes: notes || null,
      }, { onConflict: 'user_id,lab_id' })

    if (upsertError) throw upsertError

    // Only award XP if this is a fresh completion
    if (!alreadyCompleted) {
      await supabase.rpc('update_xp_and_rank', {
        p_user_id: user_id,
        p_xp_delta: validatedXp,
      })
    }

    return NextResponse.json({ success: true, xp_awarded: alreadyCompleted ? 0 : validatedXp })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

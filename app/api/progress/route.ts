import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '../../../lib/supabase-server'

// GET /api/progress?user_id=xxx  — fetch all lab progress for a user
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('user_id')
  if (!userId) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  try {
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
    const body = await req.json()
    const { user_id, lab_id, module_id, xp_earned, notes } = body

    if (!user_id || !lab_id || !module_id) {
      return NextResponse.json({ error: 'user_id, lab_id, module_id required' }, { status: 400 })
    }

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
        xp_earned: alreadyCompleted ? (existing?.xp_earned || 0) : (xp_earned || 0),
        completed_at: alreadyCompleted ? undefined : new Date().toISOString(),
        attempts: 1,
        notes: notes || null,
      }, { onConflict: 'user_id,lab_id' })

    if (upsertError) throw upsertError

    // Only award XP if this is a fresh completion
    if (!alreadyCompleted && xp_earned > 0) {
      await supabase.rpc('update_xp_and_rank', {
        p_user_id: user_id,
        p_xp_delta: xp_earned,
      })
    }

    return NextResponse.json({ success: true, xp_awarded: alreadyCompleted ? 0 : (xp_earned || 0) })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

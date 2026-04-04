import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { createServerClient } from '../../../lib/supabase-server'

// GET /api/admin — returns { isAdmin: bool } for the current session user.
// Admin email list lives in ADMIN_EMAILS (server-only, never NEXT_PUBLIC_).
// Falls back to NEXT_PUBLIC_ADMIN_EMAIL for backwards compatibility with existing deployments.
export async function GET() {
  try {
    const authClient = createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ isAdmin: false }, { status: 401 })

    const adminEnv = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
    const adminEmails = adminEnv.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    const isAdmin = adminEmails.includes((user.email || '').toLowerCase())

    return NextResponse.json({ isAdmin })
  } catch {
    return NextResponse.json({ isAdmin: false }, { status: 500 })
  }
}

// GET /api/admin/users — full user list for admin panel
export async function POST() {
  try {
    // Verify admin status server-side before returning any data
    const authClient = createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminEnv = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
    const adminEmails = adminEnv.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    if (!adminEmails.includes((user.email || '').toLowerCase())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Use service role only after admin is verified server-side
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, username, email, ghost_rank, xp, streak_days, last_active, created_at')
      .order('xp', { ascending: false })
    if (error) throw error

    return NextResponse.json({ users: data })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

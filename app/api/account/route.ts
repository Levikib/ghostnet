import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { createServerClient } from '../../../lib/supabase-server'

// DELETE /api/account — permanently deletes the authenticated user's account.
// Cascades: user_profiles, lab_progress, user_badges, ghost_memory, lab_results
// are all ON DELETE CASCADE from auth.users, so deleting the auth user is sufficient.
export async function DELETE() {
  try {
    // Verify session
    const authClient = createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Use service role to delete from auth.users (anon key cannot do this)
    const admin = createServerClient()

    // Log the deletion before it happens
    try {
      await admin.rpc('log_audit_event', {
        p_user_id: user.id,
        p_event: 'account_deleted',
        p_data: { email_hint: user.email?.split('@')[1] ?? 'unknown' },
      })
    } catch { /* non-blocking — don't fail deletion if audit fails */ }

    // Delete user from Supabase Auth — cascades all DB rows automatically
    const { error } = await admin.auth.admin.deleteUser(user.id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

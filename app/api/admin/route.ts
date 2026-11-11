import { NextRequest } from 'next/server'
import { sql } from '../../../lib/server/db'
import { getSessionUser } from '../../../lib/server/session'
import { fail, json } from '../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Admins: role admin/super_admin, or an email listed in ADMIN_EMAILS (server-only env). */
async function adminFrom(req: NextRequest) {
  const s = await getSessionUser(req)
  if (!s) return null
  const list = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
  const isAdmin = s.role === 'admin' || s.role === 'super_admin' || list.includes(s.email.toLowerCase())
  return isAdmin ? s : null
}

// GET /api/admin -> { isAdmin }
export async function GET(req: NextRequest) {
  return json({ isAdmin: !!(await adminFrom(req)) })
}

// POST /api/admin -> operator list with progress (admin only)
export async function POST(req: NextRequest) {
  const a = await adminFrom(req)
  if (!a) return fail('Forbidden', 403)
  const users = await sql(
    `SELECT u.id, u.username, u.email, u.role, u.xp, u.streak_days, u.created_at, u.last_login_at, u.email_verified_at IS NOT NULL AS verified,
            u.totp_enabled_at IS NOT NULL AS two_factor,
            (SELECT count(*)::int FROM lab_progress l WHERE l.user_id = u.id AND l.completed) AS labs_completed
       FROM users u ORDER BY u.created_at DESC LIMIT 500`)
  return json({ users })
}

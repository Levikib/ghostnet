import { NextRequest } from 'next/server'
import { clearSessionCookies, getSessionUser, revokeSession } from '../../../../lib/server/session'
import { audit, json } from '../../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/auth/logout  -> revokes this session server-side and clears cookies
export async function POST(req: NextRequest) {
  const res = json({ ok: true })
  try {
    const user = await getSessionUser(req)
    if (user) {
      await revokeSession(user.session_id)
      audit(req, 'logout', user.id, user.email)
    }
  } catch {
    // still clear cookies
  }
  clearSessionCookies(res)
  return res
}

import { NextRequest } from 'next/server'
import { getSessionUser } from '../../../../lib/server/session'
import { buildProfile } from '../../../../lib/server/profile'
import { json } from '../../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/auth/me -> { user: ProfilePayload | null }
export async function GET(req: NextRequest) {
  try {
    const s = await getSessionUser(req)
    if (!s) return json({ user: null })
    return json({ user: await buildProfile(s.id) })
  } catch (e) {
    console.error('[me]', e)
    return json({ user: null, error: 'unavailable' }, 503)
  }
}

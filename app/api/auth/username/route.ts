import { NextRequest } from 'next/server'
import { one } from '../../../../lib/server/db'
import { rateLimit } from '../../../../lib/server/ratelimit'
import { clientIp } from '../../../../lib/server/request'
import { boot, checkUsername, json } from '../../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/auth/username?u=callsign  -> { available, error? }   (live check while typing)
export async function GET(req: NextRequest) {
  await boot()
  if (!(await rateLimit('uname:ip:' + clientIp(req), 60, 60))) return json({ available: false, error: 'Slow down a little.' }, 429)
  const u = (req.nextUrl.searchParams.get('u') || '').trim()
  const err = checkUsername(u)
  if (err) return json({ available: false, error: err })
  const row = await one(`SELECT 1 FROM users WHERE username = $1 AND email_verified_at IS NOT NULL`, [u])
  return json({ available: !row, error: row ? 'That callsign is already taken.' : undefined })
}

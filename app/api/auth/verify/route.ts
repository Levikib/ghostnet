import { NextRequest } from 'next/server'
import { sql } from '../../../../lib/server/db'
import { rateLimit } from '../../../../lib/server/ratelimit'
import { clientIp } from '../../../../lib/server/request'
import { audit, boot, codeError, completeLogin, consumeCode, fail, findUserByEmail, normEmail, readJson } from '../../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/auth/verify  { email, code }  -> activates the account and signs it in
export async function POST(req: NextRequest) {
  try {
    await boot()
    if (!(await rateLimit('verify:ip:' + clientIp(req), 30, 600))) return fail('Too many attempts. Slow down and try again shortly.', 429)
    const body = await readJson<{ email: string; code: string }>(req)
    const email = normEmail(body.email)
    const user = await findUserByEmail(email)
    if (!user) return fail(codeError('expired'), 400)

    const r = await consumeCode(email, 'verify', body.code)
    if (r !== 'ok') {
      audit(req, 'verify_failed', user.id, email, { reason: r })
      return fail(codeError(r), 400, { reason: r })
    }
    if (!user.email_verified_at) await sql(`UPDATE users SET email_verified_at = now() WHERE id = $1`, [user.id])
    audit(req, 'email_verified', user.id, email)
    return completeLogin(req, user)
  } catch (e) {
    console.error('[verify]', e)
    return fail('Something went wrong on our side. Try again.', 500)
  }
}

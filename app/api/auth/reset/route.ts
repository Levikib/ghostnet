import { NextRequest } from 'next/server'
import { sql } from '../../../../lib/server/db'
import { hashPassword } from '../../../../lib/server/crypto'
import { rateLimit } from '../../../../lib/server/ratelimit'
import { clientIp } from '../../../../lib/server/request'
import { revokeAllSessions } from '../../../../lib/server/session'
import { securityNoticeMail, sendMail } from '../../../../lib/server/mailer'
import { audit, boot, checkPassword, codeError, consumeCode, fail, findUserByEmail, json, normEmail, readJson } from '../../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/auth/reset  { email, code, password }
// Sets a new password, signs out every session, unlocks the account. The user then signs in fresh.
export async function POST(req: NextRequest) {
  try {
    await boot()
    if (!(await rateLimit('reset:ip:' + clientIp(req), 20, 600))) return fail('Too many attempts. Wait a few minutes.', 429)
    const body = await readJson<{ email: string; code: string; password: string }>(req)
    const email = normEmail(body.email)
    const user = await findUserByEmail(email)
    if (!user) return fail(codeError('expired'))
    const pErr = checkPassword(body.password, email, user.username)
    if (pErr) return fail(pErr, 400, { field: 'password' })

    const r = await consumeCode(email, 'reset', body.code)
    if (r !== 'ok') return fail(codeError(r), 400, { reason: r })

    await sql(
      `UPDATE users SET password_hash = $2, password_changed_at = now(), failed_logins = 0, locked_until = NULL, updated_at = now() WHERE id = $1`,
      [user.id, await hashPassword(body.password as string)],
    )
    await revokeAllSessions(user.id)
    audit(req, 'password_reset', user.id, email)
    sendMail(securityNoticeMail(email, 'your password was reset and every session was signed out')).catch(() => {})
    return json({ ok: true })
  } catch (e) {
    console.error('[reset]', e)
    return fail('Something went wrong on our side. Try again.', 500)
  }
}

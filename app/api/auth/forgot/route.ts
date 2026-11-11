import { NextRequest } from 'next/server'
import { rateLimit } from '../../../../lib/server/ratelimit'
import { clientIp } from '../../../../lib/server/request'
import { resetMail, sendMail } from '../../../../lib/server/mailer'
import { audit, boot, fail, findUserByEmail, issueCode, json, normEmail, readJson } from '../../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/auth/forgot  { email }  -> always { ok: true } (no account enumeration)
export async function POST(req: NextRequest) {
  try {
    await boot()
    if (!(await rateLimit('forgot:ip:' + clientIp(req), 8, 600))) return fail('Too many requests. Try again in a few minutes.', 429)
    const body = await readJson<{ email: string }>(req)
    const email = normEmail(body.email)
    const user = await findUserByEmail(email)
    if (user?.email_verified_at) {
      const code = await issueCode(email, 'reset', user.id)
      if (code) {
        await sendMail(resetMail(email, code))
        audit(req, 'reset_requested', user.id, email)
      }
    }
    return json({ ok: true })
  } catch (e) {
    console.error('[forgot]', e)
    return fail('We could not send the email right now. Try again in a minute.', 502)
  }
}

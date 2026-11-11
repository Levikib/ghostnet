import { NextRequest } from 'next/server'
import { rateLimit } from '../../../../lib/server/ratelimit'
import { clientIp } from '../../../../lib/server/request'
import { resetMail, sendMail, verifyEmailMail } from '../../../../lib/server/mailer'
import { boot, fail, findUserByEmail, issueCode, json, normEmail, readJson } from '../../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/auth/resend  { email, purpose: 'verify' | 'reset' }
// Always answers ok (no account enumeration); only sends when it makes sense.
export async function POST(req: NextRequest) {
  try {
    await boot()
    if (!(await rateLimit('resend:ip:' + clientIp(req), 10, 600))) return fail('Too many requests. Try again in a few minutes.', 429)
    const body = await readJson<{ email: string; purpose: string }>(req)
    const email = normEmail(body.email)
    const purpose = body.purpose === 'reset' ? 'reset' : 'verify'
    const user = await findUserByEmail(email)
    if (user && (purpose === 'reset' ? !!user.email_verified_at : !user.email_verified_at)) {
      const code = await issueCode(email, purpose, user.id)
      if (!code) return fail('You have asked for several codes already. Wait a few minutes.', 429)
      await sendMail(purpose === 'reset' ? resetMail(email, code) : verifyEmailMail(email, user.username, code))
    }
    return json({ ok: true })
  } catch (e) {
    console.error('[resend]', e)
    return fail('We could not send the email right now. Try again in a minute.', 502)
  }
}

import { NextRequest } from 'next/server'
import { sql } from '../../../../lib/server/db'
import { burnPasswordTime, hashPassword, randomToken, sha256, verifyPassword } from '../../../../lib/server/crypto'
import { rateLimit } from '../../../../lib/server/ratelimit'
import { clientIp } from '../../../../lib/server/request'
import { sendMail, verifyEmailMail } from '../../../../lib/server/mailer'
import { audit, boot, completeLogin, fail, findUserByEmail, issueCode, json, normEmail, readJson, recordFailedLogin } from '../../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DENIED = 'Access denied. Email or password is incorrect.'

// POST /api/auth/login  { email, password }
// -> { next: 'done' | 'onboard' } with a session cookie, or { next: 'mfa', challenge }, or { next: 'verify' }
export async function POST(req: NextRequest) {
  try {
    await boot()
    const ip = clientIp(req)
    if (!(await rateLimit('login:ip:' + ip, 25, 600))) return fail('Too many sign-in attempts from this network. Wait 10 minutes.', 429)

    const body = await readJson<{ email: string; password: string }>(req)
    const email = normEmail(body.email)
    const password = typeof body.password === 'string' ? body.password : ''
    if (!email || !password) return fail('Enter your email and password.')
    if (!(await rateLimit('login:email:' + email, 12, 600))) return fail('Too many attempts for this account. Wait 10 minutes.', 429)

    const user = await findUserByEmail(email)
    if (!user) {
      await burnPasswordTime(password)
      audit(req, 'login_unknown', null, email)
      return fail(DENIED, 401)
    }
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const mins = Math.ceil((new Date(user.locked_until).getTime() - Date.now()) / 60000)
      return fail('Account temporarily locked after repeated failed attempts. Try again in ' + mins + ' minute' + (mins === 1 ? '' : 's') + ', or reset your password.', 423)
    }

    const { ok, rehash } = await verifyPassword(password, user.password_hash)
    if (!ok) {
      const lock = await recordFailedLogin(user)
      audit(req, 'login_failed', user.id, email)
      return fail(lock ? 'Too many failed attempts. Account locked for ' + lock + ' minutes.' : DENIED, lock ? 423 : 401)
    }
    if (rehash) sql(`UPDATE users SET password_hash = $2 WHERE id = $1`, [user.id, await hashPassword(password)]).catch(() => {})

    if (!user.email_verified_at) {
      const code = await issueCode(email, 'verify', user.id)
      if (code) await sendMail(verifyEmailMail(email, user.username, code)).catch(() => {})
      return json({ ok: true, next: 'verify', email })
    }

    if (user.totp_enabled_at) {
      const token = randomToken(24)
      await sql(`INSERT INTO mfa_challenges (user_id, token_hash, expires_at) VALUES ($1, $2, now() + interval '5 minutes')`, [user.id, sha256(token)])
      audit(req, 'mfa_challenge', user.id, email)
      return json({ ok: true, next: 'mfa', challenge: token })
    }

    return completeLogin(req, user)
  } catch (e) {
    console.error('[login]', e)
    return fail('Something went wrong on our side. Try again.', 500)
  }
}

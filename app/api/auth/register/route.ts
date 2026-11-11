import { NextRequest } from 'next/server'
import { one, sql, isUniqueViolation } from '../../../../lib/server/db'
import { hashPassword } from '../../../../lib/server/crypto'
import { rateLimit } from '../../../../lib/server/ratelimit'
import { clientIp } from '../../../../lib/server/request'
import { existingAccountMail, sendMail, verifyEmailMail } from '../../../../lib/server/mailer'
import { audit, boot, checkEmail, checkPassword, checkUsername, fail, findUserByEmail, issueCode, json, normEmail, readJson } from '../../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/auth/register  { email, username, password }
// Creates an unverified identity and emails a 6-digit code. The account cannot sign in until the code is entered.
export async function POST(req: NextRequest) {
  try {
    await boot()
    if (!(await rateLimit('reg:ip:' + clientIp(req), 8, 3600))) return fail('Too many sign-ups from this network. Try again in an hour.', 429)

    const body = await readJson<{ email: string; username: string; password: string }>(req)
    const email = normEmail(body.email)
    const username = typeof body.username === 'string' ? body.username.trim() : ''
    const password = body.password

    const eErr = await checkEmail(email)
    if (eErr) return fail(eErr, 400, { field: 'email' })
    const uErr = checkUsername(username)
    if (uErr) return fail(uErr, 400, { field: 'username' })
    const pErr = checkPassword(password, email, username)
    if (pErr) return fail(pErr, 400, { field: 'password' })

    const existing = await findUserByEmail(email)
    if (existing?.email_verified_at) {
      // Don't reveal that the email is registered: same response, and tell the owner.
      sendMail(existingAccountMail(email)).catch(() => {})
      audit(req, 'register_existing', existing.id, email)
      return json({ ok: true, next: 'verify', email })
    }

    // A callsign held by an unverified sign-up older than a day is released.
    await sql(`DELETE FROM users WHERE username = $1 AND email <> $2 AND email_verified_at IS NULL AND created_at < now() - interval '1 day'`, [username, email])
    const taken = await one<{ id: string }>(`SELECT id FROM users WHERE username = $1 AND email <> $2`, [username, email])
    if (taken) return fail('That callsign is already taken.', 409, { field: 'username' })

    const hash = await hashPassword(password as string)
    let userId: string
    try {
      if (existing) {
        await sql(`UPDATE users SET username = $2, password_hash = $3, updated_at = now() WHERE id = $1`, [existing.id, username, hash])
        userId = existing.id
      } else {
        const row = await one<{ id: string }>(
          `INSERT INTO users (email, username, display_name, password_hash, avatar_seed, password_changed_at) VALUES ($1, $2, $2, $3, $4, now()) RETURNING id`,
          [email, username, hash, username + ':' + Date.now().toString(36)],
        )
        userId = row!.id
      }
    } catch (e) {
      if (isUniqueViolation(e)) return fail('That callsign is already taken.', 409, { field: 'username' })
      throw e
    }

    const code = await issueCode(email, 'verify', userId)
    if (!code) return fail('Too many codes requested. Wait a few minutes, then try again.', 429)
    try {
      await sendMail(verifyEmailMail(email, username, code))
    } catch (e) {
      console.error('[register] email failed', e instanceof Error ? e.message : e)
      return fail('We could not send the verification email right now. Try again in a minute.', 502)
    }
    audit(req, 'register', userId, email)
    return json({ ok: true, next: 'verify', email })
  } catch (e) {
    console.error('[register]', e)
    return fail('Something went wrong on our side. Try again.', 500)
  }
}

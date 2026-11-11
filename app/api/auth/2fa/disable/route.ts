import { NextRequest } from 'next/server'
import { one, sql } from '../../../../../lib/server/db'
import { decrypt, verifyPassword } from '../../../../../lib/server/crypto'
import { verifyTotp } from '../../../../../lib/server/totp'
import { getSessionUser } from '../../../../../lib/server/session'
import { securityNoticeMail, sendMail } from '../../../../../lib/server/mailer'
import { audit, fail, json, readJson } from '../../../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/auth/2fa/disable { password, code } -> needs both the password and a current authenticator code.
export async function POST(req: NextRequest) {
  const s = await getSessionUser(req)
  if (!s) return fail('Sign in first.', 401)
  const b = await readJson<{ password: string; code: string }>(req)
  const u = await one<{ password_hash: string; totp_secret: string | null }>(`SELECT password_hash, totp_secret FROM users WHERE id = $1`, [s.id])
  if (!u?.totp_secret) return fail('Two-factor is not on.', 400)
  const pw = await verifyPassword(String(b.password || ''), u.password_hash)
  if (!pw.ok) return fail('Password is incorrect.', 401)
  if (verifyTotp(decrypt(u.totp_secret), String(b.code || '')) === null) return fail('Authenticator code is not valid.', 401)
  await sql(`UPDATE users SET totp_secret = NULL, totp_pending = NULL, totp_enabled_at = NULL, totp_last_step = NULL WHERE id = $1`, [s.id])
  await sql(`DELETE FROM backup_codes WHERE user_id = $1`, [s.id])
  audit(req, '2fa_disabled', s.id, s.email)
  sendMail(securityNoticeMail(s.email, 'two-factor authentication was turned off')).catch(() => {})
  return json({ ok: true })
}

import { NextRequest } from 'next/server'
import { one, sql } from '../../../../../lib/server/db'
import { backupCode, codeHash, decrypt } from '../../../../../lib/server/crypto'
import { verifyTotp } from '../../../../../lib/server/totp'
import { getSessionUser, revokeAllSessions } from '../../../../../lib/server/session'
import { securityNoticeMail, sendMail } from '../../../../../lib/server/mailer'
import { audit, fail, json, readJson } from '../../../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/auth/2fa/enable { code } -> turns 2FA on and returns 10 one-time backup codes (shown once).
export async function POST(req: NextRequest) {
  const s = await getSessionUser(req)
  if (!s) return fail('Sign in first.', 401)
  const b = await readJson<{ code: string }>(req)
  const row = await one<{ totp_pending: string | null }>(`SELECT totp_pending FROM users WHERE id = $1`, [s.id])
  if (!row?.totp_pending) return fail('Start the setup again.', 400)
  const secret = decrypt(row.totp_pending)
  const step = verifyTotp(secret, String(b.code || ''))
  if (step === null) return fail('That code does not match. Make sure your phone clock is set automatically, then try the newest code.', 400)

  await sql(
    `UPDATE users SET totp_secret = totp_pending, totp_pending = NULL, totp_enabled_at = now(), totp_last_step = $2 WHERE id = $1`,
    [s.id, step],
  )
  await sql(`DELETE FROM backup_codes WHERE user_id = $1`, [s.id])
  const codes = Array.from({ length: 10 }, () => backupCode())
  for (const c of codes) await sql(`INSERT INTO backup_codes (user_id, code_hash) VALUES ($1, $2)`, [s.id, codeHash(c)])
  // Other devices must prove the second factor too.
  await revokeAllSessions(s.id, s.session_id)
  audit(req, '2fa_enabled', s.id, s.email)
  sendMail(securityNoticeMail(s.email, 'two-factor authentication was turned on')).catch(() => {})
  return json({ ok: true, backupCodes: codes })
}

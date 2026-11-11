import { NextRequest } from 'next/server'
import { one, sql } from '../../../../lib/server/db'
import { codeHash, decrypt, safeEqualHex, sha256 } from '../../../../lib/server/crypto'
import { verifyTotp } from '../../../../lib/server/totp'
import { rateLimit } from '../../../../lib/server/ratelimit'
import { clientIp } from '../../../../lib/server/request'
import { audit, boot, completeLogin, fail, readJson, UserRow } from '../../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/auth/mfa  { challenge, code }   code = 6-digit authenticator code or a backup code (XXXXX-XXXXX)
export async function POST(req: NextRequest) {
  try {
    await boot()
    if (!(await rateLimit('mfa:ip:' + clientIp(req), 20, 600))) return fail('Too many attempts. Wait a few minutes.', 429)
    const body = await readJson<{ challenge: string; code: string }>(req)
    const challenge = typeof body.challenge === 'string' ? body.challenge : ''
    const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : ''
    if (!challenge || !code) return fail('Enter the code from your authenticator app.')

    const ch = await one<{ id: string; user_id: string; attempts: number }>(
      `SELECT id, user_id, attempts FROM mfa_challenges WHERE token_hash = $1 AND consumed_at IS NULL AND expires_at > now()`,
      [sha256(challenge)],
    )
    if (!ch) return fail('This sign-in step expired. Sign in again.', 401, { restart: true })
    if (ch.attempts >= 5) return fail('Too many wrong codes. Sign in again.', 401, { restart: true })

    const user = await one<UserRow & { totp_last_step: number | null }>(`SELECT * FROM users WHERE id = $1`, [ch.user_id])
    if (!user || !user.totp_secret) return fail('Two-factor is not set up for this account.', 400, { restart: true })

    let ok = false
    let method = 'totp'
    if (/^\d{6}$/.test(code.replace(/\s/g, ''))) {
      const step = verifyTotp(decrypt(user.totp_secret), code)
      // Replay protection: a code (time step) can only be used once.
      if (step !== null && (user.totp_last_step === null || step > Number(user.totp_last_step))) {
        ok = true
        await sql(`UPDATE users SET totp_last_step = $2 WHERE id = $1`, [user.id, step])
      }
    } else if (/^[A-Z0-9]{5}-?[A-Z0-9]{5}$/.test(code)) {
      method = 'backup'
      const norm = code.replace('-', '').replace(/^(.{5})/, '$1-')
      const rows = await sql<{ id: string; code_hash: string }>(`SELECT id, code_hash FROM backup_codes WHERE user_id = $1 AND used_at IS NULL`, [user.id])
      const h = codeHash(norm)
      const hit = rows.find(r => safeEqualHex(r.code_hash, h))
      if (hit) {
        ok = true
        await sql(`UPDATE backup_codes SET used_at = now() WHERE id = $1`, [hit.id])
      }
    }

    if (!ok) {
      await sql(`UPDATE mfa_challenges SET attempts = attempts + 1 WHERE id = $1`, [ch.id])
      audit(req, 'mfa_failed', user.id, user.email)
      return fail('That code is not valid. Check your authenticator app and try again.', 401)
    }
    await sql(`UPDATE mfa_challenges SET consumed_at = now() WHERE id = $1`, [ch.id])
    audit(req, 'mfa_passed', user.id, user.email, { method })
    const left = method === 'backup' ? (await one<{ n: number }>(`SELECT count(*)::int AS n FROM backup_codes WHERE user_id = $1 AND used_at IS NULL`, [user.id]))?.n : undefined
    return completeLogin(req, user, left !== undefined ? { backupCodesLeft: left } : {})
  } catch (e) {
    console.error('[mfa]', e)
    return fail('Something went wrong on our side. Try again.', 500)
  }
}

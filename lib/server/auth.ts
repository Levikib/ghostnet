import { NextRequest, NextResponse } from 'next/server'
import { resolveMx } from 'node:dns/promises'
import { one, sql } from './db'
import { ensureSchema } from './schema'
import { codeHash, safeEqualHex, sixDigitCode } from './crypto'
import { rateLimit } from './ratelimit'
import { clientIp, clientLocation, deviceHash, deviceLabel, userAgent } from './request'
import { createSession } from './session'
import { loginAlertMail, sendMail } from './mailer'

export type UserRow = {
  id: string
  email: string
  email_verified_at: string | null
  username: string
  display_name: string | null
  password_hash: string
  role: string
  totp_secret: string | null
  totp_enabled_at: string | null
  failed_logins: number
  locked_until: string | null
  onboarded_at: string | null
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
}

export function fail(message: string, status = 400, extra: Record<string, unknown> = {}) {
  return json({ ok: false, error: message, ...extra }, status)
}

export async function readJson<T>(req: NextRequest): Promise<Partial<T>> {
  try {
    const text = await req.text()
    if (text.length > 20_000) return {}
    return JSON.parse(text) as Partial<T>
  } catch {
    return {}
  }
}

export async function boot() {
  await ensureSchema()
}

// ── Validation ──────────────────────────────────────────────────

const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/
const DISPOSABLE = new Set([
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org', 'yopmail.com',
  'trashmail.com', 'getnada.com', 'sharklasers.com', 'dispostable.com', 'maildrop.cc', 'throwawaymail.com',
  'fakeinbox.com', 'mintemail.com', 'emailondeck.com', 'mohmal.com', 'tempmailo.com', 'tempail.com',
])
const RESERVED = new Set(['admin', 'administrator', 'root', 'system', 'ghostnet', 'ghost', 'support', 'security', 'moderator', 'staff', 'null', 'undefined', 'api', 'auth'])
const COMMON = new Set([
  'password', 'password1', 'password123', '123456789', '1234567890', 'qwertyuiop', 'iloveyou1', 'letmein123',
  'welcome123', 'admin12345', 'qwerty1234', 'football12', 'monkey1234', 'abc1234567', 'passw0rd12', 'ghostnet123',
])

export function normEmail(e: unknown): string {
  return typeof e === 'string' ? e.trim().toLowerCase() : ''
}

export async function checkEmail(email: string): Promise<string | null> {
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) return 'Enter a valid email address.'
  const domain = email.split('@')[1]
  if (DISPOSABLE.has(domain)) return 'Disposable email addresses are not accepted. Use an inbox you keep.'
  try {
    const mx = await Promise.race([
      resolveMx(domain),
      new Promise<null>(r => setTimeout(() => r(null), 3000)),
    ])
    if (Array.isArray(mx) && mx.length === 0) return 'That email domain cannot receive mail. Check the address.'
  } catch (e) {
    const code = (e as { code?: string }).code
    if (code === 'ENOTFOUND' || code === 'ENODATA') return 'That email domain does not exist or cannot receive mail.'
    // Other DNS errors: don't block; the verification code is the real proof.
  }
  return null
}

export function checkUsername(u: unknown): string | null {
  if (typeof u !== 'string') return 'Choose a callsign.'
  const s = u.trim()
  if (!/^[A-Za-z0-9_-]{3,20}$/.test(s)) return 'Callsign: 3 to 20 characters, letters, numbers, _ or -.'
  if (RESERVED.has(s.toLowerCase())) return 'That callsign is reserved. Pick another.'
  return null
}

export function checkPassword(pw: unknown, email = '', username = ''): string | null {
  if (typeof pw !== 'string' || pw.length < 10) return 'Password must be at least 10 characters.'
  if (pw.length > 128) return 'Password must be 128 characters or fewer.'
  const lower = pw.toLowerCase()
  if (COMMON.has(lower)) return 'That password is far too common. Choose something unique.'
  const local = email.split('@')[0]?.toLowerCase()
  if ((local && local.length >= 4 && lower.includes(local)) || (username && username.length >= 4 && lower.includes(username.toLowerCase())))
    return 'Your password must not contain your email or callsign.'
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter(r => r.test(pw)).length
  if (pw.length < 16 && classes < 3) return 'Use at least 3 of: lowercase, uppercase, numbers, symbols (or 16+ characters).'
  return null
}

// ── Audit ───────────────────────────────────────────────────────

export function audit(req: NextRequest, type: string, userId: string | null, email: string | null, meta?: Record<string, unknown>) {
  return sql(
    `INSERT INTO auth_events (user_id, email, type, ip, user_agent, location, meta) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [userId, email, type, clientIp(req), userAgent(req), clientLocation(req), meta ?? null],
  ).catch(() => {})
}

// ── One-time email codes ────────────────────────────────────────

export type CodePurpose = 'verify' | 'reset' | 'login'

/** Issues a fresh 6-digit code (older unused codes for the same purpose stop working). Returns null if rate limited. */
export async function issueCode(email: string, purpose: CodePurpose, userId: string | null): Promise<string | null> {
  const okShort = await rateLimit('code:' + purpose + ':' + email, 3, 600)
  const okDay = await rateLimit('codeday:' + email, 15, 86400)
  if (!okShort || !okDay) return null
  await sql(`UPDATE email_codes SET consumed_at = now() WHERE email = $1 AND purpose = $2 AND consumed_at IS NULL`, [email, purpose])
  const code = sixDigitCode()
  await sql(
    `INSERT INTO email_codes (user_id, email, purpose, code_hash, expires_at) VALUES ($1, $2, $3, $4, now() + interval '10 minutes')`,
    [userId, email, purpose, codeHash(code)],
  )
  return code
}

export async function consumeCode(email: string, purpose: CodePurpose, code: unknown): Promise<'ok' | 'invalid' | 'expired' | 'locked'> {
  const c = typeof code === 'string' ? code.replace(/\D/g, '') : ''
  const row = await one<{ id: string; code_hash: string; attempts: number; expired: boolean }>(
    `SELECT id, code_hash, attempts, (expires_at < now()) AS expired FROM email_codes
      WHERE email = $1 AND purpose = $2 AND consumed_at IS NULL ORDER BY created_at DESC LIMIT 1`,
    [email, purpose],
  )
  if (!row) return 'expired'
  if (row.expired) return 'expired'
  if (row.attempts >= 5) return 'locked'
  if (c.length !== 6 || !safeEqualHex(codeHash(c), row.code_hash)) {
    await sql(`UPDATE email_codes SET attempts = attempts + 1 WHERE id = $1`, [row.id])
    return row.attempts + 1 >= 5 ? 'locked' : 'invalid'
  }
  await sql(`UPDATE email_codes SET consumed_at = now() WHERE id = $1`, [row.id])
  return 'ok'
}

export function codeError(r: 'invalid' | 'expired' | 'locked'): string {
  if (r === 'invalid') return 'That code is not right. Check the latest email and try again.'
  if (r === 'locked') return 'Too many wrong attempts. Request a new code.'
  return 'That code has expired. Request a new one.'
}

// ── Login completion ────────────────────────────────────────────

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  return one<UserRow>(`SELECT * FROM users WHERE email = $1`, [email])
}

/** Creates the session, updates streak/last login, and emails a new-device alert when relevant. */
export async function completeLogin(req: NextRequest, user: UserRow, extra: Record<string, unknown> = {}): Promise<NextResponse> {
  const res = json({ ok: true, next: user.onboarded_at ? 'done' : 'onboard', ...extra })
  await createSession(req, res, user.id)
  await sql(`UPDATE users SET failed_logins = 0, locked_until = NULL, last_login_at = now() WHERE id = $1`, [user.id])

  const dh = deviceHash(req)
  const known = await one<{ n: number }>(`SELECT count(*)::int AS n FROM known_devices WHERE user_id = $1`, [user.id])
  const seen = await one<{ device_hash: string }>(`SELECT device_hash FROM known_devices WHERE user_id = $1 AND device_hash = $2`, [user.id, dh])
  const ua = userAgent(req)
  if (seen) {
    await sql(`UPDATE known_devices SET last_seen = now() WHERE user_id = $1 AND device_hash = $2`, [user.id, dh])
  } else {
    await sql(`INSERT INTO known_devices (user_id, device_hash, label) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`, [user.id, dh, deviceLabel(ua)])
    if ((known?.n ?? 0) > 0) {
      try {
        await sendMail(loginAlertMail(user.email, user.username, deviceLabel(ua), clientLocation(req), clientIp(req), new Date()))
      } catch (e) {
        console.error('[auth] login alert failed', e instanceof Error ? e.message : e)
      }
      audit(req, 'new_device', user.id, user.email)
    }
  }
  audit(req, 'login', user.id, user.email)
  return res
}

/** Records a failed password attempt and applies a growing lockout. */
export async function recordFailedLogin(user: UserRow) {
  const n = user.failed_logins + 1
  const lockMinutes = n >= 15 ? 240 : n >= 10 ? 60 : n >= 5 ? 15 : 0
  await sql(
    `UPDATE users SET failed_logins = $2, locked_until = CASE WHEN $3::int > 0 THEN now() + make_interval(mins => $3::int) ELSE locked_until END WHERE id = $1`,
    [user.id, n, lockMinutes],
  )
  return lockMinutes
}

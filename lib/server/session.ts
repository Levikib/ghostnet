import { NextRequest, NextResponse } from 'next/server'
import { one, sql } from './db'
import { ensureSchema } from './schema'
import { randomToken, sha256 } from './crypto'
import { clientIp, clientLocation, deviceLabel, userAgent } from './request'

export const SESSION_COOKIE = 'gn_session'
/** Non-secret hint cookie the client and middleware can read ("is someone signed in?"). Never trusted for access. */
export const HINT_COOKIE = 'gn_auth'
const IDLE_DAYS = 14
const MAX_DAYS = 30

export type SessionUser = {
  id: string
  email: string
  username: string
  display_name: string | null
  role: 'student' | 'instructor' | 'admin' | 'super_admin'
  email_verified_at: string | null
  onboarded_at: string | null
  totp_enabled_at: string | null
  session_id: string
}

export async function createSession(req: NextRequest, res: NextResponse, userId: string): Promise<string> {
  const token = randomToken(32)
  const ua = userAgent(req)
  const row = await one<{ id: string }>(
    `INSERT INTO sessions (user_id, token_hash, ip, user_agent, device_label, location, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, now() + interval '${MAX_DAYS} days') RETURNING id`,
    [userId, sha256(token), clientIp(req), ua, deviceLabel(ua), clientLocation(req)],
  )
  setSessionCookies(res, token)
  return row!.id
}

export function setSessionCookies(res: NextResponse, token: string) {
  const secure = process.env.NODE_ENV === 'production'
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: MAX_DAYS * 86400 })
  res.cookies.set(HINT_COOKIE, '1', { httpOnly: false, secure, sameSite: 'lax', path: '/', maxAge: MAX_DAYS * 86400 })
}

export function clearSessionCookies(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 })
  res.cookies.set(HINT_COOKIE, '', { path: '/', maxAge: 0 })
}

/** Validates the session cookie against the database. Returns null if missing, expired, revoked or idle too long. */
export async function getSessionUser(req: NextRequest): Promise<SessionUser | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token || token.length < 20) return null
  await ensureSchema()
  const row = await one<SessionUser & { last_seen_at: string }>(
    `SELECT u.id, u.email, u.username, u.display_name, u.role, u.email_verified_at, u.onboarded_at, u.totp_enabled_at,
            s.id AS session_id, s.last_seen_at
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > now()
        AND s.last_seen_at > now() - interval '${IDLE_DAYS} days'`,
    [sha256(token)],
  )
  if (!row) return null
  // Touch at most every 5 minutes to keep writes low.
  if (Date.now() - new Date(row.last_seen_at).getTime() > 5 * 60 * 1000) {
    sql(`UPDATE sessions SET last_seen_at = now(), ip = $2 WHERE id = $1`, [row.session_id, clientIp(req)]).catch(() => {})
  }
  return row
}

export async function revokeSession(sessionId: string) {
  await sql(`UPDATE sessions SET revoked_at = now() WHERE id = $1 AND revoked_at IS NULL`, [sessionId])
}

export async function revokeAllSessions(userId: string, exceptSessionId?: string) {
  await sql(
    `UPDATE sessions SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL AND ($2::uuid IS NULL OR id <> $2::uuid)`,
    [userId, exceptSessionId ?? null],
  )
}

import { NextRequest } from 'next/server'
import { sql } from '../../../../lib/server/db'
import { getSessionUser, revokeAllSessions, revokeSession } from '../../../../lib/server/session'
import { audit, fail, json, readJson } from '../../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/auth/sessions -> active sessions + recent security events
export async function GET(req: NextRequest) {
  const s = await getSessionUser(req)
  if (!s) return fail('Sign in first.', 401)
  const sessions = await sql<{ id: string; device_label: string; location: string; ip: string; created_at: string; last_seen_at: string }>(
    `SELECT id, device_label, location, ip, created_at, last_seen_at FROM sessions
      WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > now() AND last_seen_at > now() - interval '14 days'
      ORDER BY last_seen_at DESC`, [s.id])
  const events = await sql<{ type: string; location: string; ip: string; created_at: string }>(
    `SELECT type, location, ip, created_at FROM auth_events WHERE user_id = $1 ORDER BY created_at DESC LIMIT 15`, [s.id])
  return json({
    sessions: sessions.map(x => ({ ...x, ip: x.ip?.replace(/\.\d+$/, '.x') ?? '', current: x.id === s.session_id })),
    events: events.map(x => ({ ...x, ip: x.ip?.replace(/\.\d+$/, '.x') ?? '' })),
  })
}

// DELETE /api/auth/sessions  { id } or { all: true }  (all = every session except this one)
export async function DELETE(req: NextRequest) {
  const s = await getSessionUser(req)
  if (!s) return fail('Sign in first.', 401)
  const b = await readJson<{ id: string; all: boolean }>(req)
  if (b.all) {
    await revokeAllSessions(s.id, s.session_id)
    audit(req, 'sessions_revoked_all', s.id, s.email)
  } else if (typeof b.id === 'string') {
    await sql(`UPDATE sessions SET revoked_at = now() WHERE id = $1 AND user_id = $2 AND revoked_at IS NULL`, [b.id, s.id])
    if (b.id === s.session_id) await revokeSession(s.session_id)
    audit(req, 'session_revoked', s.id, s.email)
  } else return fail('Say which session to sign out.')
  return json({ ok: true })
}

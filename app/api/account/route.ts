import { NextRequest } from 'next/server'
import { one, sql } from '../../../lib/server/db'
import { verifyPassword } from '../../../lib/server/crypto'
import { clearSessionCookies, getSessionUser } from '../../../lib/server/session'
import { audit, fail, json, readJson } from '../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// DELETE /api/account { password } -> permanently deletes the account and all progress (cascades).
export async function DELETE(req: NextRequest) {
  const s = await getSessionUser(req)
  if (!s) return fail('Sign in first.', 401)
  const b = await readJson<{ password: string }>(req)
  const u = await one<{ password_hash: string }>(`SELECT password_hash FROM users WHERE id = $1`, [s.id])
  if (!u || !(await verifyPassword(String(b.password || ''), u.password_hash)).ok) return fail('Password is incorrect.', 401)
  audit(req, 'account_deleted', null, s.email.split('@')[1] || null)
  await sql(`DELETE FROM users WHERE id = $1`, [s.id])
  const res = json({ ok: true })
  clearSessionCookies(res)
  return res
}

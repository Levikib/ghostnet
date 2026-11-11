import { NextRequest } from 'next/server'
import { sql } from '../../../../../lib/server/db'
import { encrypt } from '../../../../../lib/server/crypto'
import { newTotpSecret, otpauthUri } from '../../../../../lib/server/totp'
import { qrSvg } from '../../../../../lib/server/qr'
import { getSessionUser } from '../../../../../lib/server/session'
import { fail, json } from '../../../../../lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/auth/2fa/setup -> a fresh pending secret, its QR code and the manual key. Not active until /enable confirms a code.
export async function POST(req: NextRequest) {
  const s = await getSessionUser(req)
  if (!s) return fail('Sign in first.', 401)
  if (s.totp_enabled_at) return fail('Two-factor is already on. Turn it off first to set up a new device.', 409)
  const secret = newTotpSecret()
  await sql(`UPDATE users SET totp_pending = $2 WHERE id = $1`, [s.id, encrypt(secret)])
  const uri = otpauthUri(secret, s.email)
  return json({ ok: true, secret: secret.replace(/(.{4})/g, '$1 ').trim(), uri, qr: qrSvg(uri) })
}

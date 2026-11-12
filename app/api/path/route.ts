import { NextRequest } from 'next/server'
import { sql } from '../../../lib/server/db'
import { getSessionUser } from '../../../lib/server/session'
import { ensureSchema } from '../../../lib/server/schema'
import { fail, json, readJson } from '../../../lib/server/auth'
import { PATHS } from '../../../lib/paths'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const VALID = new Set(PATHS.map(p => p.id))

// POST /api/path  { pathId }  — set the learner's active path. pathId "" clears it.
export async function POST(req: NextRequest) {
  try {
    const s = await getSessionUser(req)
    if (!s) return fail('Sign in first.', 401)
    await ensureSchema()
    const b = await readJson<{ pathId: string }>(req)
    const pathId = typeof b.pathId === 'string' ? b.pathId : ''
    if (pathId && !VALID.has(pathId)) return fail('Unknown path.', 400)
    await sql(`UPDATE users SET chosen_path = $2, chosen_path_at = now() WHERE id = $1`, [s.id, pathId || null])
    return json({ ok: true, chosen_path: pathId || null })
  } catch (e) {
    console.error('[path]', e)
    return fail('Could not save your path. Try again.', 500)
  }
}

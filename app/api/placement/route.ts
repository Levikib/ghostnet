import { NextRequest } from 'next/server'
import { sql } from '../../../lib/server/db'
import { getSessionUser } from '../../../lib/server/session'
import { ensureSchema } from '../../../lib/server/schema'
import { fail, json, readJson } from '../../../lib/server/auth'
import { scorePlacement, moduleReadiness, recommendPath } from '../../../lib/assess/engine'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/placement  { answers: Record<questionId, chosenIndex> }
// Grades server-side, saves the per-domain levels, returns the result and a recommended path.
export async function POST(req: NextRequest) {
  try {
    const s = await getSessionUser(req)
    if (!s) return fail('Sign in first.', 401)
    await ensureSchema()
    const b = await readJson<{ answers: Record<string, number> }>(req)
    const answers = b.answers && typeof b.answers === 'object' ? b.answers : {}
    const clean: Record<string, number> = {}
    for (const [k, v] of Object.entries(answers)) {
      if (typeof k === 'string' && k.length < 40 && typeof v === 'number' && v >= 0 && v <= 3) clean[k] = v
    }
    const result = scorePlacement(clean)
    const recommended = recommendPath(result.domains)
    const readiness = moduleReadiness(result.domains)

    await sql(
      `UPDATE users SET placement_done = true, placement_results = $2::jsonb, placement_at = now() WHERE id = $1`,
      [s.id, JSON.stringify(result.domains)],
    )
    await sql(`INSERT INTO activity (user_id, kind, module_id, ref, xp) VALUES ($1, 'placement', NULL, NULL, 0)`, [s.id]).catch(() => {})
    return json({ ok: true, domains: result.domains, overall: result.overall, strengths: result.strengths, gaps: result.gaps, recommended, readiness })
  } catch (e) {
    console.error('[placement]', e)
    return fail('Could not save your result. Try again.', 500)
  }
}

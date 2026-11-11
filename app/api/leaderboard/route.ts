import { NextRequest } from 'next/server'
import { sql } from '../../../lib/server/db'
import { ensureSchema } from '../../../lib/server/schema'
import { getSessionUser } from '../../../lib/server/session'
import { json } from '../../../lib/server/auth'
import { getRank } from '../../../lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/leaderboard -> top 50 public operators by XP, plus the caller's own rank
export async function GET(req: NextRequest) {
  try {
    await ensureSchema()
    const rows = await sql<{ id: string; username: string; display_name: string | null; avatar_seed: string | null; avatar_color: string | null; xp: number; streak_days: number; labs: number }>(
      `SELECT u.id, u.username, u.display_name, u.avatar_seed, u.avatar_color, u.xp, u.streak_days,
              (SELECT count(*)::int FROM lab_progress l WHERE l.user_id = u.id AND l.completed) AS labs
         FROM users u
        WHERE u.email_verified_at IS NOT NULL AND u.is_public
        ORDER BY u.xp DESC, u.created_at ASC LIMIT 50`)
    const me = await getSessionUser(req).catch(() => null)
    let myRank: number | null = null
    if (me) {
      const r = await sql<{ pos: number }>(
        `SELECT 1 + count(*)::int AS pos FROM users WHERE email_verified_at IS NOT NULL AND xp > (SELECT xp FROM users WHERE id = $1)`, [me.id])
      myRank = r[0]?.pos ?? null
    }
    return json({
      operators: rows.map((r, i) => ({ position: i + 1, username: r.username, display_name: r.display_name || r.username, avatar_seed: r.avatar_seed, avatar_color: r.avatar_color, xp: r.xp, rank: getRank(r.xp), streak_days: r.streak_days, labs: r.labs, you: me?.id === r.id })),
      myRank,
    })
  } catch (e) {
    console.error('[leaderboard]', e)
    return json({ operators: [], myRank: null, error: 'unavailable' }, 503)
  }
}

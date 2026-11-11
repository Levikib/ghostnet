import { NextRequest } from 'next/server'
import { one, sql } from '../../../lib/server/db'
import { getSessionUser } from '../../../lib/server/session'
import { addXp, moduleProgressFor } from '../../../lib/server/profile'
import { fail, json, readJson } from '../../../lib/server/auth'
import { CHAPTER_XP, LAB_IDS, LAB_XP, MODULE_IDS } from '../../../lib/learning'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/progress -> { modules: ModuleProgress[], labs: { [labId]: { steps_done, steps_total, completed } } }
export async function GET(req: NextRequest) {
  const s = await getSessionUser(req)
  if (!s) return fail('Sign in first.', 401)
  const labs = await sql<{ lab_id: string; steps_done: number; steps_total: number; completed: boolean }>(
    `SELECT lab_id, steps_done, steps_total, completed FROM lab_progress WHERE user_id = $1`, [s.id])
  const chapters = await sql<{ module_id: string; chapters_read: number[]; last_chapter: number }>(
    `SELECT module_id, chapters_read, last_chapter FROM module_progress WHERE user_id = $1`, [s.id])
  return json({
    modules: await moduleProgressFor(s.id),
    labs: Object.fromEntries(labs.map(l => [l.lab_id, l])),
    chapters: Object.fromEntries(chapters.map(c => [c.module_id, { read: c.chapters_read, last: c.last_chapter }])),
  })
}

// POST /api/progress
//   { action: 'chapter', module_id, chapter, total }          a concept chapter was opened
//   { action: 'lab_step', lab_id, module_id, step, total }     steps completed so far in a lab
//   { action: 'lab_complete', lab_id, module_id }              lab finished (XP is server-defined)
//   Legacy body { lab_id, module_id, xp_earned } = lab_complete.
export async function POST(req: NextRequest) {
  try {
    const s = await getSessionUser(req)
    if (!s) return fail('Sign in first.', 401)
    const b = await readJson<Record<string, unknown>>(req)
    const action = typeof b.action === 'string' ? b.action : 'lab_complete'
    const moduleId = String(b.module_id || '')
    if (!MODULE_IDS.has(moduleId)) return fail('Unknown module.')

    if (action === 'chapter') {
      const chapter = Math.floor(Number(b.chapter))
      const total = Math.floor(Number(b.total))
      if (!(chapter >= 0 && chapter < 40) || !(total > 0 && total <= 40)) return fail('Bad chapter.')
      const prev = await one<{ chapters_read: number[] }>(`SELECT chapters_read FROM module_progress WHERE user_id = $1 AND module_id = $2`, [s.id, moduleId])
      const isNew = !prev || !(prev.chapters_read || []).includes(chapter)
      await sql(
        `INSERT INTO module_progress (user_id, module_id, chapters_read, chapters_total, last_chapter)
         VALUES ($1, $2, jsonb_build_array($3::int), $4, $3)
         ON CONFLICT (user_id, module_id) DO UPDATE SET
           chapters_read = CASE WHEN module_progress.chapters_read @> to_jsonb($3::int) THEN module_progress.chapters_read
                                ELSE module_progress.chapters_read || to_jsonb($3::int) END,
           chapters_total = $4, last_chapter = $3, updated_at = now()`,
        [s.id, moduleId, chapter, total],
      )
      if (isNew) {
        await addXp(s.id, CHAPTER_XP)
        await sql(`INSERT INTO activity (user_id, kind, module_id, ref, xp) VALUES ($1, 'chapter', $2, $3, $4)`, [s.id, moduleId, String(chapter), CHAPTER_XP])
      }
      return json({ ok: true, xp: isNew ? CHAPTER_XP : 0 })
    }

    const labId = String(b.lab_id || '')
    if (!LAB_IDS.has(labId)) return fail('Unknown lab.')

    if (action === 'lab_step') {
      const step = Math.floor(Number(b.step))
      const total = Math.floor(Number(b.total))
      if (!(step >= 0 && step <= 100) || !(total > 0 && total <= 100)) return fail('Bad step.')
      await sql(
        `INSERT INTO lab_progress (user_id, lab_id, module_id, steps_done, steps_total, attempts)
         VALUES ($1, $2, $3, $4, $5, 1)
         ON CONFLICT (user_id, lab_id) DO UPDATE SET
           steps_done = GREATEST(lab_progress.steps_done, $4), steps_total = $5, updated_at = now()`,
        [s.id, labId, moduleId, Math.min(step, total), total],
      )
      return json({ ok: true })
    }

    if (action === 'lab_complete') {
      const xp = LAB_XP[labId]
      const prev = await one<{ completed: boolean }>(`SELECT completed FROM lab_progress WHERE user_id = $1 AND lab_id = $2`, [s.id, labId])
      if (prev?.completed) return json({ ok: true, xp: 0, already: true })
      await sql(
        `INSERT INTO lab_progress (user_id, lab_id, module_id, completed, xp_earned, completed_at, steps_done, steps_total, attempts)
         VALUES ($1, $2, $3, true, $4, now(), 0, 0, 1)
         ON CONFLICT (user_id, lab_id) DO UPDATE SET
           completed = true, xp_earned = $4, completed_at = now(), updated_at = now(),
           steps_done = GREATEST(lab_progress.steps_done, lab_progress.steps_total)`,
        [s.id, labId, moduleId, xp],
      )
      await addXp(s.id, xp)
      await sql(`INSERT INTO activity (user_id, kind, module_id, ref, xp) VALUES ($1, 'lab_complete', $2, $3, $4)`, [s.id, moduleId, labId, xp])
      return json({ ok: true, xp })
    }

    return fail('Unknown action.')
  } catch (e) {
    console.error('[progress]', e)
    return fail('Could not save progress.', 500)
  }
}

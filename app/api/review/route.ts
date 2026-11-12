import { NextRequest } from 'next/server'
import { sql, one } from '../../../lib/server/db'
import { getSessionUser } from '../../../lib/server/session'
import { ensureSchema } from '../../../lib/server/schema'
import { fail, json, readJson } from '../../../lib/server/auth'
import { ensureCardBank } from '../../../lib/review/seed'
import { schedule, gradeFromOutcome, type Memory, type CardState } from '../../../lib/review/fsrs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const HARD_MAX = 40

type UserReview = {
  desired_retention: number
  daily_review_cap: number
  review_streak_days: number
  last_review_date: string | null
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10)
}

// GET /api/review?n=12 — return the due/new queue plus review stats. Answers are NOT included.
export async function GET(req: NextRequest) {
  try {
    const s = await getSessionUser(req)
    if (!s) return fail('Sign in first.', 401)
    await ensureSchema()
    await ensureCardBank()

    const n = Math.min(HARD_MAX, Math.max(1, parseInt(req.nextUrl.searchParams.get('n') || '12', 10) || 12))
    // Optional: the module the learner is currently reading. When present we surface
    // cards about THAT topic first so recall matches what is on screen.
    const moduleParam = (req.nextUrl.searchParams.get('module') || '').trim() || null
    const u = await one<UserReview>(
      `SELECT desired_retention, daily_review_cap, review_streak_days, last_review_date FROM users WHERE id = $1`,
      [s.id],
    )
    const cap = u?.daily_review_cap ?? 30

    const doneToday = await one<{ c: number }>(
      `SELECT count(*)::int AS c FROM recall_log WHERE user_id = $1 AND reviewed_at::date = now()::date`,
      [s.id],
    )
    const reviewedToday = doneToday?.c ?? 0

    // Due cards (seen before, now due) first; then new cards, but only for modules the learner has started.
    // When a module is given, that module's due/new cards are ordered ahead of everything else, and its
    // new cards are eligible even if the module is not yet in module_progress (reading it counts as started).
    type CardRow = { id: string; module_id: string; prompt: string; code: string | null; options: unknown; kind: string; is_new: boolean }
    const cards = moduleParam
      ? await sql<CardRow>(
          `SELECT c.id, c.module_id, c.prompt, c.code, c.options, c.kind, (st.user_id IS NULL) AS is_new
           FROM recall_cards c
           LEFT JOIN recall_state st ON st.card_id = c.id AND st.user_id = $1
           WHERE c.status = 'approved' AND (
             (st.user_id IS NOT NULL AND st.due_at <= now())
             OR (st.user_id IS NULL AND (c.module_id = $3 OR c.module_id IN (SELECT module_id FROM module_progress WHERE user_id = $1)))
           )
           ORDER BY (c.module_id = $3) DESC, is_new ASC, st.due_at ASC NULLS LAST, random()
           LIMIT $2`,
          [s.id, n, moduleParam],
        )
      : await sql<CardRow>(
          `SELECT c.id, c.module_id, c.prompt, c.code, c.options, c.kind, (st.user_id IS NULL) AS is_new
           FROM recall_cards c
           LEFT JOIN recall_state st ON st.card_id = c.id AND st.user_id = $1
           WHERE c.status = 'approved' AND (
             (st.user_id IS NOT NULL AND st.due_at <= now())
             OR (st.user_id IS NULL AND c.module_id IN (SELECT module_id FROM module_progress WHERE user_id = $1))
           )
           ORDER BY is_new ASC, st.due_at ASC NULLS LAST, random()
           LIMIT $2`,
          [s.id, n],
        )

    const dueCount = await one<{ c: number }>(
      `SELECT count(*)::int AS c FROM recall_state WHERE user_id = $1 AND due_at <= now()`,
      [s.id],
    )

    return json({
      ok: true,
      cards: cards.map(c => ({
        id: c.id,
        moduleId: c.module_id,
        prompt: c.prompt,
        code: c.code,
        options: Array.isArray(c.options) ? c.options : [],
        kind: c.kind,
        isNew: c.is_new,
      })),
      due: dueCount?.c ?? 0,
      reviewedToday,
      cap,
      streak: u?.review_streak_days ?? 0,
    })
  } catch (e) {
    console.error('[review:get]', e)
    return fail('Could not load your review queue.', 500)
  }
}

type StateRow = {
  stability: number
  difficulty: number
  reps: number
  lapses: number
  state: string
  last_review: string | null
}

// POST /api/review  { cardId, chosenIndex, easy? } — grade one card, advance its schedule.
export async function POST(req: NextRequest) {
  try {
    const s = await getSessionUser(req)
    if (!s) return fail('Sign in first.', 401)
    await ensureSchema()

    const b = await readJson<{ cardId: string; chosenIndex: number; easy?: boolean }>(req)
    if (!b.cardId || typeof b.chosenIndex !== 'number') return fail('Bad request.', 400)

    const card = await one<{ id: string; module_id: string; answer: string; explain: string; options: unknown }>(
      `SELECT id, module_id, answer, explain, options FROM recall_cards WHERE id = $1 AND status = 'approved'`,
      [b.cardId],
    )
    if (!card) return fail('Card not found.', 404)

    const correctIndex = parseInt(card.answer, 10)
    const correct = b.chosenIndex === correctIndex
    const grade = gradeFromOutcome(correct, !!b.easy)

    const u = await one<UserReview>(
      `SELECT desired_retention, daily_review_cap, review_streak_days, last_review_date FROM users WHERE id = $1`,
      [s.id],
    )
    const desiredRetention = u?.desired_retention ?? 0.9

    const prev = await one<StateRow>(
      `SELECT stability, difficulty, reps, lapses, state, last_review FROM recall_state WHERE user_id = $1 AND card_id = $2`,
      [s.id, card.id],
    )
    const mem: Memory = prev
      ? {
          stability: prev.stability,
          difficulty: prev.difficulty,
          reps: prev.reps,
          lapses: prev.lapses,
          state: prev.state as CardState,
          lastReview: prev.last_review ? new Date(prev.last_review) : null,
        }
      : { stability: 0, difficulty: 5, reps: 0, lapses: 0, state: 'new', lastReview: null }

    const now = new Date()
    const sched = schedule(mem, grade, now, desiredRetention)

    await sql(
      `INSERT INTO recall_state (user_id, card_id, stability, difficulty, reps, lapses, state, last_review, due_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (user_id, card_id) DO UPDATE SET
         stability = EXCLUDED.stability, difficulty = EXCLUDED.difficulty, reps = EXCLUDED.reps,
         lapses = EXCLUDED.lapses, state = EXCLUDED.state, last_review = EXCLUDED.last_review, due_at = EXCLUDED.due_at`,
      [s.id, card.id, sched.stability, sched.difficulty, sched.reps, sched.lapses, sched.state, now.toISOString(), sched.dueAt.toISOString()],
    )

    await sql(
      `INSERT INTO recall_log (user_id, card_id, grade, elapsed_days, stability_after, difficulty_after, interval_days)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [s.id, card.id, grade, sched.elapsedDays, sched.stability, sched.difficulty, sched.intervalDays],
    ).catch(() => {})

    // Recompute this module's mastery from current card states (stability >= 21d ≈ "owned").
    await sql(
      `INSERT INTO recall_module_stat (user_id, module_id, mastered, strength, updated_at)
       SELECT $1, $2,
         count(*) FILTER (WHERE st.stability >= 21)::int,
         LEAST(100, round(avg(LEAST(1.0, st.stability / 21.0)) * 100))::int,
         now()
       FROM recall_state st JOIN recall_cards c ON c.id = st.card_id
       WHERE st.user_id = $1 AND c.module_id = $2
       ON CONFLICT (user_id, module_id) DO UPDATE SET mastered = EXCLUDED.mastered, strength = EXCLUDED.strength, updated_at = now()`,
      [s.id, card.module_id],
    ).catch(() => {})

    // Daily streak: advance on first review of a new day, reset if a day was missed.
    const today = todayUTC()
    const last = u?.last_review_date || null
    let streak = u?.review_streak_days ?? 0
    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      streak = last === yesterday ? streak + 1 : 1
      await sql(`UPDATE users SET review_streak_days = $2, last_review_date = $3::date WHERE id = $1`, [s.id, streak, today]).catch(() => {})
    }

    await sql(`INSERT INTO activity (user_id, kind, module_id, ref, xp) VALUES ($1, 'review', $2, $3, $4)`, [s.id, card.module_id, card.id, correct ? 2 : 0]).catch(() => {})

    return json({
      ok: true,
      correct,
      answer: correctIndex,
      explain: card.explain,
      intervalDays: sched.intervalDays,
      dueAt: sched.dueAt.toISOString(),
      streak,
    })
  } catch (e) {
    console.error('[review:post]', e)
    return fail('Could not record your answer.', 500)
  }
}

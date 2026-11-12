import { one, sql } from './db'
import { CATALOG, CHAPTER_XP, ModuleProgress, modulePercent } from '../learning'
import { getRank, getNextRankInfo } from '../supabase'

export type ProfilePayload = {
  id: string
  email: string
  username: string
  display_name: string
  role: string
  avatar_seed: string | null
  avatar_color: string | null
  bio: string | null
  country: string | null
  skill_level: string | null
  interests: string[]
  goal: string | null
  is_public: boolean
  onboarded: boolean
  two_factor: boolean
  email_verified: boolean
  created_at: string
  last_login_at: string | null
  xp: number
  ghost_rank: string
  next_rank: { title: string; minXp: number; color: string } | null
  streak_days: number
  modules: ModuleProgress[]
  overall_percent: number
  labs_completed: number
  chapters_read: number
  recent: { kind: string; module_id: string | null; ref: string | null; xp: number; created_at: string }[]
  /** UTC dates (YYYY-MM-DD) with any learning activity in the last 28 days. */
  active_days: string[]
  placement_done: boolean
  placement_results: Record<string, number> | null
  chosen_path: string | null
  /** Today's learning, for daily missions. */
  today: { chapters: number; lab_steps: number; labs: number; xp: number }
}

type U = {
  id: string; email: string; username: string; display_name: string | null; role: string; avatar_seed: string | null; avatar_color: string | null
  bio: string | null; country: string | null; skill_level: string | null; interests: string[] | null; goal: string | null; is_public: boolean
  onboarded_at: string | null; totp_enabled_at: string | null; email_verified_at: string | null; created_at: string; last_login_at: string | null
  xp: number; streak_days: number; last_active_date: string | null
  placement_done: boolean; placement_results: Record<string, number> | null; chosen_path: string | null
}

export async function moduleProgressFor(userId: string): Promise<ModuleProgress[]> {
  const mp = await sql<{ module_id: string; chapters_read: number[]; chapters_total: number; last_chapter: number; started_at: string; updated_at: string }>(
    `SELECT module_id, chapters_read, chapters_total, last_chapter, started_at, updated_at FROM module_progress WHERE user_id = $1`, [userId])
  const lp = await sql<{ lab_id: string; module_id: string; steps_done: number; steps_total: number; completed: boolean; xp_earned: number; started_at: string; updated_at: string }>(
    `SELECT lab_id, module_id, steps_done, steps_total, completed, xp_earned, started_at, updated_at FROM lab_progress WHERE user_id = $1`, [userId])
  const byMod = new Map(mp.map(r => [r.module_id, r]))
  const byLab = new Map(lp.map(r => [r.lab_id, r]))
  return CATALOG.map(m => {
    const r = byMod.get(m.id)
    const l = byLab.get(m.labId)
    const read = Array.isArray(r?.chapters_read) ? r!.chapters_read.length : 0
    const total = r?.chapters_total || m.chapters
    const steps = l?.steps_done ?? 0
    const stepsTotal = l?.steps_total ?? 0
    const done = !!l?.completed
    const started = [r?.started_at, l?.started_at].filter(Boolean).sort()[0] ?? null
    const updated = [r?.updated_at, l?.updated_at].filter(Boolean).sort().pop() ?? null
    return {
      id: m.id, code: m.code, title: m.title, color: m.color,
      percent: modulePercent(read, total, steps, stepsTotal, done),
      chaptersRead: read, chaptersTotal: total, lastChapter: r?.last_chapter ?? 0,
      labSteps: steps, labTotal: stepsTotal, labCompleted: done, labXp: m.labXp,
      xpEarned: (l?.xp_earned ?? 0) + read * CHAPTER_XP,
      startedAt: started, updatedAt: updated,
    }
  })
}

export async function buildProfile(userId: string): Promise<ProfilePayload | null> {
  const u = await one<U>(`SELECT * FROM users WHERE id = $1`, [userId])
  if (!u) return null
  const modules = await moduleProgressFor(userId)
  const recent = await sql<{ kind: string; module_id: string | null; ref: string | null; xp: number; created_at: string }>(
    `SELECT kind, module_id, ref, xp, created_at FROM activity WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`, [userId])
  const days = await sql<{ d: string }>(
    `SELECT DISTINCT to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS d FROM activity WHERE user_id = $1 AND created_at > now() - interval '28 days' ORDER BY d`, [userId])
  const td = await one<{ chapters: number; lab_steps: number; labs: number; xp: number }>(
    `SELECT count(*) FILTER (WHERE kind = 'chapter')::int AS chapters, count(*) FILTER (WHERE kind = 'lab_step')::int AS lab_steps,
            count(*) FILTER (WHERE kind = 'lab_complete')::int AS labs, coalesce(sum(xp), 0)::int AS xp
       FROM activity WHERE user_id = $1 AND created_at >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'`, [userId])
  // Streak is "consecutive days active, up to today or yesterday".
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const streak = u.last_active_date && (u.last_active_date.slice(0, 10) === today || u.last_active_date.slice(0, 10) === yesterday) ? u.streak_days : 0
  return {
    id: u.id, email: u.email, username: u.username, display_name: u.display_name || u.username, role: u.role,
    avatar_seed: u.avatar_seed, avatar_color: u.avatar_color, bio: u.bio, country: u.country, skill_level: u.skill_level,
    interests: Array.isArray(u.interests) ? u.interests : [], goal: u.goal, is_public: u.is_public,
    onboarded: !!u.onboarded_at, two_factor: !!u.totp_enabled_at, email_verified: !!u.email_verified_at,
    created_at: u.created_at, last_login_at: u.last_login_at,
    xp: u.xp, ghost_rank: getRank(u.xp), next_rank: getNextRankInfo(u.xp), streak_days: streak,
    modules,
    overall_percent: Math.round(modules.reduce((a, m) => a + m.percent, 0) / modules.length),
    labs_completed: modules.filter(m => m.labCompleted).length,
    chapters_read: modules.reduce((a, m) => a + m.chaptersRead, 0),
    recent,
    active_days: days.map(r => r.d),
    today: td || { chapters: 0, lab_steps: 0, labs: 0, xp: 0 },
    placement_done: !!u.placement_done,
    placement_results: u.placement_results || null,
    chosen_path: u.chosen_path || null,
  }
}

/** Adds XP and bumps the daily streak. */
export async function addXp(userId: string, xp: number) {
  await sql(
    `UPDATE users SET
       xp = xp + $2,
       streak_days = CASE
         WHEN last_active_date = current_date THEN streak_days
         WHEN last_active_date = current_date - 1 THEN streak_days + 1
         ELSE 1 END,
       last_active_date = current_date,
       updated_at = now()
     WHERE id = $1`,
    [userId, xp],
  )
}

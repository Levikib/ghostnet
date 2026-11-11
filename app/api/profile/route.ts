import { NextRequest } from 'next/server'
import { one, sql, isUniqueViolation } from '../../../lib/server/db'
import { getSessionUser } from '../../../lib/server/session'
import { buildProfile } from '../../../lib/server/profile'
import { checkUsername, fail, json, readJson } from '../../../lib/server/auth'
import { MODULE_IDS } from '../../../lib/learning'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SKILLS = new Set(['beginner', 'intermediate', 'advanced', 'expert'])
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/<[^>]*>/g, '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max) : undefined)

// PATCH /api/profile  { display_name?, username?, bio?, country?, skill_level?, interests?, goal?, avatar_seed?, avatar_color?, is_public?, complete_onboarding? }
export async function PATCH(req: NextRequest) {
  try {
    const s = await getSessionUser(req)
    if (!s) return fail('Sign in first.', 401)
    const b = await readJson<Record<string, unknown>>(req)
    const sets: string[] = []
    const vals: unknown[] = [s.id]
    const put = (col: string, v: unknown) => { vals.push(v); sets.push(col + ' = $' + vals.length) }

    if (b.display_name !== undefined) { const v = clean(b.display_name, 40); if (!v) return fail('Display name cannot be empty.'); put('display_name', v) }
    if (b.username !== undefined) {
      const err = checkUsername(b.username); if (err) return fail(err, 400, { field: 'username' })
      put('username', String(b.username).trim())
    }
    if (b.bio !== undefined) put('bio', clean(b.bio, 280) || null)
    if (b.country !== undefined) put('country', clean(b.country, 56) || null)
    if (b.goal !== undefined) put('goal', clean(b.goal, 160) || null)
    if (b.skill_level !== undefined) { if (!SKILLS.has(String(b.skill_level))) return fail('Pick a valid skill level.'); put('skill_level', b.skill_level) }
    if (b.interests !== undefined) {
      if (!Array.isArray(b.interests)) return fail('Interests must be a list.')
      put('interests', b.interests.filter(x => typeof x === 'string' && MODULE_IDS.has(x)).slice(0, 13))
    }
    if (b.avatar_seed !== undefined) put('avatar_seed', clean(b.avatar_seed, 64) || null)
    if (b.avatar_color !== undefined) { const c = String(b.avatar_color); if (!/^#[0-9a-fA-F]{6}$/.test(c)) return fail('Invalid colour.'); put('avatar_color', c) }
    if (b.is_public !== undefined) put('is_public', !!b.is_public)
    if (b.complete_onboarding) sets.push('onboarded_at = COALESCE(onboarded_at, now())')
    if (!sets.length) return fail('Nothing to update.')
    sets.push('updated_at = now()')

    try {
      await sql('UPDATE users SET ' + sets.join(', ') + ' WHERE id = $1', vals)
    } catch (e) {
      if (isUniqueViolation(e)) return fail('That callsign is already taken.', 409, { field: 'username' })
      throw e
    }
    return json({ ok: true, user: await buildProfile(s.id) })
  } catch (e) {
    console.error('[profile]', e)
    return fail('Could not save your profile. Try again.', 500)
  }
}

// GET /api/profile?u=callsign  -> public profile (if the operator made it public)
export async function GET(req: NextRequest) {
  const u = (req.nextUrl.searchParams.get('u') || '').trim()
  if (!u) return fail('Missing callsign.')
  const row = await one<{ id: string; is_public: boolean }>(`SELECT id, is_public FROM users WHERE username = $1 AND email_verified_at IS NOT NULL`, [u])
  if (!row || !row.is_public) return fail('Operator not found.', 404)
  const p = await buildProfile(row.id)
  if (!p) return fail('Operator not found.', 404)
  const { email: _e, two_factor: _t, recent: _r, ...pub } = p
  return json({ user: pub })
}

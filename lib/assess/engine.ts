// Placement scoring: turn answers into a per-domain skill level and a route.
import { PLACEMENT, DOMAINS, Domain } from './questions'
import { PATHS, pathModules } from '../paths'

export type DomainLevels = Record<string, number> // domain id -> 0..4
export type Readiness = 'skip' | 'review' | 'learn'

const FOUNDATIONAL = new Set(['foundations', 'linux', 'scripting'])

/** Which domains teach a given module (from DOMAINS.modules). */
function domainsForModule(slug: string): Domain[] {
  return DOMAINS.filter(d => d.modules.includes(slug)).map(d => d.id)
}

/**
 * Score a placement attempt. `answers` maps question id -> chosen option index.
 * A domain level is the highest consecutive level (from 1 up) where the learner
 * got at least one of that level's two questions right. 0 means "start at the basics".
 */
export function scorePlacement(answers: Record<string, number>) {
  const domains: DomainLevels = {}
  const perLevel: Record<string, Record<number, { got: number; total: number }>> = {}

  for (const d of DOMAINS) { perLevel[d.id] = { 1: { got: 0, total: 0 }, 2: { got: 0, total: 0 }, 3: { got: 0, total: 0 }, 4: { got: 0, total: 0 } } }
  for (const q of PLACEMENT) {
    const slot = perLevel[q.domain]?.[q.level]
    if (!slot) continue
    slot.total++
    if (answers[q.id] === q.answer) slot.got++
  }

  for (const d of DOMAINS) {
    let level = 0
    for (let L = 1; L <= 4; L++) {
      const s = perLevel[d.id][L]
      if (s.total > 0 && s.got >= 1) level = L
      else break // stop at the first level they can't clear
    }
    domains[d.id] = level
  }

  const vals = DOMAINS.map(d => domains[d.id])
  const overall = vals.reduce((a, b) => a + b, 0) / vals.length
  const ranked = DOMAINS.map(d => ({ id: d.id, level: domains[d.id] })).sort((a, b) => b.level - a.level)
  const strengths = ranked.filter(r => r.level >= 3).map(r => r.id)
  const gaps = ranked.filter(r => r.level <= 1).map(r => r.id)
  return { domains, overall, strengths, gaps }
}

/** Per-module advice given the learner's domain levels. */
export function moduleReadiness(domains: DomainLevels): Record<string, Readiness> {
  const out: Record<string, Readiness> = {}
  const allSlugs = new Set<string>()
  for (const p of PATHS) for (const m of pathModules(p)) allSlugs.add(m)
  for (const slug of allSlugs) {
    const ds = domainsForModule(slug)
    const level = ds.length ? Math.min(...ds.map(id => domains[id] ?? 0)) : 0
    if (FOUNDATIONAL.has(slug)) {
      out[slug] = level >= 2 ? 'skip' : level >= 1 ? 'review' : 'learn'
    } else {
      out[slug] = level >= 4 ? 'review' : 'learn'
    }
  }
  return out
}

/** Recommend a path from domain levels. Beginners get the full journey; others get the path matching their strengths. */
export function recommendPath(domains: DomainLevels): string {
  const overall = DOMAINS.reduce((a, d) => a + (domains[d.id] ?? 0), 0) / DOMAINS.length
  if (overall < 1.2) return 'explorer'

  // Score each path by the learner's level in the domains its modules exercise.
  const best = PATHS.filter(p => p.id !== 'explorer').map(p => {
    const mods = new Set(pathModules(p))
    const relevant = DOMAINS.filter(d => d.modules.some(m => mods.has(m)))
    // Favour paths whose domains the learner is already strong in (they can go deep fast).
    const score = relevant.reduce((a, d) => a + (domains[d.id] ?? 0), 0) / Math.max(1, relevant.length)
    return { id: p.id, score }
  }).sort((a, b) => b.score - a.score)
  return best[0]?.id || 'explorer'
}

export const PLACEMENT_COUNT = PLACEMENT.length

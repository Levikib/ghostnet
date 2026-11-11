import { MODULES } from './seo'

/**
 * The course catalogue and progress maths, shared by the API and the UI so
 * the numbers a learner sees always match what the server stores.
 *
 * Module progress = 60% reading (chapters opened) + 40% the guided lab (steps completed).
 */

export const MODULE_COLORS: Record<string, string> = {
  tor: '#00ff41',
  osint: '#00d4ff',
  crypto: '#ffb347',
  offensive: '#bf5fff',
  'active-directory': '#ff4136',
  'web-attacks': '#00d4ff',
  malware: '#00ff41',
  'network-attacks': '#00ffff',
  'cloud-security': '#ff9500',
  'social-engineering': '#ff6ec7',
  'red-team': '#ff3333',
  'wireless-attacks': '#aaff00',
  'mobile-security': '#7c4dff',
}

/** Canonical XP per lab. Server-side source of truth; client-submitted XP is ignored. */
export const LAB_XP: Record<string, number> = {
  'tor-lab': 345,
  'osint-lab': 305,
  'crypto-lab': 405,
  'offensive-lab': 400,
  'active-directory-lab': 495,
  'web-attacks-lab': 445,
  'malware-lab': 465,
  'network-attacks-lab': 445,
  'cloud-security-lab': 490,
  'social-engineering-lab': 300,
  'red-team-lab': 465,
  'wireless-attacks-lab': 455,
  'mobile-security-lab': 435,
}

/** XP for reading: awarded once per chapter the first time it is opened. */
export const CHAPTER_XP = 5

export type CatalogModule = {
  id: string
  code: string
  title: string
  color: string
  labId: string
  labXp: number
  chapters: number
}

export const CATALOG: CatalogModule[] = MODULES.map(m => ({
  id: m.slug,
  code: m.code,
  title: m.title,
  color: MODULE_COLORS[m.slug] || '#00ff41',
  labId: m.slug + '-lab',
  labXp: LAB_XP[m.slug + '-lab'] || 0,
  chapters: m.topics.length,
}))

export const MODULE_IDS = new Set(CATALOG.map(m => m.id))
export const LAB_IDS = new Set(Object.keys(LAB_XP))

export function modulePercent(chaptersRead: number, chaptersTotal: number, stepsDone: number, stepsTotal: number, labCompleted: boolean): number {
  const reading = chaptersTotal > 0 ? Math.min(1, chaptersRead / chaptersTotal) : 0
  const lab = labCompleted ? 1 : stepsTotal > 0 ? Math.min(1, stepsDone / stepsTotal) : 0
  return Math.round((reading * 0.6 + lab * 0.4) * 100)
}

export type ModuleProgress = {
  id: string
  code: string
  title: string
  color: string
  percent: number
  chaptersRead: number
  chaptersTotal: number
  lastChapter: number
  labSteps: number
  labTotal: number
  labCompleted: boolean
  labXp: number
  xpEarned: number
  startedAt: string | null
  updatedAt: string | null
}

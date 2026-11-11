'use client'
// Pages publish what the learner is looking at (chapter, section, lab step) so GHOST can answer about it.
export type GhostSurface = {
  path: string
  chapter?: string
  section?: string
  excerpt?: string
  lab?: { title?: string; objective?: string; step?: number; total?: number; attempts?: number; recent?: string[] }
}

let current: GhostSurface | null = null

export function setGhostContext(ctx: GhostSurface | null) {
  current = ctx
  try { window.dispatchEvent(new CustomEvent('ghost:context')) } catch {}
}

export function getGhostContext(path: string): Omit<GhostSurface, 'path'> | null {
  if (!current || current.path !== path) return null
  const { path: _p, ...rest } = current
  void _p
  return rest
}

export function openGhost(prompt?: string) {
  try { window.dispatchEvent(new CustomEvent('ghost:open', { detail: { prompt } })) } catch {}
}

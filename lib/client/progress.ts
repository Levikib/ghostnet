'use client'
import { api, looksSignedIn } from './api'

/**
 * Sends learning progress to the server for signed-in operators.
 * Guests keep using localStorage only. Failures are silent (progress is
 * also kept locally and re-sent on the next event).
 */
const sentChapters = new Set<string>()

export function syncChapter(moduleId: string, chapter: number, total: number) {
  if (!looksSignedIn()) return
  const key = moduleId + ':' + chapter
  if (sentChapters.has(key)) return
  sentChapters.add(key)
  api('/api/progress', { action: 'chapter', module_id: moduleId, chapter, total }).then(r => {
    if (r.ok === false) sentChapters.delete(key)
    else if ((r as { xp?: number }).xp) window.dispatchEvent(new Event('ghostnet_profile_refresh'))
  })
}

export function syncLabStep(labId: string, moduleId: string, stepsDone: number, total: number) {
  if (!looksSignedIn()) return
  api('/api/progress', { action: 'lab_step', lab_id: labId, module_id: moduleId, step: stepsDone, total })
}

export async function syncLabComplete(labId: string, moduleId: string): Promise<boolean> {
  if (!looksSignedIn()) return false
  const r = await api('/api/progress', { action: 'lab_complete', lab_id: labId, module_id: moduleId })
  if (r.ok !== false) window.dispatchEvent(new Event('ghostnet_profile_refresh'))
  return r.ok !== false
}

export type ServerProgress = {
  labs: Record<string, { steps_done: number; steps_total: number; completed: boolean }>
  chapters: Record<string, { read: number[]; last: number }>
}

let cache: Promise<ServerProgress | null> | null = null
/** Server-side progress for resuming on another device. Cached per page load. */
export function fetchServerProgress(): Promise<ServerProgress | null> {
  if (!looksSignedIn()) return Promise.resolve(null)
  if (!cache) {
    cache = api<ServerProgress>('/api/progress').then(r => (r.ok === false ? null : (r as ServerProgress)))
  }
  return cache
}

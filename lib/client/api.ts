'use client'

export type ApiResult<T = Record<string, unknown>> = T & { ok?: boolean; error?: string; field?: string; next?: string }

/** JSON fetch to our own API. Never throws: network failures come back as { ok: false, error }. */
export async function api<T = Record<string, unknown>>(path: string, body?: unknown, method?: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(path, {
      method: method || (body === undefined ? 'GET' : 'POST'),
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'same-origin',
      cache: 'no-store',
    })
    const data = (await res.json().catch(() => ({}))) as ApiResult<T>
    if (!res.ok && data.ok === undefined) data.ok = false
    if (!res.ok && !data.error) data.error = 'Request failed (' + res.status + ').'
    return data
  } catch {
    return { ok: false, error: 'Network error. Check your connection and try again.' } as ApiResult<T>
  }
}

/** True when the non-secret hint cookie says someone is signed in (the real check is server-side). */
export function looksSignedIn(): boolean {
  return typeof document !== 'undefined' && /(?:^|;\s*)gn_auth=1/.test(document.cookie)
}

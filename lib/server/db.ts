/**
 * Minimal Neon client over Neon's SQL-over-HTTP endpoint (no driver
 * dependency). Every query is a single HTTPS POST, which suits serverless
 * functions: no connection pool to exhaust, and Neon wakes the database on
 * demand, so it never "pauses" the way the old Supabase project did.
 *
 *   const rows = await sql<User>('SELECT * FROM users WHERE id = $1', [id])
 *
 * Always pass user input through params, never string concatenation.
 */

type Field = { name: string; dataTypeID: number }
type NeonResponse = { rows: Record<string, unknown>[] | unknown[][]; fields: Field[]; rowCount: number; command: string }

const INT_TYPES = new Set([20, 21, 23, 26, 700, 701, 1700]) // int8, int2, int4, oid, float4, float8, numeric
const BOOL = 16
const JSON_TYPES = new Set([114, 3802])

function connectionString(): string {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  return url
}

function endpoints(conn: string): string[] {
  const host = new URL(conn).hostname
  // Neon serves SQL-over-HTTP on the endpoint host; older projects also on api.<region> hosts.
  const rest = host.split('.').slice(1).join('.')
  return ['https://' + host + '/sql', 'https://api.' + rest + '/sql']
}

function parseValue(v: unknown, typeId: number): unknown {
  if (v === null || v === undefined) return null
  if (INT_TYPES.has(typeId)) return typeof v === 'number' ? v : Number(v)
  if (typeId === BOOL) return v === true || v === 't' || v === 'true'
  if (JSON_TYPES.has(typeId)) return typeof v === 'string' ? JSON.parse(v) : v
  return v
}

let preferred: string | null = null

export async function sql<T = Record<string, unknown>>(query: string, params: unknown[] = []): Promise<T[]> {
  const conn = connectionString()
  const urls = preferred ? [preferred] : endpoints(conn)
  let lastErr: unknown = null
  for (const url of urls) {
    let res: Response
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Neon-Connection-String': conn,
          'Neon-Raw-Text-Output': 'true',
          'Neon-Array-Mode': 'false',
        },
        body: JSON.stringify({ query, params: params.map(p => (p !== null && typeof p === 'object' && !(p instanceof Date) ? JSON.stringify(p) : p instanceof Date ? p.toISOString() : p)) }),
        cache: 'no-store',
      })
    } catch (e) {
      lastErr = e
      continue
    }
    if (res.status === 404 && !preferred) { lastErr = new Error('404 at ' + url); continue }
    const body = await res.json().catch(() => null)
    if (!res.ok) {
      const msg = body && typeof body === 'object' && 'message' in body ? String((body as { message: unknown }).message) : 'HTTP ' + res.status
      const err = new Error('DB: ' + msg) as Error & { code?: string }
      if (body && typeof body === 'object' && 'code' in body) err.code = String((body as { code: unknown }).code)
      throw err
    }
    preferred = url
    const data = body as NeonResponse
    const fields = data.fields || []
    return (data.rows as unknown as Record<string, unknown>[]).map(row => {
      const out: Record<string, unknown> = {}
      for (const f of fields) out[f.name] = parseValue(row[f.name], f.dataTypeID)
      return out as T
    })
  }
  throw lastErr instanceof Error ? lastErr : new Error('DB unreachable')
}

export async function one<T = Record<string, unknown>>(query: string, params: unknown[] = []): Promise<T | null> {
  const rows = await sql<T>(query, params)
  return rows[0] ?? null
}

export function isUniqueViolation(e: unknown): boolean {
  return !!e && typeof e === 'object' && (e as { code?: string }).code === '23505'
}

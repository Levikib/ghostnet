// Seed the recall card bank from the MODULE_CHECKS question pool. Idempotent:
// cards are keyed by (source, source_ref) with a unique index, so re-running is a no-op.
import { sql } from '../server/db'
import { MODULE_CHECKS } from '../assess/questions'

let seededThisProcess = false

/** Insert any missing bank cards. Cheap to call on every review request; guarded per process. */
export async function ensureCardBank(): Promise<void> {
  if (seededThisProcess) return

  const rows: unknown[][] = []
  for (const [moduleId, questions] of Object.entries(MODULE_CHECKS)) {
    for (const q of questions) {
      rows.push([
        moduleId,
        'mcq',
        'bank',
        q.id, // source_ref — stable, dedupes re-seeds
        q.q,
        q.code ?? null,
        String(q.answer), // correct option index, as text
        JSON.stringify(q.options),
        q.why,
        Math.min(10, Math.max(1, q.level * 2 + 1)), // difficulty_seed from tier
      ])
    }
  }
  if (!rows.length) { seededThisProcess = true; return }

  // Build one multi-row INSERT ... ON CONFLICT DO NOTHING.
  const cols = 10
  const values: string[] = []
  const params: unknown[] = []
  rows.forEach((r, i) => {
    const base = i * cols
    values.push(`($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6},$${base + 7},$${base + 8}::jsonb,$${base + 9},$${base + 10})`)
    params.push(...r)
  })

  await sql(
    `INSERT INTO recall_cards (module_id, kind, source, source_ref, prompt, code, answer, options, explain, difficulty_seed)
     VALUES ${values.join(',')}
     ON CONFLICT (source, source_ref) DO NOTHING`,
    params,
  )
  seededThisProcess = true
}

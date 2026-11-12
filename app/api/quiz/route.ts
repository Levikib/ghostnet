import { NextRequest } from 'next/server'
import { sql, one } from '../../../lib/server/db'
import { getSessionUser } from '../../../lib/server/session'
import { ensureSchema } from '../../../lib/server/schema'
import { fail, json, readJson } from '../../../lib/server/auth'
import { addXp } from '../../../lib/server/profile'
import { MODULE_IDS } from '../../../lib/learning'
import { GHOST_MODEL, GHOST_FALLBACK_MODEL } from '../../../lib/ghost/prompt'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const QUIZ_XP_MAX = 20 // most a chapter quiz can ever grant, scaled by score
const N_QUESTIONS = 12

type Q = { q: string; options: string[]; answer: number; why: string }

// --- Groq generation ------------------------------------------------------
async function generateQuiz(moduleTitle: string, chapterTitle: string, takeaways: string[]): Promise<Q[] | null> {
  const apiKey = process.env.GROQ_API_KEY || ''
  if (!apiKey) return null
  const system =
    'You are an expert cybersecurity instructor writing an end-of-chapter quiz. ' +
    'Output ONLY a valid JSON object, no prose, no markdown fences. ' +
    'Generate exactly ' + N_QUESTIONS + ' multiple-choice questions that test the chapter described by the user. ' +
    'Mix roughly 7 conceptual/recall questions with 5 PRACTICAL application questions ' +
    '("what would you run", "what does this output mean", "what is the risk", "what is the fix"). ' +
    'Each question has exactly 4 options with exactly one correct answer. Questions must be unambiguous and grounded ' +
    'strictly in this chapter\'s topic — do not ask about unrelated tools. ' +
    'JSON schema: {"questions":[{"q":string,"options":[string,string,string,string],"answer":0,"why":string}]} ' +
    'where "answer" is the 0-based index of the correct option and "why" is a one-sentence explanation.'
  const user =
    'Module: ' + moduleTitle + '\nChapter: ' + chapterTitle + '\nKey points covered in this chapter:\n' +
    takeaways.map((t, i) => (i + 1) + '. ' + t).join('\n')

  const call = (model: string) =>
    fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        max_tokens: 2600,
        response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      }),
    })

  try {
    let res = await call(GHOST_MODEL)
    if (!res.ok && (res.status === 404 || res.status === 400 || res.status === 503) && GHOST_FALLBACK_MODEL !== GHOST_MODEL) {
      res = await call(GHOST_FALLBACK_MODEL)
    }
    if (!res.ok) return null
    const data = await res.json()
    const content: string = data?.choices?.[0]?.message?.content || ''
    const match = content.match(/\{[\s\S]*\}/)
    if (!match) return null
    const parsed = JSON.parse(match[0])
    const raw = Array.isArray(parsed?.questions) ? parsed.questions : []
    const clean: Q[] = []
    for (const q of raw) {
      if (!q || typeof q.q !== 'string' || !Array.isArray(q.options)) continue
      const opts = q.options.map((o: unknown) => String(o)).slice(0, 4)
      const ans = Math.floor(Number(q.answer))
      if (opts.length !== 4 || !(ans >= 0 && ans <= 3)) continue
      clean.push({ q: q.q.slice(0, 400), options: opts, answer: ans, why: String(q.why || '').slice(0, 300) })
    }
    return clean.length >= 4 ? clean.slice(0, N_QUESTIONS) : null
  } catch (e) {
    console.error('[quiz] generation failed', e)
    return null
  }
}

async function loadOrCreate(moduleId: string, chapterId: string, moduleTitle: string, chapterTitle: string, takeaways: string[]): Promise<Q[] | null> {
  const cached = await one<{ questions: Q[] }>(`SELECT questions FROM chapter_quizzes WHERE module_id = $1 AND chapter_id = $2`, [moduleId, chapterId])
  if (cached?.questions && Array.isArray(cached.questions) && cached.questions.length) return cached.questions
  const gen = await generateQuiz(moduleTitle, chapterTitle, takeaways)
  if (!gen) return null
  await sql(
    `INSERT INTO chapter_quizzes (module_id, chapter_id, questions) VALUES ($1, $2, $3::jsonb)
     ON CONFLICT (module_id, chapter_id) DO NOTHING`,
    [moduleId, chapterId, JSON.stringify(gen)],
  ).catch(() => {})
  return gen
}

function validIds(moduleId: string, chapterId: string): boolean {
  return MODULE_IDS.has(moduleId) && /^[a-z0-9-]{1,40}$/i.test(chapterId)
}

// POST { action: 'get'|'grade', moduleId, chapterId, title?, chapterTitle?, takeaways?, answers? }
export async function POST(req: NextRequest) {
  try {
    const s = await getSessionUser(req)
    if (!s) return fail('Sign in first.', 401)
    await ensureSchema()
    const b = await readJson<Record<string, unknown>>(req)
    const action = typeof b.action === 'string' ? b.action : 'get'
    const moduleId = String(b.moduleId || '')
    const chapterId = String(b.chapterId || '')
    if (!validIds(moduleId, chapterId)) return fail('Unknown chapter.', 400)

    if (action === 'get') {
      const moduleTitle = String(b.title || moduleId).slice(0, 200)
      const chapterTitle = String(b.chapterTitle || chapterId).slice(0, 200)
      const takeaways = (Array.isArray(b.takeaways) ? b.takeaways : []).map(t => String(t).slice(0, 300)).slice(0, 12)
      const quiz = await loadOrCreate(moduleId, chapterId, moduleTitle, chapterTitle, takeaways)
      if (!quiz) return fail('The quiz could not be generated right now. Please try again in a moment.', 503)
      const prev = await one<{ best_correct: number; total: number; xp_awarded: number }>(
        `SELECT best_correct, total, xp_awarded FROM quiz_results WHERE user_id = $1 AND module_id = $2 AND chapter_id = $3`,
        [s.id, moduleId, chapterId],
      )
      // Strip the answers before sending to the client.
      return json({
        ok: true,
        questions: quiz.map(q => ({ q: q.q, options: q.options })),
        count: quiz.length,
        maxXp: QUIZ_XP_MAX,
        best: prev ? { correct: prev.best_correct, total: prev.total, xpAwarded: prev.xp_awarded } : null,
      })
    }

    if (action === 'grade') {
      const answers = (Array.isArray(b.answers) ? b.answers : []).map(a => Math.floor(Number(a)))
      const quiz = await one<{ questions: Q[] }>(`SELECT questions FROM chapter_quizzes WHERE module_id = $1 AND chapter_id = $2`, [moduleId, chapterId])
      if (!quiz?.questions?.length) return fail('Load the quiz first.', 400)
      const qs = quiz.questions
      let correct = 0
      const results = qs.map((q, i) => {
        const picked = answers[i]
        const ok = picked === q.answer
        if (ok) correct++
        return { answer: q.answer, correct: ok, why: q.why }
      })
      const total = qs.length
      const awarded = Math.round((QUIZ_XP_MAX * correct) / total)

      const prev = await one<{ best_correct: number; xp_awarded: number }>(
        `SELECT best_correct, xp_awarded FROM quiz_results WHERE user_id = $1 AND module_id = $2 AND chapter_id = $3`,
        [s.id, moduleId, chapterId],
      )
      const prevXp = prev?.xp_awarded ?? 0
      const delta = Math.max(0, awarded - prevXp) // can improve, never farm
      await sql(
        `INSERT INTO quiz_results (user_id, module_id, chapter_id, best_correct, total, attempts, xp_awarded)
         VALUES ($1, $2, $3, $4, $5, 1, $6)
         ON CONFLICT (user_id, module_id, chapter_id) DO UPDATE SET
           best_correct = GREATEST(quiz_results.best_correct, $4),
           total = $5, attempts = quiz_results.attempts + 1,
           xp_awarded = GREATEST(quiz_results.xp_awarded, $6), updated_at = now()`,
        [s.id, moduleId, chapterId, correct, total, awarded],
      )
      if (delta > 0) {
        await addXp(s.id, delta)
        await sql(`INSERT INTO activity (user_id, kind, module_id, ref, xp) VALUES ($1, 'quiz', $2, $3, $4)`, [s.id, moduleId, chapterId, delta]).catch(() => {})
      }
      return json({ ok: true, correct, total, results, xpEarned: delta, maxXp: QUIZ_XP_MAX })
    }

    return fail('Unknown action.', 400)
  } catch (e) {
    console.error('[quiz]', e)
    return fail('Quiz error. Try again.', 500)
  }
}

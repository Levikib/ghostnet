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
const N_QUESTIONS = 14
const GEN_VERSION = 2 // bump to invalidate every cached quiz and regenerate with a better prompt

type Q = { q: string; options: string[]; answer: number; why: string }

// --- Groq generation ------------------------------------------------------
async function generateQuiz(
  moduleTitle: string, chapterTitle: string, takeaways: string[],
  priorTitles: string[], priorTakeaways: string[],
): Promise<Q[] | null> {
  const apiKey = process.env.GROQ_API_KEY || ''
  if (!apiKey) return null

  const cumulative = priorTakeaways.length > 0
  const system =
    'You are a demanding cybersecurity examiner writing the end-of-chapter test for a rigorous, hands-on course that aims to produce genuinely skilled operators. ' +
    'Output ONLY a valid JSON object — no prose, no markdown fences. ' +
    'Write exactly ' + N_QUESTIONS + ' multiple-choice questions that TEST MASTERY of the current chapter. Make them count:\n' +
    '- Difficulty spread: ~4 foundational recall, ~6 applied ("what command/option would you use", "what does this output/log/code mean", "what is the risk", "what is the correct fix"), and ~4 harder SCENARIO questions that require reasoning, not memorisation.\n' +
    '- Every question must be unambiguous with EXACTLY ONE correct option and three PLAUSIBLE distractors (common mistakes or near-misses — never obviously silly, never "all/none of the above").\n' +
    '- Favour practical judgement over trivia. Where the chapter shows commands, tools, outputs or attack/defence steps, ask about those concretely.\n' +
    (cumulative
      ? '- This is a LATER chapter. Where it is genuinely relevant, write some questions that INTEGRATE earlier concepts from this module with the current chapter (e.g. an advanced step that depends on a foundational idea). Build cumulatively — a strong learner should have retained the basics. Do not quiz earlier material in isolation; weave it into current-chapter reasoning.\n'
      : '') +
    '- Ground every question strictly in this module\'s subject matter. No unrelated tools or trivia.\n' +
    'JSON schema: {"questions":[{"q":string,"options":[string,string,string,string],"answer":0,"why":string}]} ' +
    'where "answer" is the 0-based index of the correct option and "why" is a one-sentence explanation of why it is correct.'

  const user =
    'MODULE: ' + moduleTitle + '\n' +
    (priorTitles.length ? 'EARLIER CHAPTERS IN THIS MODULE (already learned): ' + priorTitles.join('; ') + '\n' : '') +
    'CURRENT CHAPTER: ' + chapterTitle + '\n\n' +
    'KEY POINTS OF THE CURRENT CHAPTER (base most questions here):\n' + takeaways.map((t, i) => (i + 1) + '. ' + t).join('\n') +
    (cumulative ? '\n\nFOUNDATIONS FROM EARLIER CHAPTERS (fair game to integrate where relevant):\n' + priorTakeaways.map(t => '- ' + t).join('\n') : '')

  const call = (model: string) =>
    fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
      body: JSON.stringify({
        model,
        temperature: 0.55,
        max_tokens: 3200,
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
    const seen = new Set<string>()
    for (const q of raw) {
      if (!q || typeof q.q !== 'string') continue
      const qtext = q.q.trim()
      const key = qtext.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60)
      if (!qtext || seen.has(key)) continue // drop blanks + near-duplicates
      if (!Array.isArray(q.options)) continue
      const opts = q.options.map((o: unknown) => String(o).trim()).filter(Boolean)
      const distinct = new Set(opts.map(o => o.toLowerCase()))
      if (opts.length !== 4 || distinct.size !== 4) continue // need 4 distinct, non-empty options
      const ans = Math.floor(Number(q.answer))
      if (!(ans >= 0 && ans <= 3)) continue
      seen.add(key)
      clean.push({ q: qtext.slice(0, 500), options: opts.map((o: string) => o.slice(0, 220)), answer: ans, why: String(q.why || '').slice(0, 320) })
    }
    return clean.length >= 6 ? clean.slice(0, N_QUESTIONS) : null
  } catch (e) {
    console.error('[quiz] generation failed', e)
    return null
  }
}

async function loadOrCreate(
  moduleId: string, chapterId: string, moduleTitle: string, chapterTitle: string,
  takeaways: string[], priorTitles: string[], priorTakeaways: string[],
): Promise<Q[] | null> {
  const cached = await one<{ questions: Q[]; gen_version: number }>(
    `SELECT questions, gen_version FROM chapter_quizzes WHERE module_id = $1 AND chapter_id = $2`, [moduleId, chapterId],
  )
  if (cached?.questions && Array.isArray(cached.questions) && cached.questions.length && (cached.gen_version ?? 1) >= GEN_VERSION) {
    return cached.questions
  }
  const gen = await generateQuiz(moduleTitle, chapterTitle, takeaways, priorTitles, priorTakeaways)
  if (!gen) return cached?.questions?.length ? cached.questions : null // fall back to an old quiz rather than nothing
  await sql(
    `INSERT INTO chapter_quizzes (module_id, chapter_id, questions, gen_version) VALUES ($1, $2, $3::jsonb, $4)
     ON CONFLICT (module_id, chapter_id) DO UPDATE SET questions = $3::jsonb, gen_version = $4, created_at = now()`,
    [moduleId, chapterId, JSON.stringify(gen), GEN_VERSION],
  ).catch(() => {})
  return gen
}

function validIds(moduleId: string, chapterId: string): boolean {
  return MODULE_IDS.has(moduleId) && /^[a-z0-9-]{1,40}$/i.test(chapterId)
}

const strArr = (v: unknown, cap: number, len: number) =>
  (Array.isArray(v) ? v : []).map(t => String(t).slice(0, len)).filter(Boolean).slice(0, cap)

// POST { action: 'get'|'grade', moduleId, chapterId, title?, chapterTitle?, takeaways?, priorTitles?, priorTakeaways?, answers? }
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
      const takeaways = strArr(b.takeaways, 14, 320)
      const priorTitles = strArr(b.priorTitles, 20, 120)
      const priorTakeaways = strArr(b.priorTakeaways, 24, 300)
      const quiz = await loadOrCreate(moduleId, chapterId, moduleTitle, chapterTitle, takeaways, priorTitles, priorTakeaways)
      if (!quiz) return fail('The quiz could not be generated right now. Please try again in a moment.', 503)
      const prev = await one<{ best_correct: number; total: number; xp_awarded: number }>(
        `SELECT best_correct, total, xp_awarded FROM quiz_results WHERE user_id = $1 AND module_id = $2 AND chapter_id = $3`,
        [s.id, moduleId, chapterId],
      )
      return json({
        ok: true,
        questions: quiz.map(q => ({ q: q.q, options: q.options })), // answers stripped
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
        const ok = answers[i] === q.answer
        if (ok) correct++
        return { answer: q.answer, correct: ok, why: q.why }
      })
      const total = qs.length
      const awarded = Math.round((QUIZ_XP_MAX * correct) / total)
      const prev = await one<{ xp_awarded: number }>(
        `SELECT xp_awarded FROM quiz_results WHERE user_id = $1 AND module_id = $2 AND chapter_id = $3`,
        [s.id, moduleId, chapterId],
      )
      const delta = Math.max(0, awarded - (prev?.xp_awarded ?? 0)) // improve, never farm
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

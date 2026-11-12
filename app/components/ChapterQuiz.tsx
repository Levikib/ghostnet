'use client'
// End-of-chapter graded quiz. Questions are generated once per chapter by GHOST (server-side,
// cached) and graded on the server so answers never reach the client until after you submit.
// Scoring awards up to 20 XP, scaled by how many you get right; retakes can only improve.
import React, { useState } from 'react'
import { api } from '../../lib/client/api'

type QGet = { q: string; options: string[] }
type GradeResult = { answer: number; correct: boolean; why: string }

export default function ChapterQuiz({
  moduleId, moduleTitle, chapterId, chapterTitle, takeaways, priorTitles = [], priorTakeaways = [], accent,
}: { moduleId: string; moduleTitle: string; chapterId: string; chapterTitle: string; takeaways: string[]; priorTitles?: string[]; priorTakeaways?: string[]; accent: string }) {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'active' | 'graded' | 'error'>('idle')
  const [questions, setQuestions] = useState<QGet[]>([])
  const [picks, setPicks] = useState<Record<number, number>>({})
  const [results, setResults] = useState<GradeResult[]>([])
  const [score, setScore] = useState<{ correct: number; total: number; xp: number } | null>(null)
  const [best, setBest] = useState<{ correct: number; total: number } | null>(null)
  const [err, setErr] = useState('')

  async function start() {
    setPhase('loading'); setErr('')
    const r = await api<{ questions: QGet[]; best: { correct: number; total: number } | null }>(
      '/api/quiz', { action: 'get', moduleId, chapterId, title: moduleTitle, chapterTitle, takeaways, priorTitles, priorTakeaways }, 'POST',
    )
    if (r.ok === false || !Array.isArray((r as { questions?: QGet[] }).questions)) {
      setErr((r as { error?: string }).error || 'Could not load the quiz.'); setPhase('error'); return
    }
    const data = r as unknown as { questions: QGet[]; best: { correct: number; total: number } | null }
    setQuestions(data.questions); setBest(data.best); setPicks({}); setResults([]); setScore(null); setPhase('active')
  }

  async function submit() {
    if (Object.keys(picks).length < questions.length) return
    setPhase('loading')
    const answers = questions.map((_, i) => picks[i])
    const r = await api<{ correct: number; total: number; results: GradeResult[]; xpEarned: number }>(
      '/api/quiz', { action: 'grade', moduleId, chapterId, answers }, 'POST',
    )
    if (r.ok === false) { setErr((r as { error?: string }).error || 'Could not grade.'); setPhase('error'); return }
    const data = r as unknown as { correct: number; total: number; results: GradeResult[]; xpEarned: number }
    setResults(data.results); setScore({ correct: data.correct, total: data.total, xp: data.xpEarned }); setPhase('graded')
  }

  const answeredAll = Object.keys(picks).length >= questions.length && questions.length > 0
  const pct = score ? Math.round((score.correct / score.total) * 100) : 0

  return (
    <section className="cq" style={{ ['--cq' as string]: accent } as React.CSSProperties} aria-label="Chapter quiz">
      <div className="cq-head">
        <div>
          <div className="cq-eyebrow">⚡ TEST YOURSELF</div>
          <div className="cq-title">End-of-chapter quiz</div>
          <div className="cq-sub">
            {phase === 'graded' && score
              ? score.correct + ' / ' + score.total + ' correct · ' + (score.xp > 0 ? '+' + score.xp + ' XP earned' : 'no new XP (already scored higher)')
              : best
                ? 'Graded · earn up to 20 XP · best so far ' + best.correct + '/' + best.total
                : 'A dozen questions — recall and practical. Graded, earns up to 20 XP.'}
          </div>
        </div>
        {phase === 'idle' && <button className="gx-btn gx-btn--primary" style={{ ['--accent' as string]: accent } as React.CSSProperties} onClick={start}>START QUIZ ▸</button>}
        {phase === 'loading' && <span className="cq-load">WORKING…</span>}
        {(phase === 'graded' || phase === 'error') && <button className="gx-btn gx-btn--ghost" onClick={start}>RETAKE</button>}
      </div>

      {phase === 'error' && <div className="cq-err">{err} <button className="cq-link" onClick={start}>Try again</button></div>}

      {(phase === 'active' || phase === 'graded') && (
        <div className="cq-body">
          {questions.map((q, i) => {
            const picked = picks[i]
            const res = results[i]
            return (
              <div key={i} className="cq-q">
                <div className="cq-q-text"><span className="cq-num">{i + 1}</span>{q.q}</div>
                <div className="cq-opts">
                  {q.options.map((opt, j) => {
                    const isPicked = picked === j
                    const isAnswer = res && res.answer === j
                    const isWrongPick = res && isPicked && !res.correct
                    const cls = 'cq-opt' + (isPicked ? ' picked' : '') + (isAnswer ? ' correct' : '') + (isWrongPick ? ' wrong' : '')
                    return (
                      <button key={j} className={cls} disabled={phase === 'graded'} onClick={() => setPicks(p => ({ ...p, [i]: j }))}>
                        <span className="cq-key">{String.fromCharCode(65 + j)}</span><span>{opt}</span>
                        {isAnswer && <span className="cq-mark ok">✓</span>}
                        {isWrongPick && <span className="cq-mark no">✗</span>}
                      </button>
                    )
                  })}
                </div>
                {res && <div className="cq-why">{res.why}</div>}
              </div>
            )
          })}

          {phase === 'active' && (
            <button className="gx-btn gx-btn--primary cq-submit" style={{ ['--accent' as string]: accent } as React.CSSProperties} disabled={!answeredAll} onClick={submit}>
              {answeredAll ? 'SUBMIT & GRADE ▸' : 'ANSWER ALL ' + questions.length + ' TO SUBMIT'}
            </button>
          )}
          {phase === 'graded' && score && (
            <div className="cq-result" data-pass={pct >= 70}>
              <div className="cq-result-pct">{pct}%</div>
              <div className="cq-result-txt">
                {pct >= 70 ? 'Strong — you know this chapter.' : 'Review the misses above, then retake to lift your score.'}
                {score.xp > 0 && <strong> +{score.xp} XP</strong>}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .cq { margin-top: 20px; border-radius: 14px; border: 1px solid color-mix(in srgb, var(--cq) 26%, transparent); background: color-mix(in srgb, var(--cq) 5%, var(--gx-s1, #06090d)); padding: 16px 18px; }
        .cq-head { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; }
        .cq-eyebrow { font-family: var(--mono); font-size: 9.5px; letter-spacing: .18em; color: var(--cq); }
        .cq-title { font-family: var(--sans); font-weight: 650; font-size: 16px; color: var(--tx); margin-top: 3px; }
        .cq-sub { font-family: var(--sans); font-size: 12.5px; color: var(--tx-dim); margin-top: 3px; max-width: 52ch; }
        .cq-load { font-family: var(--mono); font-size: 11px; color: var(--cq); letter-spacing: .14em; }
        .cq-err { margin-top: 12px; font-family: var(--sans); font-size: 13px; color: #ffc0b8; }
        .cq-link { background: none; border: none; color: var(--cyan); cursor: pointer; font: inherit; text-decoration: underline; padding: 0; }
        .cq-body { margin-top: 16px; display: grid; gap: 14px; }
        .cq-q-text { font-family: var(--sans); font-weight: 600; font-size: 14px; color: var(--tx); line-height: 1.5; display: flex; gap: 9px; }
        .cq-num { flex: none; font-family: var(--mono); font-size: 12px; color: var(--cq); }
        .cq-opts { display: grid; gap: 7px; margin: 9px 0 0 23px; }
        .cq-opt { display: flex; align-items: center; gap: 9px; text-align: left; padding: 8px 11px; border-radius: 9px; cursor: pointer; font-family: var(--sans); font-size: 13.5px; color: var(--tx-body); background: rgba(232,243,246,.04); border: 1px solid rgba(232,243,246,.07); transition: background .12s, box-shadow .12s; }
        .cq-opt:hover:not(:disabled) { background: rgba(232,243,246,.08); }
        .cq-opt:disabled { cursor: default; }
        .cq-opt.picked { box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--cq) 60%, transparent); }
        .cq-opt.correct { box-shadow: inset 0 0 0 1.5px rgba(0,255,65,.6); color: var(--tx); }
        .cq-opt.wrong { box-shadow: inset 0 0 0 1.5px rgba(255,65,54,.6); color: var(--tx); }
        .cq-key { flex: none; width: 21px; height: 21px; border-radius: 6px; display: grid; place-items: center; font-family: var(--mono); font-size: 11px; font-weight: 700; color: var(--cq); background: color-mix(in srgb, var(--cq) 12%, transparent); }
        .cq-mark { margin-left: auto; font-family: var(--mono); font-weight: 700; }
        .cq-mark.ok { color: var(--green, #00ff41); }
        .cq-mark.no { color: var(--red, #ff4136); }
        .cq-why { font-family: var(--sans); font-size: 12.5px; color: var(--tx-dim); margin: 8px 0 0 23px; line-height: 1.55; border-left: 2px solid color-mix(in srgb, var(--cq) 40%, transparent); padding-left: 10px; }
        .cq-submit { margin-top: 4px; }
        .cq-result { display: flex; align-items: center; gap: 14px; margin-top: 6px; padding: 12px 14px; border-radius: 10px; background: rgba(232,243,246,.04); }
        .cq-result-pct { font-family: var(--mono); font-size: 28px; font-weight: 800; color: var(--cq); }
        .cq-result[data-pass="true"] .cq-result-pct { color: var(--green, #00ff41); }
        .cq-result-txt { font-family: var(--sans); font-size: 13.5px; color: var(--tx-body); line-height: 1.5; }
      `}</style>
    </section>
  )
}

'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../components/AuthProvider'
import { api } from '../../lib/client/api'
import { PLACEMENT, DOMAINS, Domain } from '../../lib/assess/questions'
import { pathById } from '../../lib/paths'
import { Bar, Eyebrow, GxStyles, Ring, T, accentText } from '../components/gx/Gx'
import { Decode, HackStyles } from '../components/hack/Hack'
import CityNet from '../components/hack/CityNet'

type Phase = 'intro' | 'quiz' | 'scoring' | 'result'
type Result = { domains: Record<string, number>; overall: number; strengths: string[]; gaps: string[]; recommended: string; readiness: Record<string, string> }

const LEVEL_WORD = ['Not yet', 'Fundamentals', 'Practitioner', 'Advanced', 'Expert']
const domainLabel = (id: string) => DOMAINS.find(d => d.id === id)?.label || id
const MIN_TO_SCORE = 8

export default function AssessPage() {
  const router = useRouter()
  const { profile, loading, refreshProfile } = useAuth()
  const [phase, setPhase] = useState<Phase>('intro')
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [choosing, setChoosing] = useState(false)

  // Ramp difficulty: all level-1 first, then 2, 3, 4; interleave domains within a level.
  const questions = useMemo(() => PLACEMENT.slice().sort((a, b) => (a.level - b.level) || a.domain.localeCompare(b.domain)), [])

  useEffect(() => { if (!loading && !profile) router.replace('/auth?mode=login&from=/assess') }, [loading, profile, router])

  const answered = Object.keys(answers).length
  const q = questions[i]

  function choose(idx: number) {
    setAnswers(a => ({ ...a, [q.id]: idx }))
    setTimeout(() => advance(), 140)
  }
  function advance() { if (i < questions.length - 1) setI(i + 1); else score() }
  function skip() { advance() }

  async function score() {
    setPhase('scoring'); setError(null)
    const r = await api<Result>('/api/placement', { answers }, 'POST')
    if (r.ok === false) { setError(r.error || 'Could not score.'); setPhase('quiz'); return }
    setResult(r as unknown as Result)
    setPhase('result')
    refreshProfile()
  }

  async function startPath(id: string) {
    setChoosing(true)
    await api('/api/path', { pathId: id }, 'POST')
    await refreshProfile()
    const p = pathById(id)
    const first = p ? p.stages.flatMap(s => s.modules)[0] : 'foundations'
    router.push('/modules/' + first)
  }

  if (!profile) return <div style={{ minHeight: '60vh' }} />

  return (
    <div className="as-root">
      <GxStyles /><HackStyles />
      <CityNet intensity={0.3} style={{ opacity: 0.4, zIndex: 0 }} />
      <div className="as-wrap">
        {phase === 'intro' && (
          <section className="gx-clay as-card hx-in" style={{ ['--accent' as string]: T.cyan } as React.CSSProperties}>
            <Eyebrow>{'// CALIBRATION'}</Eyebrow>
            <h1 className="as-h1"><Decode text="FIND YOUR LEVEL" duration={700} /></h1>
            <p className="as-lead">
              A short diagnostic across ten skill areas, from Linux and networking to exploitation, cloud and defence.
              Answer what you know and skip the rest — it maps where you stand and builds you a route from there.
            </p>
            <ul className="as-points">
              <li><b>{questions.length}</b> questions, four difficulty tiers</li>
              <li>Skip anything you are unsure of — no penalty to your account, it just maps your level</li>
              <li>Finish any time after {MIN_TO_SCORE} answers</li>
              <li>Get a per-skill readout, a recommended path, and which basics you can skip</li>
            </ul>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
              <button className="gx-btn gx-btn--primary" onClick={() => setPhase('quiz')}>BEGIN CALIBRATION ▸</button>
              <Link href="/paths" className="gx-btn gx-btn--ghost">SKIP — BROWSE PATHS</Link>
            </div>
          </section>
        )}

        {phase === 'quiz' && q && (
          <section className="as-quiz hx-in" key={q.id}>
            <div className="as-quiz-top">
              <Eyebrow color={T.dimHi}>{domainLabel(q.domain).toUpperCase() + ' · TIER ' + q.level}</Eyebrow>
              <span style={{ fontFamily: T.mono, fontSize: '12px', color: T.dimHi }}>{i + 1} / {questions.length}</span>
            </div>
            <div style={{ margin: '10px 0 22px' }}><Bar value={((i) / questions.length) * 100} color={T.cyan} height={8} label="Progress" /></div>

            <div className="gx-clay as-card" style={{ ['--accent' as string]: T.cyan } as React.CSSProperties}>
              <h2 className="as-q">{q.q}</h2>
              {q.code && <pre className="as-code">{q.code}</pre>}
              <div className="as-opts">
                {q.options.map((opt, idx) => (
                  <button key={idx} className="as-opt" onClick={() => choose(idx)} aria-pressed={answers[q.id] === idx}>
                    <span className="as-opt-key">{String.fromCharCode(65 + idx)}</span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="as-quiz-foot">
              <button className="gx-btn gx-btn--ghost" onClick={skip}>NOT SURE · SKIP</button>
              <button className="gx-btn gx-btn--secondary" style={{ ['--accent' as string]: T.cyan } as React.CSSProperties} onClick={score} disabled={answered < MIN_TO_SCORE}>
                {answered < MIN_TO_SCORE ? 'ANSWER ' + (MIN_TO_SCORE - answered) + ' MORE' : 'FINISH & SCORE ▸'}
              </button>
            </div>
            {error && <div className="as-err">{error}</div>}
          </section>
        )}

        {phase === 'scoring' && (
          <div className="as-scoring"><div style={{ fontFamily: T.mono, fontSize: '13px', letterSpacing: '.3em', color: T.cyan }}><Decode text="ANALYSING YOUR SIGNAL…" duration={600} /></div></div>
        )}

        {phase === 'result' && result && (
          <section className="hx-in" style={{ width: '100%' }}>
            <Eyebrow>{'// CALIBRATION COMPLETE'}</Eyebrow>
            <h1 className="as-h1"><Decode text="YOUR SKILL MAP" duration={700} /></h1>
            <div className="as-grid">
              <div className="gx-clay as-card">
                <div className="as-sub">SKILL BREAKDOWN</div>
                <div style={{ display: 'grid', gap: '12px', marginTop: '14px' }}>
                  {DOMAINS.map(d => {
                    const lvl = result.domains[d.id] ?? 0
                    const col = lvl >= 3 ? T.green : lvl >= 2 ? T.cyan : lvl >= 1 ? T.amber : T.dim
                    return (
                      <div key={d.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontFamily: T.sans, fontSize: '14px', color: T.body }}>{d.label}</span>
                          <span style={{ fontFamily: T.mono, fontSize: '11.5px', color: col }}>{LEVEL_WORD[lvl].toUpperCase()}</span>
                        </div>
                        <Bar value={(lvl / 4) * 100} color={col} height={8} label={d.label} />
                      </div>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gap: '16px', alignContent: 'start' }}>
                {(() => {
                  const p = pathById(result.recommended)
                  if (!p) return null
                  return (
                    <div className="gx-clay as-card" style={{ ['--accent' as string]: p.color } as React.CSSProperties}>
                      <div className="as-sub" style={{ color: accentText(p.color) }}>RECOMMENDED PATH</div>
                      <h2 style={{ fontFamily: T.mono, fontSize: '20px', color: T.tx, margin: '10px 0 6px', letterSpacing: '.04em' }}>{p.title}</h2>
                      <p style={{ fontFamily: T.sans, fontSize: '14px', color: T.body, lineHeight: 1.55, margin: '0 0 8px' }}>{p.tagline}</p>
                      <p style={{ fontFamily: T.sans, fontSize: '13px', color: T.dim, margin: 0 }}>{p.outcome}</p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '18px' }}>
                        <button className="gx-btn gx-btn--primary" disabled={choosing} onClick={() => startPath(p.id)}>START THIS PATH ▸</button>
                        <Link href="/paths" className="gx-btn gx-btn--ghost">SEE ALL PATHS</Link>
                      </div>
                    </div>
                  )
                })()}
                <div className="gx-clay as-card">
                  <div className="as-sub">WHAT THIS MEANS</div>
                  <p style={{ fontFamily: T.sans, fontSize: '13.5px', color: T.body, lineHeight: 1.6, margin: '10px 0 0' }}>
                    {result.overall < 1.2
                      ? 'You are starting fresh — exactly who GHOSTNET is built for. Your path begins with Foundations, Linux and scripting, then builds up.'
                      : result.strengths.length
                        ? 'You are already strong in ' + result.strengths.map(domainLabel).join(', ') + '. Your path lets you move fast through what you know and go deep where it counts.'
                        : 'You have a solid base. Your path fills the gaps and takes you to real depth.'}
                    {result.gaps.length ? ' Worth shoring up: ' + result.gaps.map(domainLabel).join(', ') + '.' : ''}
                  </p>
                  <p style={{ fontFamily: T.sans, fontSize: '13px', color: T.dim, margin: '12px 0 0' }}>On your path, modules you have already mastered are marked so you can skip or skim them. Retake this any time to re-check.</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <style>{`
        .as-root { position: relative; min-height: 100%; color: var(--tx); }
        .as-root > :not(canvas) { position: relative; z-index: 1; }
        .as-wrap { max-width: 920px; margin: 0 auto; padding: 24px 0 60px; }
        .as-card { padding: clamp(20px, 4vw, 32px); }
        .as-h1 { font-family: var(--mono); font-weight: 800; font-size: clamp(26px, 5vw, 40px); letter-spacing: .06em; color: var(--tx); margin: 10px 0 16px; }
        .as-lead { font-family: var(--sans); font-size: 16px; line-height: 1.65; color: var(--tx-body); max-width: 62ch; margin: 0 0 18px; }
        .as-points { list-style: none; margin: 0; padding: 0; display: grid; gap: 9px; }
        .as-points li { font-family: var(--sans); font-size: 14.5px; color: var(--tx-body); padding-left: 20px; position: relative; }
        .as-points li::before { content: ''; position: absolute; left: 0; top: .55em; width: 7px; height: 7px; background: var(--cyan); transform: rotate(45deg); }
        .as-points b { color: var(--tx); font-family: var(--mono); }
        .as-quiz-top { display: flex; justify-content: space-between; align-items: baseline; }
        .as-q { font-family: var(--sans); font-weight: 600; font-size: clamp(18px, 3vw, 22px); line-height: 1.4; color: var(--tx); margin: 0 0 16px; }
        .as-code { font-family: var(--mono); font-size: 13px; line-height: 1.6; background: #071017; border: 1px solid rgba(232,243,246,.08); color: #d6f5e0; padding: 12px 14px; overflow-x: auto; margin: 0 0 18px; white-space: pre; }
        .as-opts { display: grid; gap: 10px; }
        .as-opt { display: flex; gap: 12px; align-items: center; text-align: left; padding: 14px 16px; border-radius: 12px; cursor: pointer; font-family: var(--sans); font-size: 15px; color: var(--tx-body);
          background: var(--clay-face); box-shadow: var(--e-clay); border: 1px solid rgba(232,243,246,.05); transition: transform .14s, color .14s, box-shadow .14s; }
        .as-opt:hover { transform: translateY(-1px); color: var(--tx); box-shadow: var(--e-clay-hi), 0 0 0 1px rgba(0,212,255,.3); }
        .as-opt[aria-pressed="true"] { box-shadow: var(--e-pressed), 0 0 0 2px var(--cyan); color: var(--tx); }
        .as-opt-key { flex: none; width: 26px; height: 26px; border-radius: 7px; display: grid; place-items: center; font-family: var(--mono); font-size: 12px; font-weight: 700; color: var(--cyan); background: rgba(0,212,255,.08); }
        .as-opt:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
        .as-quiz-foot { display: flex; justify-content: space-between; gap: 12px; margin-top: 20px; flex-wrap: wrap; }
        .as-err { margin-top: 12px; color: #ffc0b8; font-family: var(--sans); font-size: 14px; }
        .as-scoring { min-height: 40vh; display: grid; place-items: center; }
        .as-sub { font-family: var(--mono); font-size: 11px; font-weight: 700; letter-spacing: .22em; color: var(--tx-dim-hi); }
        .as-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 20px; align-items: start; margin-top: 16px; }
        @media (max-width: 760px) { .as-grid { grid-template-columns: minmax(0, 1fr); } }
      `}</style>
    </div>
  )
}

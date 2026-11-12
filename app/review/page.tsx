'use client'
import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../components/AuthProvider'
import { api } from '../../lib/client/api'
import { CATALOG } from '../../lib/learning'
import { Bar, Eyebrow, GxStyles, T, accentText } from '../components/gx/Gx'
import { Decode, HackStyles } from '../components/hack/Hack'
import CityNet from '../components/hack/CityNet'

type Card = { id: string; moduleId: string; prompt: string; code: string | null; options: string[]; kind: string; isNew: boolean }
type Queue = { cards: Card[]; due: number; reviewedToday: number; cap: number; streak: number }
type Graded = { correct: boolean; answer: number; explain: string; intervalDays: number; streak: number }

const catTitle = (id: string) => CATALOG.find(m => m.id === id)?.title || id
const catColor = (id: string) => CATALOG.find(m => m.id === id)?.color || T.cyan

function intervalWord(days: number): string {
  if (days <= 1) return 'tomorrow'
  if (days < 7) return 'in ' + days + ' days'
  if (days < 30) return 'in ' + Math.round(days / 7) + ' week' + (days >= 14 ? 's' : '')
  if (days < 365) return 'in ' + Math.round(days / 30) + ' month' + (days >= 60 ? 's' : '')
  return 'in a year'
}

export default function ReviewPage() {
  const router = useRouter()
  const { profile, loading } = useAuth()
  const [queue, setQueue] = useState<Queue | null>(null)
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [graded, setGraded] = useState<Graded | null>(null)
  const [done, setDone] = useState(0)
  const [right, setRight] = useState(0)
  const [finished, setFinished] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => { if (!loading && !profile) router.replace('/auth?mode=login&from=/review') }, [loading, profile, router])

  const load = useCallback(async () => {
    setErr(null)
    const r = await api<Queue>('/api/review?n=15')
    if (r.ok === false) { setErr(r.error || 'Could not load.'); return }
    setQueue(r as unknown as Queue)
    setI(0); setPicked(null); setGraded(null); setFinished(false); setDone(0); setRight(0)
  }, [])

  useEffect(() => { if (profile) load() }, [profile, load])

  if (!profile || !queue) return <div style={{ minHeight: '60vh' }} />

  const card = queue.cards[i]

  async function choose(idx: number) {
    if (picked !== null || !card) return
    setPicked(idx)
    const r = await api<Graded>('/api/review', { cardId: card.id, chosenIndex: idx }, 'POST')
    if (r.ok === false) { setErr(r.error || 'Could not record.'); setPicked(null); return }
    const g = r as unknown as Graded
    setGraded(g)
    setDone(d => d + 1)
    if (g.correct) setRight(x => x + 1)
  }

  function next() {
    if (!queue) return
    if (i < queue.cards.length - 1) { setI(i + 1); setPicked(null); setGraded(null) }
    else setFinished(true)
  }

  // Nothing due and nothing new to seed.
  if (queue.cards.length === 0 && !finished) {
    return (
      <div className="rv-root">
        <GxStyles /><HackStyles />
        <CityNet intensity={0.25} style={{ opacity: 0.35, zIndex: 0 }} />
        <div className="rv-wrap">
          <section className="gx-clay rv-card hx-in" style={{ ['--accent' as string]: T.green, textAlign: 'center' } as React.CSSProperties}>
            <Eyebrow color={T.green}>{'// INBOX ZERO'}</Eyebrow>
            <h1 className="rv-h1"><Decode text="ALL CAUGHT UP" duration={600} /></h1>
            <p className="rv-lead" style={{ margin: '0 auto 20px' }}>
              No cards are due right now. Your memory is fresh. Keep working through modules — new material becomes review cards,
              and they resurface exactly when you are about to forget them.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" className="gx-btn gx-btn--primary">BACK TO DASHBOARD</Link>
              <Link href="/paths" className="gx-btn gx-btn--ghost">CONTINUE A PATH</Link>
            </div>
            {queue.streak > 0 && <p style={{ fontFamily: T.mono, fontSize: '12px', color: T.dimHi, marginTop: '22px', letterSpacing: '.1em' }}>REVIEW STREAK · {queue.streak} DAY{queue.streak === 1 ? '' : 'S'}</p>}
          </section>
        </div>
      </div>
    )
  }

  if (finished) {
    const pct = done ? Math.round((right / done) * 100) : 0
    return (
      <div className="rv-root">
        <GxStyles /><HackStyles />
        <CityNet intensity={0.3} style={{ opacity: 0.4, zIndex: 0 }} />
        <div className="rv-wrap">
          <section className="gx-clay rv-card hx-in" style={{ ['--accent' as string]: T.cyan, textAlign: 'center' } as React.CSSProperties}>
            <Eyebrow>{'// SESSION COMPLETE'}</Eyebrow>
            <h1 className="rv-h1"><Decode text="MEMORY REINFORCED" duration={600} /></h1>
            <div className="rv-score">
              <div><div className="rv-score-n" style={{ color: accentText(T.cyan) }}>{done}</div><div className="rv-score-l">REVIEWED</div></div>
              <div><div className="rv-score-n" style={{ color: pct >= 70 ? T.green : T.amber }}>{pct}%</div><div className="rv-score-l">RECALLED</div></div>
              <div><div className="rv-score-n" style={{ color: T.green }}>{graded?.streak ?? queue.streak}</div><div className="rv-score-l">DAY STREAK</div></div>
            </div>
            <p className="rv-lead" style={{ margin: '0 auto 22px' }}>
              Every card you just saw has been rescheduled for the moment you are most likely to need it again. That spacing is what
              moves knowledge into long-term memory.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="gx-btn gx-btn--primary" onClick={load}>REVIEW MORE ▸</button>
              <Link href="/" className="gx-btn gx-btn--ghost">DASHBOARD</Link>
            </div>
          </section>
        </div>
      </div>
    )
  }

  if (!card) return <div style={{ minHeight: '60vh' }} />
  const ac = catColor(card.moduleId)

  return (
    <div className="rv-root">
      <GxStyles /><HackStyles />
      <CityNet intensity={0.28} style={{ opacity: 0.38, zIndex: 0 }} />
      <div className="rv-wrap">
        <div className="rv-top">
          <Eyebrow>{'// ACTIVE RECALL'}</Eyebrow>
          <div className="rv-top-meta">
            <span>{i + 1} / {queue.cards.length}</span>
            <span style={{ color: T.green }}>{right}✓</span>
            {queue.streak > 0 && <span style={{ color: T.amber }}>{queue.streak}d</span>}
          </div>
        </div>
        <div style={{ margin: '10px 0 20px' }}><Bar value={(i / queue.cards.length) * 100} color={T.cyan} height={8} label="Session progress" /></div>

        <section className="gx-clay rv-card hx-in" key={card.id} style={{ ['--accent' as string]: ac } as React.CSSProperties}>
          <div className="rv-card-top">
            <Link href={'/modules/' + card.moduleId} className="rv-chip" style={{ color: accentText(ac) }}>{catTitle(card.moduleId)}</Link>
            {card.isNew ? <span className="rv-chip rv-chip--new">NEW</span> : <span className="rv-chip rv-chip--due">DUE</span>}
          </div>
          <h2 className="rv-q">{card.prompt}</h2>
          {card.code && <pre className="rv-code">{card.code}</pre>}

          <div className="rv-opts">
            {card.options.map((opt, idx) => {
              const isAnswer = graded && idx === graded.answer
              const isWrongPick = graded && idx === picked && !graded.correct
              const cls = 'rv-opt' + (isAnswer ? ' correct' : '') + (isWrongPick ? ' wrong' : '') + (picked !== null && !isAnswer && !isWrongPick ? ' dim' : '')
              return (
                <button key={idx} className={cls} onClick={() => choose(idx)} disabled={picked !== null}>
                  <span className="rv-key">{String.fromCharCode(65 + idx)}</span>
                  <span>{opt}</span>
                  {isAnswer && <span className="rv-mark" style={{ color: T.green }}>✓</span>}
                  {isWrongPick && <span className="rv-mark" style={{ color: T.red }}>✗</span>}
                </button>
              )
            })}
          </div>

          {graded && (
            <div className="rv-feedback" style={{ borderColor: graded.correct ? 'rgba(0,255,65,.3)' : 'rgba(255,65,54,.3)' }}>
              <div className="rv-verdict" style={{ color: graded.correct ? T.green : T.red }}>
                {graded.correct ? 'CORRECT' : 'NOT QUITE'} · back {intervalWord(graded.intervalDays)}
              </div>
              <p className="rv-explain">{graded.explain}</p>
              <button className="gx-btn gx-btn--primary" style={{ ['--accent' as string]: ac, marginTop: '14px' } as React.CSSProperties} onClick={next} autoFocus>
                {i < queue.cards.length - 1 ? 'NEXT CARD ▸' : 'FINISH ▸'}
              </button>
            </div>
          )}
          {err && <div className="rv-err">{err}</div>}
        </section>

        <p className="rv-hint">Answer honestly — getting one wrong just means you will see it again sooner. That is the system working.</p>
      </div>

      <style>{`
        .rv-root { position: relative; min-height: 100%; color: var(--tx); }
        .rv-root > :not(canvas) { position: relative; z-index: 1; }
        .rv-wrap { max-width: 720px; margin: 0 auto; padding: 24px 0 60px; }
        .rv-top { display: flex; justify-content: space-between; align-items: baseline; }
        .rv-top-meta { display: flex; gap: 14px; font-family: var(--mono); font-size: 12px; color: var(--tx-dim-hi); }
        .rv-card { padding: clamp(20px, 4vw, 30px); }
        .rv-h1 { font-family: var(--mono); font-weight: 800; font-size: clamp(24px, 5vw, 36px); letter-spacing: .05em; margin: 10px 0 14px; color: var(--tx); }
        .rv-lead { font-family: var(--sans); font-size: 15.5px; line-height: 1.65; color: var(--tx-body); max-width: 56ch; }
        .rv-card-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 14px; }
        .rv-chip { font-family: var(--mono); font-size: 11px; letter-spacing: .08em; text-decoration: none; padding: 4px 9px; border-radius: 7px; background: rgba(232,243,246,.05); }
        .rv-chip--new { color: var(--cyan); }
        .rv-chip--due { color: var(--amber); }
        .rv-q { font-family: var(--sans); font-weight: 600; font-size: clamp(18px, 3vw, 22px); line-height: 1.42; color: var(--tx); margin: 0 0 16px; }
        .rv-code { font-family: var(--mono); font-size: 13px; line-height: 1.6; background: #071017; border: 1px solid rgba(232,243,246,.08); color: #d6f5e0; padding: 12px 14px; overflow-x: auto; margin: 0 0 18px; white-space: pre; }
        .rv-opts { display: grid; gap: 10px; }
        .rv-opt { display: flex; gap: 12px; align-items: center; text-align: left; padding: 13px 15px; border-radius: 12px; cursor: pointer; font-family: var(--sans); font-size: 15px; color: var(--tx-body);
          background: var(--clay-face); box-shadow: var(--e-clay); border: 1px solid rgba(232,243,246,.05); transition: transform .14s, color .14s, box-shadow .14s; }
        .rv-opt:hover:not(:disabled) { transform: translateY(-1px); color: var(--tx); box-shadow: var(--e-clay-hi), 0 0 0 1px color-mix(in srgb, var(--accent) 30%, transparent); }
        .rv-opt:disabled { cursor: default; }
        .rv-opt.correct { box-shadow: var(--e-clay), 0 0 0 2px rgba(0,255,65,.6); color: var(--tx); }
        .rv-opt.wrong { box-shadow: var(--e-clay), 0 0 0 2px rgba(255,65,54,.55); color: var(--tx); }
        .rv-opt.dim { opacity: .5; }
        .rv-key { flex: none; width: 26px; height: 26px; border-radius: 7px; display: grid; place-items: center; font-family: var(--mono); font-size: 12px; font-weight: 700; color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, transparent); }
        .rv-mark { margin-left: auto; font-family: var(--mono); font-weight: 700; }
        .rv-feedback { margin-top: 18px; padding: 16px; border-radius: 12px; border: 1px solid; background: rgba(4,7,10,.4); }
        .rv-verdict { font-family: var(--mono); font-size: 12px; font-weight: 700; letter-spacing: .14em; }
        .rv-explain { font-family: var(--sans); font-size: 14px; line-height: 1.6; color: var(--tx-body); margin: 10px 0 0; }
        .rv-err { margin-top: 12px; color: #ffc0b8; font-family: var(--sans); font-size: 14px; }
        .rv-hint { font-family: var(--sans); font-size: 13px; color: var(--tx-dim); text-align: center; margin: 20px 0 0; }
        .rv-score { display: flex; justify-content: center; gap: 36px; margin: 18px 0 20px; }
        .rv-score-n { font-family: var(--mono); font-size: 38px; font-weight: 800; }
        .rv-score-l { font-family: var(--mono); font-size: 10.5px; letter-spacing: .16em; color: var(--tx-dim); margin-top: 2px; }
      `}</style>
    </div>
  )
}

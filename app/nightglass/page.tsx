'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../components/AuthProvider'
import { CATALOG } from '../../lib/learning'
import { OPERATION, ACTS, ACT_IDS, checkFlag, type Act } from '../../lib/nightglass'
import { Bar, Eyebrow, GxStyles, T, accentText } from '../components/gx/Gx'
import { Decode, HackStyles } from '../components/hack/Hack'
import CityNet from '../components/hack/CityNet'

const STORE = 'gn_nightglass'
const catTitle = (id: string) => CATALOG.find(m => m.id === id)?.title || id
const catColor = (id: string) => CATALOG.find(m => m.id === id)?.color || T.cyan

function loadCleared(): Set<string> {
  try { const r = JSON.parse(localStorage.getItem(STORE) || '[]'); return new Set(Array.isArray(r) ? r.filter((x: string) => ACT_IDS.includes(x)) : []) } catch { return new Set() }
}
function saveCleared(s: Set<string>) {
  try { localStorage.setItem(STORE, JSON.stringify(Array.from(s))) } catch { /* private mode */ }
}

export default function NightglassPage() {
  const router = useRouter()
  const { profile, loading } = useAuth()
  const [cleared, setCleared] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState<string | null>(null)
  const [guess, setGuess] = useState<Record<string, string>>({})
  const [wrong, setWrong] = useState<string | null>(null)
  const [reveal, setReveal] = useState<Set<string>>(new Set())

  useEffect(() => { if (!loading && !profile) router.replace('/auth?mode=login&from=/nightglass') }, [loading, profile, router])
  useEffect(() => { setCleared(loadCleared()); setOpen(null) }, [])

  const modPct = useMemo(() => new Map((profile?.modules || []).map(m => [m.id, m.percent])), [profile])
  const unlockedIndex = useMemo(() => {
    let i = 0
    while (i < ACTS.length && cleared.has(ACTS[i].id)) i++
    return i // first not-yet-cleared act index = the active one
  }, [cleared])

  if (!profile) return <div style={{ minHeight: '60vh' }} />

  const doneCount = cleared.size
  const allDone = doneCount === ACTS.length

  function isUnlocked(idx: number) { return idx <= unlockedIndex }

  function submit(act: Act, idx: number) {
    const g = guess[act.id] || ''
    if (checkFlag(act, g)) {
      const nx = new Set(cleared); nx.add(act.id); setCleared(nx); saveCleared(nx)
      setWrong(null)
      setOpen(idx + 1 < ACTS.length ? ACTS[idx + 1].id : null)
    } else {
      setWrong(act.id)
      setTimeout(() => setWrong(w => (w === act.id ? null : w)), 1600)
    }
  }

  return (
    <div className="ng-root">
      <GxStyles /><HackStyles />
      <CityNet intensity={0.4} style={{ opacity: 0.5, zIndex: 0 }} />
      <div className="ng-wrap">
        <header className="ng-head hx-in">
          <div className="ng-class">{OPERATION.classification}</div>
          <h1 className="ng-title"><Decode text={'OPERATION ' + OPERATION.codename} duration={900} /></h1>
          <p className="ng-logline">{OPERATION.logline}</p>
          <div className="ng-rules">
            {OPERATION.rules.map((r, i) => <div key={i} className="ng-rule"><span>{String(i + 1).padStart(2, '0')}</span>{r}</div>)}
          </div>
          <div className="ng-prog">
            <Bar value={(doneCount / ACTS.length) * 100} color={allDone ? T.green : T.cyan} height={10} label="Operation progress" />
            <div className="ng-prog-label">{doneCount} / {ACTS.length} ACTS CLEARED</div>
          </div>
        </header>

        {allDone && (
          <section className="gx-clay ng-debrief hx-in" style={{ ['--accent' as string]: T.green } as React.CSSProperties}>
            <Eyebrow color={T.green}>{'// MISSION DEBRIEF'}</Eyebrow>
            <h2 className="ng-debrief-h"><Decode text="NIGHTGLASS IS DARK" duration={700} /></h2>
            <p className="ng-debrief-p">
              You ran the full kill chain — recon to report — and handed back the one thing that actually dismantles an operation: a clear,
              fixable account of how it was done. That is the job. Not the break-in; the proof and the remedy. You are operating at full stack now.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '18px' }}>
              <Link href="/paths" className="gx-btn gx-btn--primary" style={{ ['--accent' as string]: T.green } as React.CSSProperties}>WHAT’S NEXT ▸</Link>
              <button className="gx-btn gx-btn--ghost" onClick={() => { const e = new Set<string>(); setCleared(e); saveCleared(e); setOpen(ACTS[0].id) }}>RUN IT AGAIN</button>
            </div>
          </section>
        )}

        <div className="ng-acts">
          {ACTS.map((act, idx) => {
            const unlocked = isUnlocked(idx)
            const done = cleared.has(act.id)
            const isOpen = open === act.id
            const ac = catColor(act.modules[0])
            const trained = Math.round(act.modules.reduce((a, m) => a + (modPct.get(m) || 0), 0) / act.modules.length)
            return (
              <div key={act.id} className={'gx-clay ng-act' + (done ? ' done' : '') + (!unlocked ? ' locked' : '')} style={{ ['--accent' as string]: ac } as React.CSSProperties}>
                <button className="ng-act-head" onClick={() => unlocked && setOpen(isOpen ? null : act.id)} disabled={!unlocked} aria-expanded={isOpen}>
                  <div className="ng-act-code" style={{ color: done ? T.green : accentText(ac) }}>
                    {done ? '✓' : unlocked ? act.code.split(' ')[1] : '🔒'}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="ng-act-phase">{act.phase}</div>
                    <div className="ng-act-title">{act.title}</div>
                  </div>
                  <div className="ng-act-status">{done ? 'CLEARED' : unlocked ? (isOpen ? 'CLOSE' : 'OPEN') : 'LOCKED'}</div>
                </button>

                {isOpen && unlocked && (
                  <div className="ng-act-body">
                    <div className="ng-skills">
                      {act.modules.map(m => (
                        <Link key={m} href={'/modules/' + m} className="ng-skill" style={{ color: accentText(catColor(m)) }}>{catTitle(m)}</Link>
                      ))}
                      {trained > 0 && <span className="ng-trained">{trained}% trained</span>}
                    </div>
                    <p className="ng-brief">{act.brief}</p>
                    <div className="ng-obj"><span>OBJECTIVE</span>{act.objective}</div>

                    {done ? (
                      <div className="ng-cleared">✓ Act cleared — on to the next.</div>
                    ) : (
                      <div className="ng-flag">
                        <div className="ng-flag-q">{act.flag.question}</div>
                        <div className="ng-flag-row">
                          <input
                            className={'ng-input' + (wrong === act.id ? ' shake' : '')}
                            value={guess[act.id] || ''}
                            onChange={e => setGuess(g => ({ ...g, [act.id]: e.target.value }))}
                            onKeyDown={e => { if (e.key === 'Enter') submit(act, idx) }}
                            placeholder="Enter your answer…"
                            aria-label="Flag answer"
                          />
                          <button className="gx-btn gx-btn--primary" style={{ ['--accent' as string]: ac } as React.CSSProperties} onClick={() => submit(act, idx)}>SUBMIT</button>
                        </div>
                        <button className="ng-hint" onClick={() => setReveal(r => new Set([...Array.from(r), act.id]))}>
                          {reveal.has(act.id) ? 'Hint: ' + act.flag.hint : 'Need a hint?'}
                        </button>
                        {wrong === act.id && <span className="ng-nope">Not quite — check the module and try again.</span>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .ng-root { position: relative; min-height: 100%; color: var(--tx); }
        .ng-root > :not(canvas) { position: relative; z-index: 1; }
        .ng-wrap { max-width: 880px; margin: 0 auto; padding: 24px 0 70px; }
        .ng-head { margin-bottom: 26px; }
        .ng-class { font-family: var(--mono); font-size: 10.5px; letter-spacing: .28em; color: var(--red, #ff4136); }
        .ng-title { font-family: var(--mono); font-weight: 800; font-size: clamp(28px, 6vw, 48px); letter-spacing: .05em; color: var(--tx); margin: 8px 0 14px; }
        .ng-logline { font-family: var(--sans); font-size: 16px; line-height: 1.65; color: var(--tx-body); max-width: 70ch; margin: 0 0 18px; }
        .ng-rules { display: grid; gap: 7px; margin-bottom: 20px; }
        .ng-rule { display: flex; gap: 10px; font-family: var(--sans); font-size: 13px; color: var(--tx-dim); line-height: 1.5; }
        .ng-rule span { font-family: var(--mono); font-size: 10.5px; color: var(--cyan); flex: none; padding-top: 2px; }
        .ng-prog-label { font-family: var(--mono); font-size: 10.5px; letter-spacing: .16em; color: var(--tx-dim-hi); margin-top: 7px; }
        .ng-acts { display: grid; gap: 12px; }
        .ng-act { overflow: hidden; }
        .ng-act.locked { opacity: .6; }
        .ng-act.done { box-shadow: var(--e-clay), 0 0 0 1px rgba(0,255,65,.25); }
        .ng-act-head { width: 100%; display: flex; align-items: center; gap: 14px; padding: 16px 18px; background: none; border: none; cursor: pointer; text-align: left; }
        .ng-act-head:disabled { cursor: not-allowed; }
        .ng-act-code { font-family: var(--mono); font-weight: 800; font-size: 20px; width: 32px; text-align: center; flex: none; }
        .ng-act-phase { font-family: var(--mono); font-size: 10px; letter-spacing: .18em; color: var(--tx-dim); }
        .ng-act-title { font-family: var(--sans); font-weight: 650; font-size: 17px; color: var(--tx); margin-top: 2px; }
        .ng-act-status { font-family: var(--mono); font-size: 10px; letter-spacing: .14em; color: var(--tx-dim-hi); flex: none; }
        .ng-act-body { padding: 0 18px 18px; border-top: 1px solid rgba(232,243,246,.06); }
        .ng-skills { display: flex; flex-wrap: wrap; gap: 7px; align-items: center; margin: 14px 0; }
        .ng-skill { font-family: var(--mono); font-size: 10.5px; letter-spacing: .05em; text-decoration: none; padding: 4px 9px; border-radius: 7px; background: rgba(232,243,246,.05); }
        .ng-skill:hover { background: rgba(232,243,246,.1); }
        .ng-trained { font-family: var(--mono); font-size: 10px; color: var(--tx-dim); margin-left: auto; }
        .ng-brief { font-family: var(--sans); font-size: 14.5px; line-height: 1.65; color: var(--tx-body); margin: 0 0 14px; }
        .ng-obj { font-family: var(--sans); font-size: 13.5px; color: var(--tx); background: rgba(232,243,246,.04); border-left: 2px solid var(--accent); padding: 11px 14px; border-radius: 0 8px 8px 0; line-height: 1.5; }
        .ng-obj span { display: block; font-family: var(--mono); font-size: 9.5px; letter-spacing: .18em; color: var(--accent); margin-bottom: 4px; }
        .ng-flag { margin-top: 16px; }
        .ng-flag-q { font-family: var(--sans); font-weight: 600; font-size: 14px; color: var(--tx); margin-bottom: 9px; }
        .ng-flag-row { display: flex; gap: 9px; flex-wrap: wrap; }
        .ng-input { flex: 1; min-width: 180px; background: #071017; border: 1px solid rgba(232,243,246,.12); border-radius: 10px; padding: 11px 13px; color: var(--tx); font-family: var(--mono); font-size: 14px; }
        .ng-input:focus { outline: none; border-color: var(--accent); }
        .ng-input.shake { animation: ngShake .4s; border-color: var(--red, #ff4136); }
        .ng-hint { display: block; margin-top: 10px; background: none; border: none; color: var(--tx-dim); font-family: var(--sans); font-size: 12.5px; cursor: pointer; text-align: left; padding: 0; }
        .ng-hint:hover { color: var(--cyan); }
        .ng-nope { display: inline-block; margin-top: 8px; color: #ffc0b8; font-family: var(--sans); font-size: 12.5px; }
        .ng-cleared { font-family: var(--mono); font-size: 12.5px; color: var(--green, #00ff41); margin-top: 14px; }
        .ng-debrief { padding: clamp(22px, 4vw, 34px); margin-bottom: 24px; }
        .ng-debrief-h { font-family: var(--mono); font-weight: 800; font-size: clamp(22px, 4vw, 32px); color: var(--tx); margin: 10px 0 12px; letter-spacing: .04em; }
        .ng-debrief-p { font-family: var(--sans); font-size: 15px; line-height: 1.65; color: var(--tx-body); max-width: 66ch; margin: 0; }
        @keyframes ngShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
      `}</style>
    </div>
  )
}

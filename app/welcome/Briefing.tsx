'use client'
import React, { useEffect, useState } from 'react'
import { C, Decode, Frame, Typed, mono, sans } from '../components/hack/Hack'

/** Mission briefing: what GHOSTNET is and how getting in works, typed out as a dossier. */

const INTRO = 'GHOSTNET is a training ground for hackers who play defence. 20 modules, from Linux and scripting foundations through OSINT, web, cloud and red team to blue-team defence, forensics and AI security. Each module has chapters to read and a guided lab where you run it yourself.'

const OBJECTIVES = [
  { code: '01', title: 'BREACH', color: C.red, text: 'Hack the gateway on the next screen. Hold to push your signal through five layers of defence.' },
  { code: '02', title: 'ENLIST', color: C.cyan, text: 'Choose a callsign, link an inbox and forge a password. We email you a 6-digit code to prove the inbox is yours.' },
  { code: '03', title: 'CONFIGURE', color: C.amber, text: 'Build your operator profile: sigil, skill level, and the sectors you want to break into first.' },
  { code: '04', title: 'TRAIN', color: C.green, text: 'Every chapter you read and every lab step you clear is saved. Each module shows its own progress, and you resume exactly where you stopped, on any device.' },
  { code: '05', title: 'RANK UP', color: '#bf5fff', text: 'Labs pay XP: 8,010 in total. Climb from Ghost to Specter, Phantom, Wraith and Legend.' },
]

export default function Briefing({ onDone, onSkip, instant }: { onDone: () => void; onSkip: () => void; instant?: boolean }) {
  const [step, setStep] = useState(instant ? OBJECTIVES.length + 1 : 0) // 0 = intro typing, 1..5 objectives, 6 = done
  const next = () => setStep(s => s + 1)
  const all = step > OBJECTIVES.length

  // Enter / Space skips ahead to the end once something is on screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter' && all) onDone() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [all, onDone])

  return (
    <div className="hx-in" style={{ width: '100%', maxWidth: '820px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
        <div style={{ fontFamily: mono, fontSize: '.62rem', letterSpacing: '.36em', color: C.cyan }}>// MISSION BRIEFING · EYES ONLY</div>
        {!all && <button className="hx-link" onClick={() => setStep(OBJECTIVES.length + 1)}>SHOW ALL ▸</button>}
      </div>
      <h1 style={{ margin: '0 0 14px', fontFamily: mono, fontSize: 'clamp(1.4rem, 5vw, 2.1rem)', color: C.white, letterSpacing: '.06em' }}>
        <span className="hx-glitch" data-text="OPERATION: GHOSTNET"><Decode text="OPERATION: GHOSTNET" duration={800} instant={instant} /></span>
      </h1>

      <p style={{ fontFamily: sans, fontSize: 'clamp(.92rem, 2.4vw, 1.02rem)', lineHeight: 1.7, color: '#c9d9df', margin: '0 0 22px', minHeight: '5em' }}>
        <Typed text={INTRO} speed={12} typos={false} instant={instant || step > 0} onDone={() => step === 0 && setTimeout(next, 250)} />
      </p>

      <div style={{ display: 'grid', gap: '8px' }}>
        {OBJECTIVES.map((o, i) => {
          const n = i + 1
          if (step < n) return null
          return (
            <Frame key={o.code} color={o.color} className="hx-in bf-row" style={{ padding: '11px 14px' }}>
              <div style={{ fontFamily: mono, fontSize: '1.3rem', fontWeight: 700, color: o.color, lineHeight: 1 }}>{o.code}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: mono, fontSize: '.72rem', letterSpacing: '.3em', color: o.color, fontWeight: 700 }}>{o.title}</div>
                <div style={{ fontFamily: sans, fontSize: '.86rem', color: '#c9d9df', lineHeight: 1.5, marginTop: '3px' }}>
                  <Typed text={o.text} speed={9} typos={false} instant={instant || step > n} onDone={() => step === n && setTimeout(next, 160)} />
                </div>
              </div>
            </Frame>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: '22px', minHeight: '50px', flexWrap: 'wrap' }}>
        <button className="hx-link" onClick={onSkip}>SKIP TO BREACH</button>
        {all && <button className="hx-btn hx-in" onClick={onDone} autoFocus>PROCEED TO BREACH ▸</button>}
      </div>

      <style>{`.bf-row { display: grid; grid-template-columns: 44px minmax(0, 1fr); gap: 12px; align-items: start; }`}</style>
    </div>
  )
}

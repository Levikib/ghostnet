'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import OperatorAvatar, { AVATAR_COLORS } from '../components/OperatorAvatar'
import { useAuth } from '../components/AuthProvider'
import { api } from '../../lib/client/api'
import { CATALOG, CHAPTER_XP } from '../../lib/learning'
import CityNet from '../components/hack/CityNet'
import { C, Decode, Frame, HackStyles, TermLines, TermLine, Typed, mono, sans, useReducedMotion } from '../components/hack/Hack'

const SKILLS = [
  { id: 'beginner', title: 'NEW RECRUIT', desc: 'New to security. Start with fundamentals and plain-language explanations.', color: C.green, start: 'tor' },
  { id: 'intermediate', title: 'FIELD AGENT', desc: 'Comfortable with Linux and networking. Ready for real techniques.', color: C.cyan, start: 'osint' },
  { id: 'advanced', title: 'SPECIALIST', desc: 'Working in IT or security. Here to sharpen offensive and defensive skills.', color: '#bf5fff', start: 'web-attacks' },
  { id: 'expert', title: 'VETERAN', desc: 'Professional pentester or researcher. Bring on the hard labs.', color: C.red, start: 'active-directory' },
]

const STEPS = [
  { id: 'IDENTITY', prompt: 'Build your operator identity. This sigil is generated from your callsign, so nobody else has it. Regenerate until it feels like yours.' },
  { id: 'CLEARANCE', prompt: 'Where are you starting from? We use this to pitch the explanations and suggest your first module.' },
  { id: 'MISSION', prompt: 'Pick the sectors you want to break into first. They go to the front of your dashboard.' },
]

function Inner() {
  const router = useRouter()
  const params = useSearchParams()
  const reduced = useReducedMotion()
  const { profile, loading, setProfile } = useAuth()
  const [step, setStep] = useState(0)
  const [displayName, setDisplayName] = useState('')
  const [seed, setSeed] = useState('')
  const [color, setColor] = useState(AVATAR_COLORS[1])
  const [skill, setSkill] = useState('beginner')
  const [interests, setInterests] = useState<string[]>([])
  const [goal, setGoal] = useState('')
  const [country, setCountry] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [orientDone, setOrientDone] = useState(false)
  const [cut, setCut] = useState(0)

  useEffect(() => {
    if (loading) return
    if (!profile) { router.replace('/auth?mode=login'); return }
    setDisplayName(profile.display_name || profile.username)
    setSeed(profile.avatar_seed || profile.username)
    if (profile.avatar_color) setColor(profile.avatar_color)
    if (profile.skill_level) setSkill(profile.skill_level)
    if (profile.interests?.length) setInterests(profile.interests)
  }, [loading, profile, router])

  const from = (() => { const f = params.get('from'); return f && f.startsWith('/') && !f.startsWith('//') ? f : '/' })()
  const startModule = interests[0] || SKILLS.find(s => s.id === skill)?.start || 'tor'
  const startTitle = CATALOG.find(m => m.id === startModule)?.title || 'Tor'
  const dest = from === '/' ? '/modules/' + startModule : from

  const go = (n: number) => { setCut(c => c + 1); setStep(n) }

  async function finish(skip = false) {
    setSaving(true); setError(null)
    const r = await api<{ user?: unknown }>('/api/profile', {
      display_name: displayName.trim() || profile?.username, avatar_seed: seed, avatar_color: color,
      skill_level: skill, interests, goal: goal.trim() || null, country: country.trim() || null, complete_onboarding: true,
    }, 'PATCH')
    setSaving(false)
    if (r.ok === false) { setError(r.error || 'Could not save.'); return }
    if (r.user) setProfile(r.user as never)
    if (skip) { router.replace(from); return }
    setCut(c => c + 1)
    setDone(true)
  }

  const field: React.CSSProperties = { width: '100%', boxSizing: 'border-box', background: 'rgba(4,7,10,.8)', border: '1px solid rgba(232,243,246,.14)', padding: '12px 14px', color: C.white, fontFamily: mono, fontSize: '.9rem', borderRadius: 0 }
  const lab: React.CSSProperties = { display: 'block', fontFamily: mono, fontSize: '.58rem', letterSpacing: '.24em', color: C.dim, marginBottom: '7px' }

  if (!profile) return <div style={{ position: 'fixed', inset: 0, background: '#04070a' }} />

  const orientation: TermLine[] = [
    { t: 'ghostnet --orientation', kind: 'cmd', speed: 28 },
    { t: '[+] profile sealed: ' + (displayName || profile.username).toLowerCase() + ' · rank ghost · 0 xp', c: C.green, pause: 300 },
    { t: '', kind: 'blank', pause: 120 },
    { t: 'HOW THIS WORKS', c: C.cyan, pause: 200 },
    { t: '  20 modules. each = chapters to read + a guided lab', c: C.white, pause: 380 },
    { t: '  every chapter you open: +' + CHAPTER_XP + ' xp, saved instantly', c: C.white, pause: 380 },
    { t: '  every lab step you clear: saved, resume on any device', c: C.white, pause: 380 },
    { t: '  module progress = 60% chapters + 40% lab', c: C.white, pause: 380 },
    { t: '  ranks: ghost > specter > phantom > wraith > legend', c: C.white, pause: 380 },
    { t: '', kind: 'blank', pause: 120 },
    { t: '[>] recommended first target: ' + startTitle.toLowerCase(), c: C.amber, pause: 400 },
  ]

  return (
    <div className="ob-root">
      <HackStyles />
      <CityNet intensity={0.7} />
      <div className="hx-vig" aria-hidden="true" />
      <div className="hx-scan" aria-hidden="true" />
      <div className="hx-noise" aria-hidden="true" />
      {cut > 0 && <div key={cut} className="hx-burst" aria-hidden="true" />}

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '780px', margin: '0 auto', padding: '30px 16px 60px' }}>
        <div style={{ marginBottom: '34px' }}>
          <div style={{ fontFamily: mono, fontSize: '.6rem', letterSpacing: '.4em', color: C.cyan }}>// OPERATOR INITIATION</div>
          <h1 style={{ fontFamily: mono, fontSize: 'clamp(1.25rem, 5vw, 1.85rem)', color: C.white, margin: '10px 0 0', letterSpacing: '.08em' }}>
            <Decode key={done ? 'd' : 'w'} text={done ? 'INITIATION COMPLETE' : 'WELCOME TO THE NETWORK, ' + profile.username.toUpperCase()} duration={800} instant={reduced} />
          </h1>
          {!done && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '18px' }}>
              {STEPS.map((s, i) => (
                <div key={s.id} style={{ flex: 1 }}>
                  <div style={{ height: '3px', background: i < step ? C.white : i === step ? C.cyan : 'rgba(232,243,246,.08)', boxShadow: i === step ? '0 0 8px ' + C.cyan : 'none', transition: 'all .3s' }} />
                  <div style={{ fontFamily: mono, fontSize: '.56rem', letterSpacing: '.24em', marginTop: '7px', color: i === step ? C.white : i < step ? C.cyan : C.faint }}>{'0' + (i + 1) + ' ' + s.id}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {done ? (
          <Frame color={C.green} className="hx-in" style={{ padding: 'clamp(18px, 5vw, 30px)' }} label="PROFILE SEALED">
            <div className="ob-done">
              <div style={{ textAlign: 'center' }}>
                <OperatorAvatar seed={seed} color={color} size={110} />
                <div style={{ fontFamily: mono, color: C.white, letterSpacing: '.16em', fontSize: '.8rem', marginTop: '12px' }}>{displayName.toUpperCase()}</div>
                <div style={{ fontFamily: mono, color: C.green, letterSpacing: '.24em', fontSize: '.58rem', marginTop: '4px' }}>GHOST RANK · 0 XP</div>
              </div>
              <div style={{ minWidth: 0 }}>
                <TermLines lines={orientation} instant={reduced} onDone={() => setOrientDone(true)} style={{ fontSize: '.7rem' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap', marginTop: '22px', minHeight: '50px' }}>
              {(orientDone || reduced) && (
                <>
                  <button className="hx-btn-ghost hx-in" onClick={() => router.replace('/')}>COMMAND CENTRE</button>
                  <button className="hx-btn hx-in" autoFocus onClick={() => router.replace(dest)}>{from === '/' ? 'START ' + startTitle.toUpperCase() + ' ▸' : 'CONTINUE ▸'}</button>
                </>
              )}
            </div>
          </Frame>
        ) : (
          <Frame key={step} color={C.cyan} className="hx-in ob-in" style={{ padding: 'clamp(18px, 5vw, 32px)' }} label={'STEP 0' + (step + 1) + ' · ' + STEPS[step].id}>
            <p style={{ fontFamily: sans, color: '#b9cbd2', fontSize: '.95rem', lineHeight: 1.6, margin: '0 0 20px', minHeight: '3.2em' }}>
              <Typed text={STEPS[step].prompt} speed={12} typos={false} instant={reduced} />
            </p>

            {step === 0 && (
              <div className="ob-grid">
                <div style={{ textAlign: 'center' }}>
                  <div className="ob-sigil"><OperatorAvatar seed={seed} color={color} size={140} /></div>
                  <button onClick={() => setSeed(profile.username + ':' + Math.random().toString(36).slice(2, 8))} className="hx-btn-ghost" style={{ marginTop: '12px' }}>↻ REGENERATE SIGIL</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                  <label><span style={lab}>DISPLAY NAME</span><input value={displayName} onChange={e => setDisplayName(e.target.value.slice(0, 40))} style={field} /></label>
                  <div>
                    <span style={lab}>SIGNAL COLOUR</span>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {AVATAR_COLORS.map(c => <button key={c} aria-label={'Colour ' + c} aria-pressed={color === c} onClick={() => setColor(c)} className="ob-opt" style={{ width: '28px', height: '28px', background: c, border: color === c ? '2px solid #fff' : '2px solid transparent', boxShadow: color === c ? '0 0 14px ' + c : 'none', transform: 'rotate(45deg) scale(.8)' }} />)}
                    </div>
                  </div>
                  <label><span style={lab}>COUNTRY (OPTIONAL)</span><input value={country} onChange={e => setCountry(e.target.value.slice(0, 56))} placeholder="Kenya" style={field} /></label>
                </div>
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '10px' }}>
                {SKILLS.map(s => (
                  <button key={s.id} onClick={() => setSkill(s.id)} className="ob-opt" aria-pressed={skill === s.id}
                    style={{ textAlign: 'left', padding: '16px', background: skill === s.id ? s.color + '14' : 'rgba(4,7,10,.7)', border: '1px solid ' + (skill === s.id ? s.color : 'rgba(232,243,246,.1)'), boxShadow: skill === s.id ? '0 0 22px ' + s.color + '22' : 'none' }}>
                    <div style={{ fontFamily: mono, fontSize: '.76rem', letterSpacing: '.2em', color: s.color, fontWeight: 700 }}>{skill === s.id ? '[+] ' : '[ ] '}{s.title}</div>
                    <div style={{ fontFamily: sans, fontSize: '.84rem', color: '#a9bcc4', marginTop: '8px', lineHeight: 1.5 }}>{s.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '8px' }}>
                  {CATALOG.map(m => {
                    const on = interests.includes(m.id)
                    return (
                      <button key={m.id} onClick={() => setInterests(v => (on ? v.filter(x => x !== m.id) : [...v, m.id]))} className="ob-opt" aria-pressed={on}
                        style={{ textAlign: 'left', padding: '11px 12px', background: on ? m.color + '16' : 'rgba(4,7,10,.7)', border: '1px solid ' + (on ? m.color : 'rgba(232,243,246,.08)'), display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontFamily: mono, fontSize: '.6rem', color: m.color }}>{m.code}</span>
                        <span style={{ fontFamily: sans, fontSize: '.85rem', color: on ? C.white : '#a9bcc4' }}>{m.title}</span>
                      </button>
                    )
                  })}
                </div>
                <label style={{ display: 'block', marginTop: '18px' }}>
                  <span style={lab}>YOUR MISSION (OPTIONAL)</span>
                  <input value={goal} onChange={e => setGoal(e.target.value.slice(0, 160))} placeholder="e.g. Pass OSCP by June · Land my first pentest job" style={{ ...field, fontFamily: sans }} />
                </label>
              </div>
            )}

            {error && <div role="alert" style={{ marginTop: '16px', borderLeft: '2px solid ' + C.red, padding: '8px 12px', color: '#ffc0b8', fontFamily: sans, fontSize: '.85rem' }}>{error}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '26px', gap: '10px' }}>
              <button className="hx-btn-ghost" onClick={() => (step === 0 ? finish(true) : go(step - 1))} disabled={saving}>{step === 0 ? 'SKIP FOR NOW' : '◂ BACK'}</button>
              <button className="hx-btn" disabled={saving} onClick={() => (step < 2 ? go(step + 1) : finish())}>{saving ? 'SEALING…' : step < 2 ? 'CONTINUE ▸' : 'SEAL PROFILE ▸'}</button>
            </div>
          </Frame>
        )}
      </div>

      <style>{`
        .ob-root { position: fixed; inset: 0; z-index: 9999; background: #04070a; overflow-y: auto; color: #e8f3f6; }
        .ob-opt { cursor: pointer; transition: all .18s; }
        .ob-opt:hover { transform: translateY(-2px); }
        .ob-opt[style*="rotate"]:hover { transform: rotate(45deg) scale(.9) !important; }
        .ob-in input:focus { border-color: #00d4ff !important; box-shadow: 0 0 0 3px rgba(0,212,255,.12); outline: none; }
        .ob-grid { display: grid; grid-template-columns: minmax(0, 200px) minmax(0, 1fr); gap: 28px; align-items: center; }
        .ob-done { display: grid; grid-template-columns: 160px minmax(0, 1fr); gap: 24px; align-items: start; }
        .ob-sigil { display: inline-flex; padding: 10px; border: 1px solid rgba(232,243,246,.1); background: rgba(0,212,255,.03); }
        @media (max-width: 620px) { .ob-grid, .ob-done { grid-template-columns: minmax(0, 1fr); justify-items: center } }
      `}</style>
    </div>
  )
}

export default function OnboardingPage() {
  return <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#04070a' }} />}><Inner /></Suspense>
}

'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import OperatorAvatar, { AVATAR_COLORS } from '../components/OperatorAvatar'
import { useAuth } from '../components/AuthProvider'
import { api } from '../../lib/client/api'
import { CATALOG } from '../../lib/learning'

const mono = 'JetBrains Mono, monospace'
const sans = 'DM Sans, system-ui, sans-serif'

const SKILLS = [
  { id: 'beginner', title: 'NEW RECRUIT', desc: 'New to security. Start with fundamentals and plain-language explanations.', color: '#00ff41' },
  { id: 'intermediate', title: 'FIELD AGENT', desc: 'Comfortable with Linux and networking. Ready for real techniques.', color: '#00d4ff' },
  { id: 'advanced', title: 'SPECIALIST', desc: 'Working in IT or security. Here to sharpen offensive and defensive skills.', color: '#bf5fff' },
  { id: 'expert', title: 'VETERAN', desc: 'Professional pentester or researcher. Bring on the hard labs.', color: '#ff4136' },
]

function Inner() {
  const router = useRouter()
  const params = useSearchParams()
  const { profile, loading, setProfile } = useAuth()
  const [step, setStep] = useState(0)
  const [displayName, setDisplayName] = useState('')
  const [seed, setSeed] = useState('')
  const [color, setColor] = useState(AVATAR_COLORS[0])
  const [skill, setSkill] = useState('beginner')
  const [interests, setInterests] = useState<string[]>([])
  const [goal, setGoal] = useState('')
  const [country, setCountry] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

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

  async function finish() {
    setSaving(true); setError(null)
    const r = await api<{ user?: unknown }>('/api/profile', {
      display_name: displayName.trim() || profile?.username, avatar_seed: seed, avatar_color: color,
      skill_level: skill, interests, goal: goal.trim() || null, country: country.trim() || null, complete_onboarding: true,
    }, 'PATCH')
    setSaving(false)
    if (r.ok === false) { setError(r.error || 'Could not save.'); return }
    if (r.user) setProfile(r.user as never)
    setDone(true)
    setTimeout(() => router.replace(from === '/' && interests[0] ? '/modules/' + interests[0] : from), 1800)
  }

  const steps = ['IDENTITY', 'CLEARANCE', 'MISSION']
  const card: React.CSSProperties = { background: 'linear-gradient(160deg, rgba(4,18,7,.94), rgba(1,7,2,.96))', border: '1px solid rgba(0,255,65,.18)', padding: 'clamp(20px, 5vw, 34px)', clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))' }
  const btn: React.CSSProperties = { fontFamily: mono, fontSize: '.78rem', letterSpacing: '.28em', fontWeight: 700, padding: '14px 26px', cursor: 'pointer', border: '1px solid #00ff41', color: '#001a05', background: '#00ff41', clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }

  if (!profile) return <div style={{ position: 'fixed', inset: 0, background: '#000' }} />

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'radial-gradient(ellipse at 50% 0%, #031a08 0%, #000 60%)', overflowY: 'auto' }}>
      <style>{`
        @keyframes obIn { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none } }
        @keyframes obDone { 0% { opacity: 0; transform: scale(1.5); filter: blur(6px) } 60% { opacity: 1; filter: blur(0); transform: scale(.97) } 100% { transform: scale(1) } }
        .ob-opt { cursor: pointer; transition: all .18s; }
        .ob-opt:hover { transform: translateY(-2px); }
        .ob-in input:focus, .ob-in textarea:focus { border-color: #00ff41 !important; box-shadow: 0 0 0 3px rgba(0,255,65,.12); outline: none; }
      `}</style>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '36px 16px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <div style={{ fontFamily: mono, fontSize: '.62rem', letterSpacing: '.4em', color: '#2f8f4f' }}>// OPERATOR INITIATION</div>
          <h1 style={{ fontFamily: mono, fontSize: 'clamp(1.3rem, 5vw, 1.9rem)', color: '#eaffea', margin: '10px 0 0', letterSpacing: '.1em' }}>
            {done ? 'INITIATION COMPLETE' : 'WELCOME TO THE NETWORK, ' + profile.username.toUpperCase()}
          </h1>
          {!done && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginTop: '18px', fontFamily: mono, fontSize: '.6rem', letterSpacing: '.25em' }}>
              {steps.map((s, i) => <span key={s} style={{ color: i === step ? '#00ff41' : i < step ? '#2f8f4f' : '#1a4a22', borderBottom: '2px solid ' + (i === step ? '#00ff41' : 'transparent'), paddingBottom: '5px' }}>{'0' + (i + 1) + ' ' + s}</span>)}
            </div>
          )}
        </div>

        {done ? (
          <div style={{ ...card, textAlign: 'center', animation: 'obDone .8s cubic-bezier(.2,.8,.2,1) both' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}><OperatorAvatar seed={seed} color={color} size={120} /></div>
            <p style={{ fontFamily: mono, color: '#00ff41', letterSpacing: '.2em', fontSize: '.85rem', marginTop: '18px' }}>{displayName.toUpperCase()} · GHOST RANK</p>
            <p style={{ fontFamily: sans, color: '#8fbf9f', fontSize: '.9rem' }}>Your profile is live. Every chapter and lab now counts toward your rank.</p>
          </div>
        ) : (
          <div key={step} className="ob-in" style={{ ...card, animation: 'obIn .4s ease both' }}>
            {step === 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 200px) minmax(0, 1fr)', gap: '28px', alignItems: 'center' }} className="ob-grid">
                <style>{`@media (max-width: 620px) { .ob-grid { grid-template-columns: minmax(0, 1fr) !important; justify-items: center } }`}</style>
                <div style={{ textAlign: 'center' }}>
                  <OperatorAvatar seed={seed} color={color} size={150} />
                  <button onClick={() => setSeed(profile.username + ':' + Math.random().toString(36).slice(2, 8))} style={{ marginTop: '14px', fontFamily: mono, fontSize: '.62rem', letterSpacing: '.2em', background: 'transparent', color: '#00d4ff', border: '1px solid rgba(0,212,255,.4)', padding: '8px 14px', cursor: 'pointer' }}>↻ REGENERATE SIGIL</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                  <label>
                    <span style={{ display: 'block', fontFamily: mono, fontSize: '.6rem', letterSpacing: '.24em', color: '#4f9f5f', marginBottom: '7px' }}>DISPLAY NAME</span>
                    <input value={displayName} onChange={e => setDisplayName(e.target.value.slice(0, 40))} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(0,14,3,.75)', border: '1px solid rgba(0,255,65,.22)', padding: '12px 14px', color: '#d8ffd8', fontFamily: mono, fontSize: '.9rem' }} />
                  </label>
                  <div>
                    <span style={{ display: 'block', fontFamily: mono, fontSize: '.6rem', letterSpacing: '.24em', color: '#4f9f5f', marginBottom: '9px' }}>SIGNAL COLOUR</span>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {AVATAR_COLORS.map(c => <button key={c} aria-label={'Colour ' + c} onClick={() => setColor(c)} className="ob-opt" style={{ width: '30px', height: '30px', borderRadius: '50%', background: c, border: color === c ? '3px solid #fff' : '3px solid transparent', boxShadow: color === c ? '0 0 14px ' + c : 'none' }} />)}
                    </div>
                  </div>
                  <label>
                    <span style={{ display: 'block', fontFamily: mono, fontSize: '.6rem', letterSpacing: '.24em', color: '#4f9f5f', marginBottom: '7px' }}>COUNTRY (OPTIONAL)</span>
                    <input value={country} onChange={e => setCountry(e.target.value.slice(0, 56))} placeholder="Kenya" style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(0,14,3,.75)', border: '1px solid rgba(0,255,65,.22)', padding: '12px 14px', color: '#d8ffd8', fontFamily: mono, fontSize: '.9rem' }} />
                  </label>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <p style={{ fontFamily: sans, color: '#9fcfaf', fontSize: '.95rem', marginTop: 0 }}>Where are you starting from? We use this to pitch explanations and suggest where to begin.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px' }}>
                  {SKILLS.map(s => (
                    <button key={s.id} onClick={() => setSkill(s.id)} className="ob-opt" aria-pressed={skill === s.id}
                      style={{ textAlign: 'left', padding: '16px', background: skill === s.id ? s.color + '14' : 'rgba(0,10,2,.6)', border: '1px solid ' + (skill === s.id ? s.color : 'rgba(0,255,65,.14)'), boxShadow: skill === s.id ? '0 0 22px ' + s.color + '22' : 'none' }}>
                      <div style={{ fontFamily: mono, fontSize: '.78rem', letterSpacing: '.2em', color: s.color, fontWeight: 700 }}>{s.title}</div>
                      <div style={{ fontFamily: sans, fontSize: '.84rem', color: '#8fbf9f', marginTop: '8px', lineHeight: 1.5 }}>{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p style={{ fontFamily: sans, color: '#9fcfaf', fontSize: '.95rem', marginTop: 0 }}>Pick the sectors you want to break into first. Your dashboard will put them up front.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '8px' }}>
                  {CATALOG.map(m => {
                    const on = interests.includes(m.id)
                    return (
                      <button key={m.id} onClick={() => setInterests(v => (on ? v.filter(x => x !== m.id) : [...v, m.id]))} className="ob-opt" aria-pressed={on}
                        style={{ textAlign: 'left', padding: '11px 12px', background: on ? m.color + '16' : 'rgba(0,10,2,.6)', border: '1px solid ' + (on ? m.color : 'rgba(0,255,65,.12)'), display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontFamily: mono, fontSize: '.62rem', color: m.color }}>{m.code}</span>
                        <span style={{ fontFamily: sans, fontSize: '.85rem', color: on ? '#eaffea' : '#8fbf9f' }}>{m.title}</span>
                      </button>
                    )
                  })}
                </div>
                <label style={{ display: 'block', marginTop: '18px' }}>
                  <span style={{ display: 'block', fontFamily: mono, fontSize: '.6rem', letterSpacing: '.24em', color: '#4f9f5f', marginBottom: '7px' }}>YOUR MISSION (OPTIONAL)</span>
                  <input value={goal} onChange={e => setGoal(e.target.value.slice(0, 160))} placeholder="e.g. Pass OSCP by June · Get my first pentest job" style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(0,14,3,.75)', border: '1px solid rgba(0,255,65,.22)', padding: '12px 14px', color: '#d8ffd8', fontFamily: sans, fontSize: '.92rem' }} />
                </label>
              </div>
            )}

            {error && <div role="alert" style={{ marginTop: '16px', borderLeft: '3px solid #ff4136', padding: '8px 12px', color: '#ffb0a8', fontFamily: sans, fontSize: '.85rem' }}>{error}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '26px', gap: '10px' }}>
              <button onClick={() => (step === 0 ? finish() : setStep(s => s - 1))} disabled={saving} style={{ fontFamily: mono, fontSize: '.68rem', letterSpacing: '.2em', background: 'transparent', color: '#4f8f5f', border: '1px solid #164a22', padding: '0 18px', cursor: 'pointer' }}>
                {step === 0 ? 'SKIP FOR NOW' : '◂ BACK'}
              </button>
              <button style={btn} disabled={saving} onClick={() => (step < 2 ? setStep(s => s + 1) : finish())}>{saving ? 'SAVING…' : step < 2 ? 'CONTINUE ▸' : 'COMPLETE INITIATION ▸'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#000' }} />}><Inner /></Suspense>
}

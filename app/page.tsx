'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { RANK_LIST } from '../lib/supabase'
import { useAuth, Operator } from './components/AuthProvider'
import OperatorAvatar from './components/OperatorAvatar'
import { CATALOG, LAB_STEPS } from '../lib/learning'
import { openGhost } from '../lib/client/ghostContext'
import { Bar, Eyebrow, GxStyles, Ring, T, accentText } from './components/gx/Gx'
import { Decode } from './components/hack/Hack'
import CityNet from './components/hack/CityNet'

type Mod = Operator['modules'][number]
type Filter = 'all' | 'active' | 'owned' | 'new'

function greeting() {
  const h = new Date().getHours()
  return h < 5 ? 'STILL UP' : h < 12 ? 'GOOD MORNING' : h < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING'
}

function ago(iso: string) {
  const s = (Date.now() - Date.parse(iso)) / 1000
  if (s < 60) return 'just now'
  if (s < 3600) return Math.floor(s / 60) + 'm ago'
  if (s < 86400) return Math.floor(s / 3600) + 'h ago'
  return Math.floor(s / 86400) + 'd ago'
}

function todayKey() { return new Date().toISOString().slice(0, 10) }

function useGhostAsksToday() {
  const [n, setN] = useState(0)
  useEffect(() => {
    try { setN(Number(localStorage.getItem('gn_ghost_asks_' + todayKey()) || 0)) } catch {}
  }, [])
  return n
}

export default function Dashboard() {
  const { profile, loading } = useAuth()
  const [filter, setFilter] = useState<Filter>('all')
  const [decodeOnce, setDecodeOnce] = useState(true)
  const asks = useGhostAsksToday()

  useEffect(() => {
    try {
      if (sessionStorage.getItem('gn_dash_decoded')) setDecodeOnce(false)
      else sessionStorage.setItem('gn_dash_decoded', '1')
    } catch {}
  }, [])

  const mods: Mod[] = profile?.modules || []
  const byId = useMemo(() => new Map(mods.map(m => [m.id, m])), [mods])

  // Resume target: the module touched most recently, else the first interest, else MOD-01.
  const resume = useMemo(() => {
    const touched = mods.filter(m => m.updatedAt && m.percent < 100).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))[0]
    const pick = touched || byId.get(profile?.interests?.[0] || '') || byId.get('tor')
    return pick || null
  }, [mods, byId, profile])

  if (loading || !profile) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <GxStyles />
        <div style={{ fontFamily: T.mono, fontSize: '12px', letterSpacing: '.3em', color: T.dim }}>LOADING COMMAND CENTRE…</div>
      </div>
    )
  }

  const name = (profile.display_name || profile.username).toUpperCase()
  const rank = RANK_LIST.slice().reverse().find(r => profile.xp >= r.minXp) || RANK_LIST[0]
  const next = profile.next_rank
  const prevMin = rank.minXp
  const rankPct = next ? ((profile.xp - prevMin) / (next.minXp - prevMin)) * 100 : 100
  const today = profile.today || { chapters: 0, lab_steps: 0, labs: 0, xp: 0 }
  const missions = [
    { id: 'read', title: 'Read a chapter', sub: 'Finish one chapter to the end', have: today.chapters, need: 1, xp: '+5 XP', href: resume ? '/modules/' + resume.id : '/modules/tor' },
    { id: 'lab', title: 'Clear 3 lab steps', sub: 'Any lab, any module', have: today.lab_steps, need: 3, xp: 'LAB XP', href: resume ? '/modules/' + resume.id + '/lab' : '/modules/tor/lab' },
    { id: 'ghost', title: 'Ask GHOST a question', sub: 'About anything you are learning', have: asks, need: 1, xp: 'INTEL', href: '' },
  ]
  const missionsDone = missions.filter(m => m.have >= m.need).length

  // Last 7 days, oldest first.
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000)
    const key = d.toISOString().slice(0, 10)
    return { key, label: d.toLocaleDateString([], { weekday: 'narrow' }), on: (profile.active_days || []).includes(key), today: i === 6 }
  })

  const filtered = mods.filter(m =>
    filter === 'all' ? true : filter === 'owned' ? m.percent >= 100 || m.labCompleted : filter === 'active' ? m.percent > 0 && m.percent < 100 : m.percent === 0)

  const resumeMeta = resume ? CATALOG.find(c => c.id === resume.id) : null
  const nextChapter = resume ? Math.min(resume.chaptersTotal, resume.chaptersRead + 1) : 1

  return (
    <div className="dash">
      <GxStyles />
      <CityNet intensity={0.35} style={{ opacity: 0.5, zIndex: 0 }} />

      {/* Header */}
      <header className="dash-head">
        <div style={{ minWidth: 0 }}>
          <Eyebrow>{'// COMMAND CENTRE · ' + new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</Eyebrow>
          <h1 className="dash-h1">
            <Decode text={greeting() + ', ' + name} duration={700} instant={!decodeOnce} />
          </h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginTop: '10px' }}>
            <span className="hx-tag" style={{ color: rank.color }}>{rank.title.toUpperCase()}</span>
            <span style={{ fontFamily: T.mono, fontSize: '12px', color: T.dimHi, letterSpacing: '.08em' }}>
              {profile.xp.toLocaleString()} XP · {profile.overall_percent}% OF GHOSTNET · {profile.streak_days} DAY STREAK
            </span>
          </div>
        </div>
        <Link href="/profile" className="dash-avatar" aria-label="Your profile">
          <OperatorAvatar seed={profile.avatar_seed || profile.username} color={profile.avatar_color || T.cyan} size={64} />
        </Link>
      </header>

      <div className="dash-grid">
        <main style={{ minWidth: 0, display: 'grid', gap: '28px', alignContent: 'start' }}>
          {/* Continue hero */}
          {resume && resumeMeta && (
            <section className="gx-clay dash-hero" style={{ ['--accent' as string]: resume.color } as React.CSSProperties} aria-labelledby="resume-title">
              <div style={{ minWidth: 0 }}>
                <Eyebrow color={accentText(resume.color)}>
                  {(resume.percent > 0 ? 'RESUME' : 'START HERE') + ' // MOD-' + resume.code + ' · CHAPTER ' + nextChapter + ' OF ' + resume.chaptersTotal}
                </Eyebrow>
                <h2 id="resume-title" style={{ fontFamily: T.sans, fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 650, color: T.tx, margin: '10px 0 6px', letterSpacing: '-.01em' }}>{resume.title}</h2>
                <p style={{ fontFamily: T.sans, fontSize: '15px', lineHeight: 1.55, color: T.body, margin: '0 0 18px', maxWidth: '56ch' }}>{resumeMeta.blurb}</p>
                <div style={{ display: 'grid', gap: '8px', maxWidth: '460px' }}>
                  <Bar value={resume.percent} color={resume.color} label={resume.title + ' progress'} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: T.mono, fontSize: '11.5px', color: T.dimHi, letterSpacing: '.06em' }}>
                    <span>{resume.chaptersRead}/{resume.chaptersTotal} CHAPTERS</span>
                    <span>LAB {resume.labCompleted ? 'CLEARED' : resume.labSteps + '/' + (resume.labTotal || LAB_STEPS[resumeMeta.labId] || 0)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '22px' }}>
                  <Link href={'/modules/' + resume.id} className="gx-btn gx-btn--primary">{resume.percent > 0 ? 'CONTINUE ▸' : 'START MODULE ▸'}</Link>
                  <Link href={'/modules/' + resume.id + '/lab'} className="gx-btn gx-btn--secondary" style={{ ['--accent' as string]: resume.color } as React.CSSProperties}>OPEN LAB</Link>
                </div>
              </div>
              <div className="dash-hero-ring">
                <Ring value={resume.percent} size={132} width={11} color={resume.color} label={resume.title + ' ' + resume.percent + '% complete'} />
              </div>
            </section>
          )}

          {/* Missions */}
          <section aria-labelledby="missions-h">
            <div className="dash-sec-head">
              <h2 id="missions-h" className="dash-h2">TODAY&apos;S MISSIONS</h2>
              <span style={{ fontFamily: T.mono, fontSize: '11.5px', color: missionsDone === 3 ? T.green : T.dimHi, letterSpacing: '.14em' }}>{missionsDone}/3 CLEARED</span>
            </div>
            <div className="dash-missions">
              {missions.map(m => {
                const done = m.have >= m.need
                const inner = (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span className="dash-check" data-done={done} aria-hidden="true">{done ? '✓' : ''}</span>
                      <span className="hx-tag" style={{ color: done ? T.green : T.amber }}>{done ? 'CLEARED' : m.xp}</span>
                    </div>
                    <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: '16px', color: T.tx, marginTop: '14px' }}>{m.title}</div>
                    <div style={{ fontFamily: T.sans, fontSize: '13.5px', color: T.dim, marginTop: '3px' }}>{m.sub}</div>
                    <div style={{ marginTop: '14px' }}><Bar value={(Math.min(m.have, m.need) / m.need) * 100} color={done ? T.green : T.cyan} height={10} label={m.title + ' progress'} /></div>
                    <div style={{ fontFamily: T.mono, fontSize: '11px', color: T.dimHi, marginTop: '6px', letterSpacing: '.08em' }}>{Math.min(m.have, m.need)}/{m.need}</div>
                  </>
                )
                return m.href ? (
                  <Link key={m.id} href={m.href} className="gx-clay gx-hit dash-mission" style={{ ['--accent' as string]: done ? T.green : T.cyan } as React.CSSProperties}>{inner}</Link>
                ) : (
                  <button key={m.id} type="button" onClick={() => openGhost('Explain the most important idea in what I am studying right now, simply.')} className="gx-clay gx-hit dash-mission" style={{ ['--accent' as string]: done ? T.green : T.cyan, textAlign: 'left', font: 'inherit' } as React.CSSProperties}>{inner}</button>
                )
              })}
            </div>
          </section>

          {/* Modules */}
          <section aria-labelledby="mods-h">
            <div className="dash-sec-head">
              <h2 id="mods-h" className="dash-h2">YOUR MODULES</h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} role="group" aria-label="Filter modules">
                {([['all', 'All'], ['active', 'In progress'], ['owned', 'Owned'], ['new', 'New']] as [Filter, string][]).map(([k, l]) => (
                  <button key={k} className="gx-chip" aria-pressed={filter === k} onClick={() => setFilter(k)}>{l}</button>
                ))}
              </div>
            </div>
            {filtered.length === 0 ? (
              <p style={{ fontFamily: T.sans, color: T.dim, fontSize: '15px' }}>Nothing here yet. Pick any module below the filter and start.</p>
            ) : (
              <div className="dash-mods">
                {filtered.map(m => {
                  const meta = CATALOG.find(c => c.id === m.id)
                  const owned = m.labCompleted && m.percent >= 100
                  const state = owned ? 'OWNED' : m.percent > 0 ? 'IN PROGRESS' : 'NEW'
                  const stateColor = owned ? T.green : m.percent > 0 ? T.amber : T.dimHi
                  return (
                    <Link key={m.id} href={'/modules/' + m.id} className={'gx-clay gx-hit dash-mod' + (owned ? ' owned' : '')} style={{ ['--accent' as string]: m.color } as React.CSSProperties}
                      aria-label={'MOD-' + m.code + ' ' + m.title + ', ' + m.percent + '% complete, ' + state.toLowerCase()}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: T.mono, fontSize: '11px', fontWeight: 700, color: accentText(m.color), letterSpacing: '.18em' }}>MOD-{m.code}</span>
                        <span className="hx-tag" style={{ color: T.dimHi, fontSize: '10px' }}>{meta?.level}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                        <Ring value={m.percent} size={64} width={6} color={owned ? T.green : m.color} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: '16px', color: T.tx, lineHeight: 1.3 }}>{m.title}</div>
                          <div style={{ fontFamily: T.mono, fontSize: '11px', color: T.dim, marginTop: '6px', letterSpacing: '.04em' }}>
                            {m.chaptersRead}/{m.chaptersTotal} ch · lab {m.labCompleted ? '✓' : m.labSteps + '/' + (m.labTotal || (meta ? LAB_STEPS[meta.labId] : 0))}
                          </div>
                        </div>
                      </div>
                      <p style={{ fontFamily: T.sans, fontSize: '13.5px', lineHeight: 1.5, color: T.dim, margin: '14px 0 0' }}>{meta?.blurb}</p>
                      <div style={{ fontFamily: T.mono, fontSize: '10.5px', fontWeight: 700, letterSpacing: '.18em', color: stateColor, marginTop: '14px' }}>● {state}</div>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>
        </main>

        {/* Right rail */}
        <aside style={{ display: 'grid', gap: '20px', alignContent: 'start', minWidth: 0 }}>
          <section className="gx-clay" style={{ padding: '22px' }} aria-labelledby="today-h">
            <h2 id="today-h" className="dash-h2" style={{ margin: 0 }}>TODAY</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '16px' }}>
              <Ring value={(missionsDone / 3) * 100} size={84} width={8} color={missionsDone === 3 ? T.green : T.cyan} label={missionsDone + ' of 3 missions cleared'}>{missionsDone}/3</Ring>
              <div>
                <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: '15px', color: T.tx }}>{missionsDone === 3 ? 'All missions cleared' : 'Daily missions'}</div>
                <div style={{ fontFamily: T.sans, fontSize: '13.5px', color: T.dim, marginTop: '3px' }}>{today.xp > 0 ? '+' + today.xp + ' XP earned today' : 'No XP yet today'}</div>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: T.mono, fontSize: '11px', color: T.dimHi, letterSpacing: '.14em', marginBottom: '8px' }}>
                <span>STREAK</span><span style={{ color: profile.streak_days > 0 ? T.green : T.dimHi }}>{profile.streak_days} {profile.streak_days === 1 ? 'DAY' : 'DAYS'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '6px' }} aria-label="Activity over the last 7 days">
                {days.map(d => (
                  <div key={d.key} style={{ textAlign: 'center' }}>
                    <div className="dash-day" data-on={d.on} data-today={d.today} title={d.key + (d.on ? ': active' : '')}>{d.on ? '✓' : ''}</div>
                    <div style={{ fontFamily: T.mono, fontSize: '10.5px', color: d.today ? T.cyan : T.dim, marginTop: '5px' }}>{d.label}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: T.sans, fontSize: '13px', color: T.dim, margin: '12px 0 0', lineHeight: 1.5 }}>
                {days[6].on ? 'You are on the grid today.' : profile.streak_days > 0 ? 'Learn anything today to keep your streak.' : 'Read a chapter or clear a lab step to start a streak.'}
              </p>
            </div>
          </section>

          <section className="gx-clay" style={{ padding: '22px', ['--accent' as string]: rank.color } as React.CSSProperties} aria-labelledby="rank-h">
            <h2 id="rank-h" className="dash-h2" style={{ margin: 0 }}>RANK</h2>
            <div style={{ fontFamily: T.mono, fontWeight: 800, fontSize: '26px', letterSpacing: '.1em', color: rank.color, marginTop: '12px' }}>{rank.title.toUpperCase()}</div>
            <div style={{ margin: '14px 0 8px' }}><Bar value={rankPct} color={rank.color} label={'Progress to ' + (next ? next.title : 'max rank')} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: T.mono, fontSize: '11.5px', color: T.dimHi }}>
              <span>{profile.xp.toLocaleString()} XP</span>
              <span>{next ? (next.minXp - profile.xp).toLocaleString() + ' TO ' + next.title.toUpperCase() : 'MAX RANK'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', gap: '4px' }} aria-hidden="true">
              {RANK_LIST.map(r => (
                <span key={r.title} style={{ fontFamily: T.mono, fontSize: '10px', letterSpacing: '.06em', color: profile.xp >= r.minXp ? r.color : T.line }}>{r.title.toUpperCase()}</span>
              ))}
            </div>
          </section>

          <section className="gx-hud" style={{ padding: '18px 20px', ['--accent' as string]: T.cyan } as React.CSSProperties} aria-labelledby="log-h">
            <h2 id="log-h" className="dash-h2" style={{ margin: '0 0 10px' }}>RECENT ACTIVITY</h2>
            {profile.recent.length === 0 ? (
              <p style={{ fontFamily: T.sans, fontSize: '13.5px', color: T.dim, margin: 0 }}>Your activity log fills up as you learn.</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '10px' }}>
                {profile.recent.filter(r => r.kind !== 'lab_step').slice(0, 6).map((r, i) => {
                  const m = CATALOG.find(c => c.id === r.module_id)
                  const what = r.kind === 'chapter' ? 'Read chapter ' + (Number(r.ref) + 1) : r.kind === 'lab_complete' ? 'Cleared the lab' : r.kind
                  return (
                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontFamily: T.sans, fontSize: '13.5px' }}>
                      <span style={{ color: T.body, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ fontFamily: T.mono, fontSize: '11px', color: m ? accentText(m.color) : T.dim }}>{m ? 'MOD-' + m.code + ' ' : ''}</span>{what}
                      </span>
                      <span style={{ fontFamily: T.mono, fontSize: '11px', color: r.xp ? T.green : T.dim, whiteSpace: 'nowrap' }}>{r.xp ? '+' + r.xp : ''} · {ago(r.created_at)}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section aria-labelledby="tools-h">
            <h2 id="tools-h" className="dash-h2" style={{ margin: '0 0 12px' }}>TOOLS</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[['/terminal', 'Terminal'], ['/tools', 'Commands'], ['/payload', 'Payloads'], ['/intel', 'CVE intel'], ['/attack-path', 'Attack paths'], ['/leaderboard', 'Leaderboard']].map(([h, l]) => (
                <Link key={h} href={h} className="gx-chip">{l}</Link>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <style>{`
        .dash { position: relative; color: var(--tx); }
        .dash > :not(canvas) { position: relative; z-index: 1; }
        .dash-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin-bottom: 32px; }
        .dash-h1 { font-family: var(--mono); font-weight: 800; font-size: clamp(24px, 4vw, 40px); letter-spacing: .06em; line-height: 1.15; margin: 10px 0 0; color: var(--tx); overflow-wrap: anywhere; }
        .dash-h2 { font-family: var(--mono); font-weight: 700; font-size: 12px; letter-spacing: .22em; color: var(--tx-dim-hi); margin: 0; }
        .dash-avatar { flex: none; border-radius: 50%; display: block; }
        .dash-avatar:focus-visible { outline: 2px solid var(--cyan); outline-offset: 4px; }
        .dash-grid { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 28px; align-items: start; }
        .dash-hero { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 24px; align-items: center; padding: clamp(22px, 4vw, 34px); }
        .dash-sec-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
        .dash-missions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        .dash-mission { display: block; padding: 18px; color: inherit; border-radius: 18px; }
        .dash-check { width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; font-weight: 700; color: #04070a; box-shadow: var(--e-well); background: var(--s1); }
        .dash-check[data-done="true"] { background: var(--green); box-shadow: 0 0 12px rgba(0,255,65,.45); }
        .dash-mods { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr)); gap: 16px; }
        .dash-mod { display: block; padding: 18px; color: inherit; border-radius: 18px; }
        .dash-mod.owned { box-shadow: var(--e-clay), 0 0 0 1px rgba(0,255,65,.25); }
        .dash-day { height: 30px; border-radius: 8px; display: grid; place-items: center; font-size: 12px; font-weight: 700; color: #04070a; background: var(--s1); box-shadow: var(--e-well); }
        .dash-day[data-on="true"] { background: var(--green); box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 0 10px rgba(0,255,65,.35); }
        .dash-day[data-today="true"]:not([data-on="true"]) { box-shadow: var(--e-well), 0 0 0 1.5px var(--cyan); }
        @media (max-width: 1100px) { .dash-grid { grid-template-columns: minmax(0, 1fr); } }
        @media (max-width: 720px) {
          .dash-missions { grid-template-columns: minmax(0, 1fr); }
          .dash-hero { grid-template-columns: minmax(0, 1fr); }
          .dash-hero-ring { display: none; }
          .dash-head { align-items: flex-start; }
        }
      `}</style>
    </div>
  )
}

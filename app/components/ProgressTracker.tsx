'use client'
import React, { useState, useEffect } from 'react'
import { RANK_LIST, getNextRankInfo } from '../../lib/supabase'

interface Progress {
  completedLabs: string[]
  xp: number
  streak: number
  lastActivity: string
  notes: Record<string, string>
}

// XP values match actual step totals in each lab page (summed from all step xp values)
const LABS = [
  { id: 'tor-lab',                module: 'MOD-01', label: 'Tor Network Lab',           xp: 345 },
  { id: 'osint-lab',              module: 'MOD-02', label: 'OSINT Investigation Lab',   xp: 305 },
  { id: 'crypto-lab',             module: 'MOD-03', label: 'Crypto Forensics Lab',      xp: 405 },
  { id: 'offensive-lab',          module: 'MOD-04', label: 'Offensive Security Lab',    xp: 400 },
  { id: 'active-directory-lab',   module: 'MOD-05', label: 'Active Directory Lab',      xp: 495 },
  { id: 'web-attacks-lab',        module: 'MOD-06', label: 'Web Attacks Lab',           xp: 445 },
  { id: 'malware-lab',            module: 'MOD-07', label: 'Malware Analysis Lab',      xp: 465 },
  { id: 'network-attacks-lab',    module: 'MOD-08', label: 'Network Attacks Lab',       xp: 445 },
  { id: 'cloud-security-lab',     module: 'MOD-09', label: 'Cloud Security Lab',        xp: 490 },
  { id: 'social-engineering-lab', module: 'MOD-10', label: 'Social Engineering Lab',    xp: 300 },
  { id: 'red-team-lab',           module: 'MOD-11', label: 'Red Team Operations Lab',   xp: 465 },
  { id: 'wireless-attacks-lab',   module: 'MOD-12', label: 'Wireless Attacks Lab',      xp: 455 },
  { id: 'mobile-security-lab',    module: 'MOD-13', label: 'Mobile Security Lab',       xp: 435 },
]
// Total earnable: 5,450 XP
// Rank thresholds: Ghost 0 | Specter 750 | Phantom 1,800 | Wraith 3,200 | Legend 5,000

const MOD_COLORS: Record<string, string> = {
  'MOD-01': '#00ff41', 'MOD-02': '#00d4ff', 'MOD-03': '#ffb347',
  'MOD-04': '#bf5fff', 'MOD-05': '#ff4136', 'MOD-06': '#00d4ff',
  'MOD-07': '#00ff41', 'MOD-08': '#00ffff', 'MOD-09': '#ff9500',
  'MOD-10': '#ff6ec7', 'MOD-11': '#ff3333', 'MOD-12': '#aaff00',
  'MOD-13': '#7c4dff',
}

function getRank(xp: number) {
  return [...RANK_LIST].reverse().find(r => xp >= r.minXp) || RANK_LIST[0]
}

const defaultProgress: Progress = {
  completedLabs: [], xp: 0, streak: 0, lastActivity: '', notes: {},
}

function loadFromStorage(): Progress {
  if (typeof window === 'undefined') return defaultProgress
  try {
    const saved = localStorage.getItem('ghostnet_progress')
    if (saved) return { ...defaultProgress, ...JSON.parse(saved) }
  } catch {}
  return defaultProgress
}

export default function ProgressTracker() {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState<Progress>(defaultProgress)
  const [tab, setTab] = useState<'progress' | 'goals' | 'notes'>('progress')
  const [noteText, setNoteText] = useState('')
  const [noteModule, setNoteModule] = useState('MOD-01')
  const [justEarned, setJustEarned] = useState(0)

  // Load on mount and listen for updates from LabTerminal
  useEffect(() => {
    setProgress(loadFromStorage())
    const onUpdate = () => setProgress(loadFromStorage())
    window.addEventListener('ghostnet_progress_updated', onUpdate)
    return () => window.removeEventListener('ghostnet_progress_updated', onUpdate)
  }, [])

  const save = (p: Progress) => {
    setProgress(p)
    localStorage.setItem('ghostnet_progress', JSON.stringify(p))
    window.dispatchEvent(new Event('ghostnet_progress_updated'))
  }

  // Manual toggle — only mark complete, never un-complete (XP should be one-directional)
  const markComplete = (labId: string, labXp: number) => {
    if (progress.completedLabs.includes(labId)) return // already done — no-op
    const newCompleted = [...progress.completedLabs, labId]
    const newXp = progress.xp + labXp
    setJustEarned(labXp)
    setTimeout(() => setJustEarned(0), 2000)
    const nowIso = new Date().toISOString()
    const prevDay = progress.lastActivity ? new Date(progress.lastActivity).toDateString() : ''
    const todayStr = new Date().toDateString()
    const ystStr = new Date(Date.now() - 86400000).toDateString()
    let newStreak = progress.streak
    if (prevDay === ystStr) newStreak = progress.streak + 1
    else if (prevDay !== todayStr) newStreak = 1
    save({ ...progress, completedLabs: newCompleted, xp: newXp, lastActivity: nowIso, streak: newStreak })
  }

  const saveNote = () => {
    save({ ...progress, notes: { ...progress.notes, [noteModule]: noteText } })
  }

  // Computed values
  const today = new Date().toDateString()
  const lastAct = progress.lastActivity ? new Date(progress.lastActivity).toDateString() : ''
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  const streakActive = lastAct === today || lastAct === yesterday
  const rank = getRank(progress.xp)
  const nextRank = getNextRankInfo(progress.xp)
  const xpToNext = nextRank ? nextRank.minXp - progress.xp : 0
  const progressPct = nextRank
    ? Math.min(100, Math.round(((progress.xp - rank.minXp) / (nextRank.minXp - rank.minXp)) * 100))
    : 100

  const totalLabs = LABS.length
  const doneLabs = progress.completedLabs.filter(id => LABS.some(l => l.id === id)).length

  // Real daily goals
  const activityToday = lastAct === today
  const stepsCompletedToday = (() => {
    // count lab_* keys completed today
    if (typeof window === 'undefined') return 0
    let count = 0
    LABS.forEach(lab => {
      try {
        const raw = localStorage.getItem('lab_' + lab.id)
        if (raw) {
          const d = JSON.parse(raw)
          if (d.completedAt) {
            const dayOf = new Date(d.completedAt).toDateString()
            if (dayOf === today) count++
          }
        }
      } catch {}
    })
    return count
  })()

  const dailyGoals = [
    { id: 'goal-today', label: 'Complete any lab step today', done: activityToday, xp: 50 },
    { id: 'goal-3',     label: 'Complete 3+ labs total',      done: doneLabs >= 3,  xp: 100 },
    { id: 'goal-half',  label: 'Reach 50% completion (7 labs)', done: doneLabs >= 7, xp: 250 },
  ]

  const modules = ['MOD-01','MOD-02','MOD-03','MOD-04','MOD-05','MOD-06','MOD-07','MOD-08','MOD-09','MOD-10','MOD-11','MOD-12','MOD-13']

  return (
    <>
      {justEarned > 0 && (
        <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 9500, background: 'rgba(0,255,65,0.12)', border: '1px solid rgba(0,255,65,0.4)', borderRadius: '6px', padding: '8px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#00ff41', animation: 'ptFadeUp 2s ease forwards', pointerEvents: 'none' }}>
          +{justEarned} XP
          <style>{`@keyframes ptFadeUp{0%{opacity:1;transform:translateY(0)}80%{opacity:1}100%{opacity:0;transform:translateY(-30px)}}`}</style>
        </div>
      )}

      <style>{`
        .pt-btn{position:fixed;bottom:62px;left:24px;z-index:9000}
        .pt-panel{position:fixed;bottom:100px;left:24px;z-index:9001;width:320px;max-height:40vh}
        @media(max-width:768px){
          .pt-btn{bottom:54px;left:8px}
          .pt-panel{bottom:96px;left:8px;right:8px;width:auto;max-height:55vh}
        }
      `}</style>

      <button
        onClick={() => setOpen(!open)}
        className="pt-btn"
        style={{
          background: 'rgba(0,255,65,0.08)', border: '1px solid rgba(0,255,65,0.3)',
          borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#00ff41',
          letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '5px',
          height: '32px', boxSizing: 'border-box' as const,
        }}
      >
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00ff41', flexShrink: 0 }} />
        {progress.xp.toLocaleString()} XP · {rank.title.toUpperCase()}
      </button>

      {open && (
        <div className="pt-panel" style={{
          background: '#080c0a', border: '1px solid rgba(0,255,65,0.2)',
          borderRadius: '10px', display: 'flex', flexDirection: 'column',
          fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #1a2e1e', background: 'rgba(0,255,65,0.04)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '10px', color: '#00ff41', fontWeight: 700, letterSpacing: '0.15em' }}>PROGRESS TRACKER</span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#2a5a2a', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: rank.color }}>{progress.xp.toLocaleString()}</span>
              <span style={{ fontSize: '8px', color: '#3a6a3a', letterSpacing: '0.1em' }}>XP</span>
              <span style={{ fontSize: '9px', color: rank.color, marginLeft: 'auto', letterSpacing: '0.1em' }}>{rank.title.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: '7px', color: '#3a6a3a', marginBottom: '4px' }}>{doneLabs}/{totalLabs} labs complete</div>
            {nextRank && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '7px', color: '#3a6a3a' }}>{xpToNext.toLocaleString()} XP to {nextRank.title}</span>
                  <span style={{ fontSize: '7px', color: '#3a6a3a' }}>{progressPct}%</span>
                </div>
                <div style={{ height: '3px', background: '#1a2e1e', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: progressPct + '%', background: rank.color, borderRadius: '2px', transition: 'width 0.4s' }} />
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' as const }}>
              {(['progress', 'goals', 'notes'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? 'rgba(0,255,65,0.1)' : 'transparent', border: '1px solid ' + (tab === t ? 'rgba(0,255,65,0.3)' : '#1a2e1e'), borderRadius: '3px', padding: '2px 8px', cursor: 'pointer', fontSize: '7px', color: tab === t ? '#00ff41' : '#3a6a3a', letterSpacing: '0.1em' }}>{t.toUpperCase()}</button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
            {tab === 'progress' && modules.map(mod => {
              const modLabs = LABS.filter(l => l.module === mod)
              const modDone = modLabs.filter(l => progress.completedLabs.includes(l.id)).length
              const color = MOD_COLORS[mod] || '#5a7a5a'
              return (
                <div key={mod} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '8px', color, letterSpacing: '0.1em', fontWeight: 700 }}>{mod}</span>
                    <span style={{ fontSize: '7px', color: '#3a6a3a' }}>{modDone}/{modLabs.length}</span>
                  </div>
                  {modLabs.map(lab => {
                    const done = progress.completedLabs.includes(lab.id)
                    return (
                      <div key={lab.id}
                        onClick={() => !done && markComplete(lab.id, lab.xp)}
                        title={done ? 'Completed' : 'Click to mark complete'}
                        style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '4px 5px', borderRadius: '3px', cursor: done ? 'default' : 'pointer', marginBottom: '2px', background: done ? 'rgba(0,255,65,0.04)' : 'transparent', border: '1px solid ' + (done ? 'rgba(0,255,65,0.15)' : 'transparent') }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '2px', border: '1px solid ' + (done ? color : '#1a2e1e'), background: done ? color + '22' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {done && <span style={{ fontSize: '7px', color }}>✓</span>}
                        </div>
                        <span style={{ fontSize: '0.65rem', color: done ? '#8a9a8a' : '#3a6a3a', flex: 1 }}>{lab.label}</span>
                        <span style={{ fontSize: '7px', color: done ? color : '#2a4a2a' }}>+{lab.xp}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })}

            {tab === 'goals' && (
              <div>
                {/* Streak */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: streakActive ? 'rgba(255,179,71,0.06)' : 'rgba(0,0,0,0.2)', border: '1px solid ' + (streakActive ? 'rgba(255,179,71,0.2)' : '#1a2e1e'), borderRadius: '6px', marginBottom: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: streakActive ? 'rgba(255,179,71,0.2)' : 'rgba(58,106,58,0.2)', border: '2px solid ' + (streakActive ? '#ffb347' : '#3a6a3a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: streakActive ? '#ffb347' : '#3a6a3a' }}>{progress.streak}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: streakActive ? '#ffb347' : '#3a6a3a', fontFamily: 'JetBrains Mono, monospace' }}>{progress.streak} day streak</div>
                    <div style={{ fontSize: '7px', color: '#3a6a3a', marginTop: '1px' }}>
                      {streakActive ? 'Active today — keep it going!' : 'Complete a lab to start your streak'}
                    </div>
                  </div>
                </div>

                {/* Daily goals */}
                <div style={{ fontSize: '8px', color: '#3a6a3a', letterSpacing: '0.12em', marginBottom: '6px' }}>GOALS</div>
                {dailyGoals.map(g => (
                  <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '5px 6px', borderRadius: '4px', marginBottom: '4px', background: g.done ? 'rgba(0,255,65,0.04)' : 'transparent', border: '1px solid ' + (g.done ? 'rgba(0,255,65,0.15)' : '#1a2e1e') }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', border: '1px solid ' + (g.done ? '#00ff41' : '#1a2e1e'), background: g.done ? 'rgba(0,255,65,0.15)' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {g.done && <span style={{ fontSize: '8px', color: '#00ff41' }}>✓</span>}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: g.done ? '#8a9a8a' : '#5a7a5a', flex: 1 }}>{g.label}</span>
                    {g.done && <span style={{ fontSize: '7px', color: '#00ff41' }}>+{g.xp} XP</span>}
                  </div>
                ))}

                {/* XP summary */}
                <div style={{ marginTop: '10px', padding: '6px 8px', background: 'rgba(0,255,65,0.04)', borderRadius: '4px', border: '1px solid #1a2e1e' }}>
                  {[
                    ['TOTAL XP', progress.xp.toLocaleString(), '#00ff41'],
                    ['LABS DONE', doneLabs + '/' + totalLabs, '#fff'],
                    ['RANK', rank.title.toUpperCase(), rank.color],
                    ['STREAK', progress.streak + ' days', '#ffb347'],
                  ].map(([k, v, c]) => (
                    <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7px', color: '#3a6a3a', marginBottom: '3px' }}>
                      <span>{k}</span><span style={{ color: c as string }}>{v}</span>
                    </div>
                  ))}
                </div>

                <a href="/leaderboard" style={{ display: 'block', textAlign: 'center', marginTop: '8px', padding: '5px', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '4px', fontSize: '7px', color: '#00d4ff', textDecoration: 'none', letterSpacing: '0.1em' }}>
                  VIEW LEADERBOARD &gt;&gt;
                </a>
              </div>
            )}

            {tab === 'notes' && (
              <div>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '8px', flexWrap: 'wrap' as const }}>
                  {modules.map(m => (
                    <button key={m} onClick={() => { setNoteModule(m); setNoteText(progress.notes[m] || '') }} style={{ background: noteModule === m ? (MOD_COLORS[m] || '#5a7a5a') + '15' : 'transparent', border: '1px solid ' + (noteModule === m ? (MOD_COLORS[m] || '#5a7a5a') + '44' : '#1a2e1e'), borderRadius: '3px', padding: '2px 6px', cursor: 'pointer', fontSize: '7px', color: noteModule === m ? (MOD_COLORS[m] || '#5a7a5a') : '#3a6a3a', letterSpacing: '0.08em' }}>{m}</button>
                  ))}
                </div>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder={'Notes for ' + noteModule + '...'}
                  rows={8}
                  style={{ width: '100%', background: 'rgba(0,255,65,0.03)', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '6px', color: '#8a9a8a', fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', resize: 'vertical' as const, outline: 'none', lineHeight: 1.6, boxSizing: 'border-box' as const }}
                />
                <button onClick={saveNote} style={{ marginTop: '5px', background: 'rgba(0,255,65,0.08)', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '3px', padding: '4px 12px', cursor: 'pointer', fontSize: '7px', color: '#00ff41', letterSpacing: '0.1em', width: '100%' }}>SAVE NOTES</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

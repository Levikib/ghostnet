'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

const accent = '#00d4ff'
const mono = 'JetBrains Mono, monospace'

const RANKS = [
  { title: 'Script Kiddie', minXp: 0, color: '#5a7a5a' },
  { title: 'Recon Agent', minXp: 500, color: '#00d4ff' },
  { title: 'Threat Hunter', minXp: 1500, color: '#00ff41' },
  { title: 'Exploit Dev', minXp: 3000, color: '#ffb347' },
  { title: 'Red Operator', minXp: 5000, color: '#ff4136' },
  { title: 'Ghost Tier', minXp: 8000, color: '#bf5fff' },
  { title: 'Ghost Operative', minXp: 12000, color: '#bf5fff' },
  { title: 'Phantom', minXp: 18000, color: '#ff6ec7' },
  { title: 'Wraith', minXp: 26000, color: '#ff3333' },
  { title: 'Shadow God', minXp: 36000, color: '#ff9500' },
]

const MOD_COLORS: Record<string, string> = {
  'MOD-01': '#00ff41', 'MOD-02': '#00d4ff', 'MOD-03': '#ffb347',
  'MOD-04': '#bf5fff', 'MOD-05': '#ff4136', 'MOD-06': '#00d4ff',
  'MOD-07': '#00ff41', 'MOD-08': '#00ffff', 'MOD-09': '#ff9500',
  'MOD-10': '#ff6ec7', 'MOD-11': '#ff3333', 'MOD-12': '#aaff00',
  'MOD-13': '#7c4dff',
}

// Simulated leaderboard data — in a real deploy this pulls from Supabase
const MOCK_OPERATORS = [
  { rank: 1, handle: 'ShanGhost', xp: 42500, labs: 71, streak: 14, badge: 'Shadow God', badgeColor: '#ff9500' },
  { rank: 2, handle: 'n0x_phantom', xp: 28900, labs: 58, streak: 7, badge: 'Wraith', badgeColor: '#ff3333' },
  { rank: 3, handle: 'r00tkit_raven', xp: 19200, labs: 44, streak: 5, badge: 'Phantom', badgeColor: '#ff6ec7' },
  { rank: 4, handle: 'zero_day_zara', xp: 14100, labs: 37, streak: 3, badge: 'Ghost Operative', badgeColor: '#bf5fff' },
  { rank: 5, handle: 'malware_mike', xp: 10800, labs: 31, streak: 2, badge: 'Ghost Tier', badgeColor: '#bf5fff' },
  { rank: 6, handle: 'binary_bandit', xp: 7300, labs: 24, streak: 1, badge: 'Red Operator', badgeColor: '#ff4136' },
  { rank: 7, handle: 'kali_kira', xp: 5100, labs: 19, streak: 4, badge: 'Red Operator', badgeColor: '#ff4136' },
  { rank: 8, handle: 'exploit_echo', xp: 3800, labs: 14, streak: 0, badge: 'Exploit Dev', badgeColor: '#ffb347' },
  { rank: 9, handle: 'ghost_gareth', xp: 2200, labs: 11, streak: 2, badge: 'Threat Hunter', badgeColor: '#00ff41' },
  { rank: 10, handle: 'net_nyx', xp: 1400, labs: 8, streak: 0, badge: 'Recon Agent', badgeColor: '#00d4ff' },
]

function getRank(xp: number) {
  return [...RANKS].reverse().find(r => xp >= r.minXp) || RANKS[0]
}

interface LocalProgress {
  xp: number
  completedLabs: string[]
  streak: number
}

export default function LeaderboardPage() {
  const [myProgress, setMyProgress] = useState<LocalProgress | null>(null)
  const [activeTab, setActiveTab] = useState<'global' | 'modules'>('global')

  useEffect(() => {
    const saved = localStorage.getItem('ghostnet_progress')
    if (saved) {
      const p = JSON.parse(saved)
      setMyProgress({ xp: p.xp || 0, completedLabs: p.completedLabs || [], streak: p.streak || 0 })
    }
  }, [])

  const myRank = myProgress ? getRank(myProgress.xp) : null

  const modules = [
    { id: 'MOD-01', name: 'Tor Anonymity', totalLabs: 5 },
    { id: 'MOD-02', name: 'OSINT', totalLabs: 6 },
    { id: 'MOD-03', name: 'Cryptography', totalLabs: 6 },
    { id: 'MOD-04', name: 'Offensive Security', totalLabs: 6 },
    { id: 'MOD-05', name: 'Active Directory', totalLabs: 5 },
    { id: 'MOD-06', name: 'Web Attacks', totalLabs: 5 },
    { id: 'MOD-07', name: 'Malware Analysis', totalLabs: 5 },
    { id: 'MOD-08', name: 'Network Attacks', totalLabs: 5 },
    { id: 'MOD-09', name: 'Cloud Security', totalLabs: 5 },
    { id: 'MOD-10', name: 'Social Engineering', totalLabs: 5 },
    { id: 'MOD-11', name: 'Red Team Ops', totalLabs: 5 },
    { id: 'MOD-12', name: 'Wireless Attacks', totalLabs: 5 },
    { id: 'MOD-13', name: 'Mobile Security', totalLabs: 5 },
  ]

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: mono, fontSize: '0.7rem', color: '#006a7a' }}>
        <Link href="/" style={{ color: '#006a7a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LEADERBOARD</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#006a7a', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>OPERATOR RANKINGS</div>
        <h1 style={{ fontFamily: mono, fontSize: '1.8rem', fontWeight: 700, color: accent, margin: 0 }}>Leaderboard</h1>
        <p style={{ color: '#5a8a9a', fontSize: '0.85rem', marginTop: '0.6rem', lineHeight: 1.7 }}>
          Top operators ranked by XP earned across all modules and interactive labs.
        </p>
      </div>

      {/* My stats card */}
      {myProgress && myRank && (
        <div style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', padding: '16px 20px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' as const }}>
          <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#006a7a', letterSpacing: '0.15em' }}>YOUR STATS</div>
          <div style={{ display: 'flex', gap: '24px', flex: 1, flexWrap: 'wrap' as const }}>
            <div>
              <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#3a6a7a', marginBottom: '2px' }}>XP</div>
              <div style={{ fontFamily: mono, fontSize: '1.1rem', fontWeight: 700, color: accent }}>{myProgress.xp.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#3a6a7a', marginBottom: '2px' }}>RANK</div>
              <div style={{ fontFamily: mono, fontSize: '0.85rem', fontWeight: 700, color: myRank.color }}>{myRank.title.toUpperCase()}</div>
            </div>
            <div>
              <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#3a6a7a', marginBottom: '2px' }}>LABS</div>
              <div style={{ fontFamily: mono, fontSize: '1.1rem', fontWeight: 700, color: '#00ff41' }}>{myProgress.completedLabs.length}</div>
            </div>
            <div>
              <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#3a6a7a', marginBottom: '2px' }}>STREAK</div>
              <div style={{ fontFamily: mono, fontSize: '1.1rem', fontWeight: 700, color: '#ffb347' }}>{myProgress.streak}d</div>
            </div>
          </div>
          <div style={{ fontFamily: mono, fontSize: '0.7rem', color: '#3a6a7a' }}>
            Sign in to appear on the global board
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem' }}>
        {(['global', 'modules'] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{ background: activeTab === t ? 'rgba(0,212,255,0.1)' : 'transparent', border: '1px solid ' + (activeTab === t ? 'rgba(0,212,255,0.35)' : '#1a2e2e'), borderRadius: '4px', padding: '5px 14px', cursor: 'pointer', fontFamily: mono, fontSize: '0.7rem', color: activeTab === t ? accent : '#3a6a7a', letterSpacing: '0.1em' }}
          >
            {t === 'global' ? 'GLOBAL TOP 10' : 'MODULE PROGRESS'}
          </button>
        ))}
      </div>

      {/* Global leaderboard */}
      {activeTab === 'global' && (
        <div>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 90px 70px 60px 100px', gap: '8px', padding: '6px 12px', fontFamily: mono, fontSize: '0.6rem', color: '#3a6a7a', letterSpacing: '0.12em', borderBottom: '1px solid #1a2e2e', marginBottom: '4px' }}>
            <div>#</div>
            <div>OPERATOR</div>
            <div style={{ textAlign: 'right' }}>XP</div>
            <div style={{ textAlign: 'right' }}>LABS</div>
            <div style={{ textAlign: 'right' }}>STREAK</div>
            <div style={{ textAlign: 'right' }}>RANK</div>
          </div>

          {MOCK_OPERATORS.map((op, i) => {
            const isTop3 = op.rank <= 3
            const rankColors = ['#ff9500', '#8a9a8a', '#ffb347']
            const bg = i % 2 === 0 ? 'rgba(0,212,255,0.02)' : 'transparent'
            return (
              <div
                key={op.handle}
                style={{ display: 'grid', gridTemplateColumns: '40px 1fr 90px 70px 60px 100px', gap: '8px', padding: '9px 12px', fontFamily: mono, background: bg, borderRadius: '4px', alignItems: 'center', borderLeft: isTop3 ? '2px solid ' + rankColors[i] : '2px solid transparent', marginBottom: '2px' }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isTop3 ? rankColors[i] : '#3a6a7a' }}>
                  {op.rank <= 3 ? ['I', 'II', 'III'][op.rank - 1] : op.rank}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#c0d0c0', fontWeight: 600 }}>{op.handle}</div>
                <div style={{ fontSize: '0.82rem', color: accent, textAlign: 'right', fontWeight: 600 }}>{op.xp.toLocaleString()}</div>
                <div style={{ fontSize: '0.78rem', color: '#00ff41', textAlign: 'right' }}>{op.labs}</div>
                <div style={{ fontSize: '0.78rem', color: '#ffb347', textAlign: 'right' }}>{op.streak > 0 ? op.streak + 'd' : '-'}</div>
                <div style={{ fontSize: '0.65rem', color: op.badgeColor, textAlign: 'right', letterSpacing: '0.08em' }}>{op.badge.toUpperCase()}</div>
              </div>
            )
          })}

          <div style={{ marginTop: '1.5rem', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid #1a2e2e', borderRadius: '6px', fontFamily: mono, fontSize: '0.72rem', color: '#3a6a7a', lineHeight: 1.6 }}>
            Leaderboard updates daily. Complete labs via the interactive terminal to earn XP.
            <br />
            <Link href="/auth" style={{ color: accent, textDecoration: 'none' }}>Sign in</Link> to save your progress and appear on the global board.
          </div>
        </div>
      )}

      {/* Module progress */}
      {activeTab === 'modules' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {modules.map(mod => {
            const color = MOD_COLORS[mod.id] || '#5a7a5a'
            const labsDone = myProgress
              ? myProgress.completedLabs.filter(l => l.startsWith(mod.id.toLowerCase().replace('mod-', ''))).length
              : 0
            const pct = Math.round((labsDone / mod.totalLabs) * 100)
            return (
              <div key={mod.id} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1a2e2e', borderRadius: '8px', padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontFamily: mono, fontSize: '0.6rem', color: color + 'aa', letterSpacing: '0.15em', marginBottom: '3px' }}>{mod.id}</div>
                    <div style={{ fontFamily: mono, fontSize: '0.8rem', fontWeight: 600, color: color }}>{mod.name}</div>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: '0.7rem', color: '#3a6a7a' }}>{pct}%</div>
                </div>
                <div style={{ height: '3px', background: '#1a2e1e', borderRadius: '2px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{ height: '100%', width: pct + '%', background: color, borderRadius: '2px', transition: 'width 0.4s' }} />
                </div>
                <div style={{ fontFamily: mono, fontSize: '0.62rem', color: '#2a4a3a' }}>
                  {labsDone}/{mod.totalLabs} labs &#183; Sign in to see global rankings
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

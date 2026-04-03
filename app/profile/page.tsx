'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthProvider'
import { supabase, RANK_COLORS, RANK_THRESHOLDS } from '../../lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const mono = 'JetBrains Mono, monospace'

// ─── Constants ───────────────────────────────────────────────────────────────

const ALL_MODULES = [
  { id: 'tor',               num: '01', label: 'Tor & Dark Web',       color: '#00ff41', href: '/modules/tor',               labId: 'tor-lab',               xpMax: 345 },
  { id: 'osint',             num: '02', label: 'OSINT & Surveillance',  color: '#00d4ff', href: '/modules/osint',             labId: 'osint-lab',             xpMax: 305 },
  { id: 'crypto',            num: '03', label: 'Crypto & Blockchain',   color: '#ffb347', href: '/modules/crypto',            labId: 'crypto-lab',            xpMax: 300 },
  { id: 'offensive',         num: '04', label: 'Offensive Security',    color: '#bf5fff', href: '/modules/offensive',         labId: 'offensive-lab',         xpMax: 280 },
  { id: 'active-directory',  num: '05', label: 'Active Directory',      color: '#ff4136', href: '/modules/active-directory',  labId: 'active-directory-lab',  xpMax: 235 },
  { id: 'web-attacks',       num: '06', label: 'Web Attacks',           color: '#00d4ff', href: '/modules/web-attacks',       labId: 'web-attacks-lab',       xpMax: 225 },
  { id: 'malware',           num: '07', label: 'Malware Analysis',      color: '#00ff41', href: '/modules/malware',           labId: 'malware-lab',           xpMax: 210 },
  { id: 'network-attacks',   num: '08', label: 'Network Attacks',       color: '#00ffff', href: '/modules/network-attacks',   labId: 'network-attacks-lab',   xpMax: 175 },
  { id: 'cloud-security',    num: '09', label: 'Cloud Security',        color: '#ff9500', href: '/modules/cloud-security',    labId: 'cloud-security-lab',    xpMax: 145 },
  { id: 'social-engineering',num: '10', label: 'Social Engineering',    color: '#ff6ec7', href: '/modules/social-engineering',labId: 'social-engineering-lab',xpMax: 120 },
  { id: 'red-team',          num: '11', label: 'Red Team Ops',          color: '#ff3333', href: '/modules/red-team',          labId: 'red-team-lab',          xpMax: 135 },
  { id: 'wireless-attacks',  num: '12', label: 'Wireless Attacks',      color: '#aaff00', href: '/modules/wireless-attacks',  labId: 'wireless-attacks-lab',  xpMax: 135 },
  { id: 'mobile-security',   num: '13', label: 'Mobile Security',       color: '#7c4dff', href: '/modules/mobile-security',   labId: 'mobile-security-lab',   xpMax: 130 },
]

const RANK_NAMES = ['Ghost', 'Specter', 'Phantom', 'Wraith', 'Legend'] as const
const RANK_VISIBLE_COLORS: Record<string, string> = {
  Ghost:   '#4a9a4a',
  Specter: '#00d4ff',
  Phantom: '#bf5fff',
  Wraith:  '#ff4136',
  Legend:  '#ffb347',
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface BadgeWithStatus {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
  xp_reward: number
  requirement_type: string
  requirement_value: number
  earned: boolean
  earned_at?: string
}

interface LabStat {
  lab_id: string
  module_id: string
  xp_earned: number
  completed_at?: string
  attempts?: number
}

interface LocalProgress {
  xp: number
  completedLabs: string[]
  streak: number
  lastActivity: string
}

// ─── LocalStorage helper ──────────────────────────────────────────────────────

function readLocalProgress(): LocalProgress {
  if (typeof window === 'undefined') return { xp: 0, completedLabs: [], streak: 0, lastActivity: '' }
  try {
    const raw = localStorage.getItem('ghostnet_progress')
    if (raw) return JSON.parse(raw)
  } catch {}
  return { xp: 0, completedLabs: [], streak: 0, lastActivity: '' }
}

function readLocalLabData(): LabStat[] {
  if (typeof window === 'undefined') return []
  const labs: LabStat[] = []
  ALL_MODULES.forEach(m => {
    try {
      const raw = localStorage.getItem('lab_' + m.labId)
      if (raw) {
        const d = JSON.parse(raw)
        if (d.done) {
          labs.push({
            lab_id: m.labId,
            module_id: m.id,
            xp_earned: d.xp || 0,
            completed_at: d.completedAt,
          })
        }
      }
    } catch {}
  })
  return labs
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, color, sub }: { label: string; value: string | number; color: string; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', background: '#0a140a', border: '1px solid ' + color + '28', borderRadius: '8px', padding: '14px 18px', minWidth: '80px' }}>
      <div style={{ fontFamily: mono, fontSize: '1.6rem', color, fontWeight: 700, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: mono, fontSize: '7px', color: color + '88', marginTop: '2px' }}>{sub}</div>}
      <div style={{ fontFamily: mono, fontSize: '7px', color: '#3a6a3a', letterSpacing: '0.15em', marginTop: '4px' }}>{label}</div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, profile, signOut, isSupabaseConfigured, loading } = useAuth()
  const router = useRouter()

  const [badges, setBadges] = useState<BadgeWithStatus[]>([])
  const [labStats, setLabStats] = useState<LabStat[]>([])
  const [localProgress, setLocalProgress] = useState<LocalProgress>({ xp: 0, completedLabs: [], streak: 0, lastActivity: '' })
  const [dataLoading, setDataLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'badges' | 'history'>('overview')
  const [copyDone, setCopyDone] = useState(false)

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) router.push('/auth')
  }, [user, loading, router])

  // Load localStorage data immediately (works offline)
  useEffect(() => {
    const loadLocal = () => {
      setLocalProgress(readLocalProgress())
      setLabStats(prev => {
        // Only replace with localStorage data if Supabase not loaded
        const localData = readLocalLabData()
        return localData.length > 0 ? localData : prev
      })
      setDataLoading(false)
    }
    loadLocal()
    // Re-sync whenever LabTerminal fires a completion event
    window.addEventListener('ghostnet_progress_updated', loadLocal)
    return () => window.removeEventListener('ghostnet_progress_updated', loadLocal)
  }, [])

  // Layer Supabase data on top if available
  const loadSupabaseData = async () => {
    if (!user || !isSupabaseConfigured) return
    try {
      const [{ data: allBadges }, { data: userBadges }, { data: labProgress }] = await Promise.all([
        supabase.from('badges').select('*').order('requirement_value'),
        supabase.from('user_badges').select('badge_id, earned_at').eq('user_id', user!.id),
        supabase.from('lab_progress').select('*').eq('user_id', user!.id).eq('completed', true).order('completed_at', { ascending: false }),
      ])
      if (allBadges) {
        const earnedIds = new Set((userBadges || []).map((b: { badge_id: string }) => b.badge_id))
        const earnedMap = Object.fromEntries((userBadges || []).map((b: { badge_id: string; earned_at: string }) => [b.badge_id, b.earned_at]))
        setBadges(allBadges.map((b: BadgeWithStatus) => ({ ...b, earned: earnedIds.has(b.id), earned_at: earnedMap[b.id] })))
      }
      if (labProgress && labProgress.length > 0) setLabStats(labProgress)
    } catch {}
  }

  useEffect(() => {
    loadSupabaseData()
  }, [user, isSupabaseConfigured])

  // Re-fetch Supabase after lab completion (triggered by LabTerminal)
  useEffect(() => {
    const onRefresh = () => loadSupabaseData()
    window.addEventListener('ghostnet_profile_refresh', onRefresh)
    return () => window.removeEventListener('ghostnet_profile_refresh', onRefresh)
  }, [user, isSupabaseConfigured])

  // ── Loading state ──
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', fontFamily: mono, color: '#4a8a4a', fontSize: '0.8rem', letterSpacing: '0.2em' }}>
        LOADING OPERATOR PROFILE...
      </div>
    )
  }

  if (!user) return null

  // ── Derive display values ──
  const displayName = profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'OPERATOR'
  const rank = profile?.ghost_rank || 'Ghost'
  const rankColor = RANK_VISIBLE_COLORS[rank] || '#4a9a4a'
  const xp = profile?.xp || localProgress.xp || 0
  const streak = profile?.streak_days || localProgress.streak || 0
  const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'

  // XP progress to next rank
  const rankEntries = Object.entries(RANK_THRESHOLDS) as [string, number][]
  const curRankIdx = rankEntries.findIndex(([r]) => r === rank)
  const nextRank = rankEntries[curRankIdx + 1]
  const curRankXp = RANK_THRESHOLDS[rank as keyof typeof RANK_THRESHOLDS] || 0
  const nextRankXp = nextRank ? nextRank[1] : null
  const xpToNext = nextRankXp ? nextRankXp - xp : 0
  const rankProgress = nextRankXp ? Math.min(100, Math.round(((xp - curRankXp) / (nextRankXp - curRankXp)) * 100)) : 100

  // Module completion from lab stats
  const completedModuleIds = new Set(labStats.map(l => l.module_id))
  const totalLabXp = labStats.reduce((s, l) => s + (l.xp_earned || 0), 0)
  const earnedBadges = badges.filter(b => b.earned)

  // Labs per module (merge Supabase + localStorage)
  const labsByModule: Record<string, LabStat[]> = {}
  labStats.forEach(l => {
    const key = l.module_id
    if (!labsByModule[key]) labsByModule[key] = []
    labsByModule[key].push(l)
  })

  // Recent activity (last 5)
  const recentLabs = [...labStats].sort((a, b) => {
    if (!a.completed_at) return 1
    if (!b.completed_at) return -1
    return new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  }).slice(0, 5)

  const completedCount = labStats.length
  const modulesStarted = Object.keys(labsByModule).length

  function handleCopyUID() {
    navigator.clipboard.writeText(user!.id)
    setCopyDone(true)
    setTimeout(() => setCopyDone(false), 2000)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', fontFamily: mono }}>

      {/* ── Profile header ── */}
      <div style={{ background: '#030a03', border: '1px solid ' + rankColor + '30', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + rankColor + ', transparent)' }} />
        {/* Glow bg */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: rankColor, opacity: 0.03, borderRadius: '50%', filter: 'blur(40px)' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap', position: 'relative' }}>

          {/* Avatar */}
          <div style={{ width: '72px', height: '72px', borderRadius: '10px', border: '2px solid ' + rankColor + '55', background: rankColor + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 20px ' + rankColor + '20' }}>
            <span style={{ fontSize: '2rem', color: rankColor, fontWeight: 700, fontFamily: mono }}>
              {displayName[0].toUpperCase()}
            </span>
          </div>

          {/* Identity + XP bar */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <h1 style={{ fontFamily: mono, fontSize: '1.5rem', color: '#d8e8d8', margin: 0, fontWeight: 700, letterSpacing: '0.04em' }}>{displayName.toUpperCase()}</h1>
              <span style={{ fontFamily: mono, fontSize: '8px', color: rankColor, background: rankColor + '18', border: '1px solid ' + rankColor + '40', padding: '3px 10px', borderRadius: '3px', letterSpacing: '0.2em', fontWeight: 700 }}>
                {rank.toUpperCase()}
              </span>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#4a7a4a', marginBottom: '1rem', lineHeight: 1.6 }}>
              {streak > 0 && <span style={{ color: '#ffb347' }}>{streak}-DAY STREAK &nbsp;·&nbsp; </span>}
              <span>Member since {memberSince}</span>
              {user.email && <span style={{ color: '#2a5a2a' }}> &nbsp;·&nbsp; {user.email}</span>}
            </div>

            {/* XP progress */}
            <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.8rem', color: rankColor, fontWeight: 700 }}>{xp.toLocaleString()} XP</span>
              {nextRank && (
                <span style={{ fontSize: '0.65rem', color: '#3a6a3a' }}>
                  {xpToNext.toLocaleString()} XP to {nextRank[0].toUpperCase()}
                </span>
              )}
              {!nextRank && <span style={{ fontSize: '0.65rem', color: rankColor }}>MAX RANK ACHIEVED</span>}
            </div>
            <div style={{ height: '7px', background: '#0a140a', borderRadius: '4px', border: '1px solid #1a3a1a', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: rankProgress + '%', background: 'linear-gradient(90deg, ' + rankColor + '88, ' + rankColor + ')', borderRadius: '4px', boxShadow: '0 0 8px ' + rankColor + '66', transition: 'width 1.2s ease' }} />
            </div>

            {/* Rank ladder */}
            <div style={{ display: 'flex', gap: '4px', marginTop: '10px', flexWrap: 'wrap' }}>
              {RANK_NAMES.map((r, i) => {
                const rColor = RANK_VISIBLE_COLORS[r]
                const isCurrent = r === rank
                const isPast = i < curRankIdx
                return (
                  <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: isCurrent || isPast ? rColor : 'transparent',
                      border: '1px solid ' + rColor + (isCurrent || isPast ? '' : '44'),
                      boxShadow: isCurrent ? '0 0 6px ' + rColor : 'none',
                    }} />
                    <span style={{ fontSize: '6px', color: isCurrent ? rColor : isPast ? rColor + '77' : '#1a3a1a', letterSpacing: '0.1em' }}>{r.toUpperCase()}</span>
                    {i < RANK_NAMES.length - 1 && <span style={{ fontSize: '6px', color: '#1a3a1a' }}>—</span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignSelf: 'flex-start' }}>
            <StatCard label="LABS DONE" value={completedCount} color="#00ff41" sub={completedCount + '/13 labs'} />
            <StatCard label="TOTAL XP" value={xp.toLocaleString()} color={rankColor} />
            <StatCard label="MODULES" value={modulesStarted} color="#00d4ff" sub={modulesStarted + '/13'} />
            <StatCard label="STREAK" value={streak} color="#ffb347" sub={streak > 0 ? 'days active' : 'start today'} />
            {badges.length > 0 && <StatCard label="BADGES" value={earnedBadges.length} color="#bf5fff" sub={earnedBadges.length + '/' + badges.length} />}
          </div>
        </div>

        {/* Recent activity strip */}
        {recentLabs.length > 0 && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #0d1f0d' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '7px', color: '#1a4a1a', letterSpacing: '0.25em' }}>RECENT ACTIVITY</div>
              {isSupabaseConfigured && (
                <button
                  onClick={() => loadSupabaseData()}
                  style={{ background: 'transparent', border: '1px solid #1a3a1a', borderRadius: '3px', padding: '2px 8px', cursor: 'pointer', fontFamily: mono, fontSize: '6.5px', color: '#3a6a3a', letterSpacing: '0.1em' }}
                >
                  ↻ REFRESH
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {recentLabs.map((lab, i) => {
                const mod = ALL_MODULES.find(m => m.id === lab.module_id || m.labId === lab.lab_id)
                const label = mod?.label || lab.lab_id.replace(/-lab$/, '').replace(/-/g, ' ').toUpperCase()
                const c = mod?.color || '#00ff41'
                return (
                  <div key={i} style={{ background: c + '0d', border: '1px solid ' + c + '25', borderRadius: '4px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: c }} />
                    <span style={{ fontSize: '7.5px', color: c }}>{label}</span>
                    <span style={{ fontSize: '7px', color: '#ffb347' }}>+{lab.xp_earned} XP</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '3px', marginBottom: '1.5rem', background: '#0a140a', borderRadius: '8px', padding: '4px', border: '1px solid #0d1f0d' }}>
        {([
          { id: 'overview',  label: '◈ OVERVIEW' },
          { id: 'progress',  label: '▸ MODULE PROGRESS' },
          { id: 'badges',    label: '⚡ BADGES' },
          { id: 'history',   label: '⌂ LAB HISTORY' },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: '8px 4px', borderRadius: '5px', cursor: 'pointer',
            fontFamily: mono, fontSize: '7.5px', letterSpacing: '0.1em', border: 'none',
            background: activeTab === tab.id ? 'rgba(0,255,65,0.1)' : 'transparent',
            color: activeTab === tab.id ? '#00ff41' : '#4a7a4a',
            fontWeight: activeTab === tab.id ? 700 : 400,
            transition: 'all 0.15s',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW tab ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>

          {/* XP breakdown */}
          <div style={{ background: '#030a03', border: '1px solid #0d1f0d', borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ fontSize: '7px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '1rem' }}>XP BREAKDOWN</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#5a8a5a' }}>Lab completions</span>
                <span style={{ fontSize: '0.78rem', color: '#00ff41', fontWeight: 700 }}>{totalLabXp.toLocaleString()} XP</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#5a8a5a' }}>Badge rewards</span>
                <span style={{ fontSize: '0.78rem', color: '#ffb347', fontWeight: 700 }}>{earnedBadges.reduce((s, b) => s + b.xp_reward, 0).toLocaleString()} XP</span>
              </div>
              <div style={{ borderTop: '1px solid #0d1f0d', paddingTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#8a9a8a' }}>Total XP</span>
                <span style={{ fontSize: '0.9rem', color: rankColor, fontWeight: 700 }}>{xp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>

          {/* Completion overview */}
          <div style={{ background: '#030a03', border: '1px solid #0d1f0d', borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ fontSize: '7px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '1rem' }}>COMPLETION OVERVIEW</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Labs completed', value: completedCount, total: 13, color: '#00ff41' },
                { label: 'Modules started', value: modulesStarted, total: 13, color: '#00d4ff' },
                { label: 'Badges earned', value: earnedBadges.length, total: Math.max(badges.length, 31), color: '#bf5fff' },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#5a8a5a' }}>{row.label}</span>
                    <span style={{ fontSize: '0.72rem', color: row.color }}>{row.value}/{row.total}</span>
                  </div>
                  <div style={{ height: '4px', background: '#0a140a', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: Math.round((row.value / row.total) * 100) + '%', background: row.color, borderRadius: '2px', opacity: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rank roadmap */}
          <div style={{ background: '#030a03', border: '1px solid #0d1f0d', borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ fontSize: '7px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '1rem' }}>RANK ROADMAP</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {RANK_NAMES.map((r, i) => {
                const threshold = RANK_THRESHOLDS[r]
                const rColor = RANK_VISIBLE_COLORS[r]
                const isCurrent = r === rank
                const isPast = xp >= threshold && !(r === rank && false)
                const isLocked = xp < threshold
                return (
                  <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: isLocked ? 0.4 : 1 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isPast && !isLocked ? rColor : 'transparent', border: '1px solid ' + rColor + (isLocked ? '44' : ''), boxShadow: isCurrent ? '0 0 8px ' + rColor : 'none', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.78rem', color: isCurrent ? rColor : isPast ? rColor + '99' : '#3a5a3a', fontWeight: isCurrent ? 700 : 400 }}>{r.toUpperCase()}</span>
                      {isCurrent && <span style={{ fontSize: '6.5px', color: rColor + '88', marginLeft: '6px' }}>← YOU ARE HERE</span>}
                    </div>
                    <span style={{ fontSize: '7px', color: '#2a5a2a' }}>{threshold.toLocaleString()} XP</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ background: '#030a03', border: '1px solid #0d1f0d', borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ fontSize: '7px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '1rem' }}>QUICK ACTIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Continue learning', href: '/', color: '#00ff41' },
                { label: 'View leaderboard', href: '/leaderboard', color: '#00d4ff' },
                { label: 'Browse modules', href: '/#modules', color: '#ffb347' },
                { label: 'Ghost AI agent', href: '/', color: '#bf5fff' },
              ].map(action => (
                <Link key={action.href} href={action.href} style={{
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px', borderRadius: '5px', border: '1px solid ' + action.color + '18',
                  background: action.color + '06', transition: 'all 0.15s',
                }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: action.color }} />
                  <span style={{ fontSize: '0.78rem', color: action.color, letterSpacing: '0.05em' }}>{action.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '8px', color: action.color + '66' }}>&#8594;</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── MODULE PROGRESS tab ── */}
      {activeTab === 'progress' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '7px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>
            {modulesStarted}/13 MODULES STARTED &nbsp;·&nbsp; {completedCount} LABS COMPLETED
          </div>
          {ALL_MODULES.map(mod => {
            const modLabs = labsByModule[mod.id] || []
            const modXp = modLabs.reduce((s, l) => s + (l.xp_earned || 0), 0)
            const pct = Math.round((modXp / mod.xpMax) * 100)
            const started = modLabs.length > 0
            const done = modXp >= mod.xpMax
            return (
              <div key={mod.id} style={{ background: '#030a03', border: '1px solid ' + (started ? mod.color + '25' : '#0d1f0d'), borderRadius: '8px', padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {/* Color dot + module info */}
                  <div style={{ width: '4px', height: '40px', background: started ? mod.color : '#1a3a1a', borderRadius: '2px', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '7px', color: '#2a5a2a' }}>MOD-{mod.num}</span>
                      <span style={{ fontSize: '9px', color: started ? mod.color : '#3a6a3a', fontWeight: started ? 600 : 400 }}>{mod.label}</span>
                      {done && <span style={{ fontSize: '6px', color: mod.color, background: mod.color + '18', border: '1px solid ' + mod.color + '30', padding: '1px 6px', borderRadius: '2px', letterSpacing: '0.1em' }}>COMPLETE</span>}
                    </div>
                    <div style={{ height: '4px', background: '#0a140a', borderRadius: '2px', overflow: 'hidden', width: '100%', border: '1px solid #0d1f0d' }}>
                      <div style={{ height: '100%', width: pct + '%', background: mod.color, borderRadius: '2px', opacity: 0.85, transition: 'width 0.8s ease' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
                      <span style={{ fontSize: '6.5px', color: '#2a5a2a' }}>{modXp}/{mod.xpMax} XP</span>
                      <span style={{ fontSize: '6.5px', color: started ? mod.color + '88' : '#1a3a1a' }}>{pct}%</span>
                    </div>
                  </div>
                  {/* Action links */}
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <Link href={mod.href} style={{ textDecoration: 'none', fontFamily: mono, fontSize: '7px', padding: '4px 10px', borderRadius: '3px', color: '#5a8a5a', border: '1px solid #1a3a1a', letterSpacing: '0.08em' }}>
                      CONCEPT
                    </Link>
                    <Link href={mod.href + '/lab'} style={{ textDecoration: 'none', fontFamily: mono, fontSize: '7px', padding: '4px 10px', borderRadius: '3px', color: mod.color, border: '1px solid ' + mod.color + '40', background: mod.color + '0a', letterSpacing: '0.08em', fontWeight: 600 }}>
                      {started ? 'CONTINUE LAB' : 'START LAB'}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── BADGES tab ── */}
      {activeTab === 'badges' && (
        <div>
          {badges.length === 0 ? (
            <div style={{ background: '#030a03', border: '1px solid #0d1f0d', borderRadius: '8px', padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: '#3a6a3a', marginBottom: '0.5rem' }}>BADGE DATA NOT LOADED</div>
              <div style={{ fontSize: '0.7rem', color: '#2a5a2a', lineHeight: 1.6 }}>
                Badges require the Supabase schema to be applied.<br />
                Run <span style={{ color: '#ffb347' }}>supabase-schema.sql</span> in your Supabase SQL editor to enable the badge system.
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {['First Blood', 'Lab Rat', 'Operator', 'Tor Master', 'OSINT Recon', 'Cryptologist', 'Red Operator', '7-Day Streak', 'Ghost Protocol'].map(name => (
                  <div key={name} style={{ background: '#0a140a', border: '1px solid #1a3a1a', borderRadius: '6px', padding: '10px 14px', opacity: 0.4 }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '4px', textAlign: 'center' }}>&#9679;</div>
                    <div style={{ fontSize: '7.5px', color: '#2a5a2a', letterSpacing: '0.05em' }}>{name}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '7px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '1rem' }}>
                {earnedBadges.length}/{badges.length} EARNED &nbsp;·&nbsp; {earnedBadges.reduce((s, b) => s + b.xp_reward, 0)} BONUS XP
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                {badges.map(badge => (
                  <div key={badge.slug} style={{
                    background: badge.earned ? '#030a03' : '#020602',
                    border: '1px solid ' + (badge.earned ? badge.color + '35' : '#0a140a'),
                    borderRadius: '8px', padding: '16px 14px',
                    opacity: badge.earned ? 1 : 0.4,
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}>
                    {badge.earned && (
                      <div style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', borderRadius: '50%', background: badge.color, boxShadow: '0 0 6px ' + badge.color }} />
                    )}
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px', lineHeight: 1 }}>{badge.icon}</div>
                    <div style={{ fontSize: '9px', color: badge.earned ? badge.color : '#2a4a2a', fontWeight: 700, marginBottom: '4px', letterSpacing: '0.05em' }}>{badge.name}</div>
                    <div style={{ fontSize: '7px', color: '#3a6a3a', lineHeight: 1.5, marginBottom: '8px' }}>{badge.description}</div>
                    <div style={{ fontSize: '7px', color: badge.earned ? '#ffb347' : '#1a3a1a' }}>
                      {badge.earned
                        ? '&#10003; +' + badge.xp_reward + ' XP earned'
                        : '+' + badge.xp_reward + ' XP · ' + badge.requirement_type.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── LAB HISTORY tab ── */}
      {activeTab === 'history' && (
        <div>
          <div style={{ fontSize: '7px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '1rem' }}>
            COMPLETED LAB LOG &nbsp;·&nbsp; {labStats.length} ENTRIES
          </div>
          {labStats.length === 0 ? (
            <div style={{ background: '#030a03', border: '1px solid #0d1f0d', borderRadius: '8px', padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: '#3a6a3a', marginBottom: '0.5rem' }}>NO LAB HISTORY YET</div>
              <div style={{ fontSize: '0.72rem', color: '#2a5a2a', marginBottom: '1.5rem' }}>Complete your first lab to start tracking progress.</div>
              <Link href="/" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.78rem', color: '#00ff41', padding: '10px 24px', border: '1px solid rgba(0,255,65,0.4)', borderRadius: '5px', background: 'rgba(0,255,65,0.07)' }}>
                START A MODULE &#8594;
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[...labStats].sort((a, b) => {
                if (!a.completed_at) return 1
                if (!b.completed_at) return -1
                return new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
              }).map((lab, i) => {
                const mod = ALL_MODULES.find(m => m.id === lab.module_id || m.labId === lab.lab_id)
                const color = mod?.color || '#00ff41'
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#030a03', border: '1px solid #0d1f0d', borderRadius: '6px', padding: '10px 16px' }}>
                    <div style={{ width: '3px', height: '28px', background: color, borderRadius: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '9px', color: '#c8d8c8', marginBottom: '2px' }}>{lab.lab_id.toUpperCase()}</div>
                      <div style={{ fontSize: '7px', color: '#3a6a3a' }}>
                        {mod?.label || lab.module_id}
                        {lab.completed_at && <span style={{ color: '#2a5a2a' }}> &nbsp;·&nbsp; {new Date(lab.completed_at).toLocaleString()}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '10px', color: '#ffb347', fontWeight: 700 }}>+{lab.xp_earned} XP</div>
                      {mod && (
                        <Link href={mod.href + '/lab'} style={{ textDecoration: 'none', fontSize: '6.5px', color: color + '88', letterSpacing: '0.08em' }}>
                          REVISIT &#8594;
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #0d1f0d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={handleCopyUID} style={{
            background: 'transparent', border: '1px solid #1a3a1a', borderRadius: '4px',
            padding: '5px 12px', cursor: 'pointer', fontFamily: mono, fontSize: '7px',
            color: copyDone ? '#00ff41' : '#3a6a3a', letterSpacing: '0.1em', transition: 'all 0.15s',
          }}>
            {copyDone ? '✓ COPIED' : 'COPY UID'}
          </button>
        </div>
        <button onClick={signOut} style={{
          background: 'transparent', border: '1px solid rgba(255,65,54,0.35)', borderRadius: '4px',
          padding: '7px 18px', cursor: 'pointer', fontFamily: mono,
          fontSize: '8px', color: '#ff4136', letterSpacing: '0.12em', transition: 'all 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,65,54,0.08)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        >
          &#8651; SIGN OUT
        </button>
      </div>

    </div>
  )
}

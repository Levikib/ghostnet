'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthProvider'
import { supabase, getRank, RANK_COLORS, RANK_THRESHOLDS } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

interface BadgeWithStatus {
  slug: string
  name: string
  description: string
  icon: string
  color: string
  xp_reward: number
  earned: boolean
  earned_at?: string
}

interface LabStat {
  lab_id: string
  module_id: string
  xp_earned: number
  completed_at?: string
}

const MODULE_LABELS: Record<string, string> = {
  '01': 'Tor & Dark Web', '02': 'OSINT & Surveillance', '03': 'Crypto & Blockchain',
  '04': 'Offensive Security', '05': 'Active Directory', '06': 'Web Attacks',
  '07': 'Malware Analysis', '08': 'Network Attacks', '09': 'Cloud Security',
  '10': 'Social Engineering', '11': 'Red Team Ops', '12': 'Wireless Attacks', '13': 'Mobile Security',
}

const MODULE_COLORS: Record<string, string> = {
  '01': '#00ff41', '02': '#00d4ff', '03': '#ffb347', '04': '#bf5fff', '05': '#ff4136',
  '06': '#00d4ff', '07': '#00ff41', '08': '#00ffff', '09': '#ff9500', '10': '#ff6ec7',
  '11': '#ff3333', '12': '#aaff00', '13': '#7c4dff',
}

export default function ProfilePage() {
  const { user, profile, signOut, isSupabaseConfigured, loading } = useAuth()
  const router = useRouter()
  const [badges, setBadges] = useState<BadgeWithStatus[]>([])
  const [labStats, setLabStats] = useState<LabStat[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'labs'>('overview')

  useEffect(() => {
    if (!loading && !user) router.push('/auth')
  }, [user, loading, router])

  useEffect(() => {
    if (!user || !isSupabaseConfigured) { setDataLoading(false); return }

    async function loadData() {
      try {
        // Fetch all badges + user's earned badges
        const [{ data: allBadges }, { data: userBadges }, { data: labProgress }] = await Promise.all([
          supabase.from('badges').select('*').order('requirement_value'),
          supabase.from('user_badges').select('badge_id, earned_at').eq('user_id', user!.id),
          supabase.from('lab_progress').select('*').eq('user_id', user!.id).eq('completed', true),
        ])

        const earnedIds = new Set((userBadges || []).map((b: { badge_id: string; earned_at: string }) => b.badge_id))
        const earnedMap = Object.fromEntries((userBadges || []).map((b: { badge_id: string; earned_at: string }) => [b.badge_id, b.earned_at]))

        setBadges((allBadges || []).map((b: { id: string; slug: string; name: string; description: string; icon: string; color: string; xp_reward: number }) => ({
          ...b,
          earned: earnedIds.has(b.id),
          earned_at: earnedMap[b.id],
        })))

        setLabStats(labProgress || [])
      } catch (e) {
        // Silently fail if Supabase not yet configured
      } finally {
        setDataLoading(false)
      }
    }

    loadData()
  }, [user, isSupabaseConfigured])

  if (loading || !user || !profile) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', fontFamily: 'JetBrains Mono, monospace', color: '#2a5a2a', fontSize: '0.8rem' }}>
        LOADING PROFILE...
      </div>
    )
  }

  const rank = profile.ghost_rank
  const rankColor = RANK_COLORS[rank as keyof typeof RANK_COLORS] || '#00ff41'
  const ranks = Object.entries(RANK_THRESHOLDS) as [string, number][]
  const currentRankIdx = ranks.findIndex(([r]) => r === rank)
  const nextRank = ranks[currentRankIdx + 1]
  const prevRankXp = RANK_THRESHOLDS[rank as keyof typeof RANK_THRESHOLDS]
  const nextRankXp = nextRank ? nextRank[1] : null
  const progressPct = nextRankXp
    ? Math.min(100, Math.round(((profile.xp - prevRankXp) / (nextRankXp - prevRankXp)) * 100))
    : 100

  // Group lab stats by module
  const byModule = labStats.reduce((acc, s) => {
    const mod = s.module_id
    if (!acc[mod]) acc[mod] = { count: 0, xp: 0 }
    acc[mod].count++
    acc[mod].xp += s.xp_earned
    return acc
  }, {} as Record<string, { count: number; xp: number }>)

  const earnedBadges = badges.filter(b => b.earned)
  const totalXp = labStats.reduce((s, l) => s + l.xp_earned, 0)

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ background: '#030a03', border: '1px solid ' + rankColor + '22', borderRadius: '10px', padding: '2rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + rankColor + ', transparent)' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ width: '64px', height: '64px', borderRadius: '8px', border: '2px solid ' + rankColor + '44', background: rankColor + '10', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', color: rankColor, fontWeight: 700 }}>
              {profile.username[0].toUpperCase()}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', color: '#c8d8c8', margin: 0, fontWeight: 700 }}>{profile.username}</h1>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: rankColor, background: rankColor + '15', border: '1px solid ' + rankColor + '30', padding: '2px 10px', borderRadius: '3px', letterSpacing: '0.15em', fontWeight: 700 }}>
                {rank.toUpperCase()}
              </span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#3a5a3a', marginBottom: '1rem' }}>
              {profile.streak_days > 0 ? '🔥 ' + profile.streak_days + '-day streak  ·  ' : ''}
              Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>

            {/* XP bar */}
            <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: rankColor, fontWeight: 700 }}>
                {profile.xp.toLocaleString()} XP
              </span>
              {nextRank && (
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#2a5a2a' }}>
                  {(nextRankXp! - profile.xp).toLocaleString()} to {nextRank[0]}
                </span>
              )}
            </div>
            <div style={{ height: '6px', background: '#0a140a', borderRadius: '3px', border: '1px solid #1a3a1a', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: progressPct + '%', background: rankColor, borderRadius: '3px', boxShadow: '0 0 8px ' + rankColor + '88', transition: 'width 1s ease' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { label: 'LABS DONE', value: labStats.length, color: '#00ff41' },
              { label: 'BADGES', value: earnedBadges.length, color: '#ffb347' },
              { label: 'MODULES', value: Object.keys(byModule).length, color: '#00d4ff' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center', background: '#0a140a', border: '1px solid #1a3a1a', borderRadius: '6px', padding: '12px 16px' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', color: stat.color, fontWeight: 700, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '6.5px', color: '#2a4a2a', letterSpacing: '0.15em', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: '#0a140a', borderRadius: '8px', padding: '4px' }}>
        {(['overview', 'badges', 'labs'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: '8px', borderRadius: '5px', cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.12em',
            border: 'none',
            background: activeTab === tab ? 'rgba(0,255,65,0.1)' : 'transparent',
            color: activeTab === tab ? '#00ff41' : '#2a5a2a',
            fontWeight: activeTab === tab ? 700 : 400,
          }}>
            {tab === 'overview' ? '◈ OVERVIEW' : tab === 'badges' ? '⚡ BADGES' : '⌂ LAB HISTORY'}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '1rem' }}>MODULE PROGRESS</div>
          {Object.keys(byModule).length === 0 ? (
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#2a4a2a', padding: '2rem', textAlign: 'center', border: '1px solid #0d1f0d', borderRadius: '8px' }}>
              No labs completed yet. <a href="/" style={{ color: '#00ff41', textDecoration: 'none' }}>Pick a module →</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(byModule).map(([mod, stats]) => {
                const modNum = mod.replace('mod-', '').replace('MOD-', '')
                const color = MODULE_COLORS[modNum] || '#00ff41'
                const label = MODULE_LABELS[modNum] || mod
                return (
                  <div key={mod} style={{ background: '#030a03', border: '1px solid ' + color + '18', borderRadius: '6px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '4px', height: '36px', background: color, borderRadius: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, fontWeight: 600, marginBottom: '2px' }}>{label}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#2a5a2a' }}>{stats.count} lab{stats.count !== 1 ? 's' : ''} completed</div>
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color, fontWeight: 700 }}>+{stats.xp.toLocaleString()} XP</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Badges tab */}
      {activeTab === 'badges' && (
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '1rem' }}>
            {earnedBadges.length}/{badges.length} BADGES EARNED
          </div>
          {dataLoading ? (
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#2a5a2a', padding: '2rem', textAlign: 'center' }}>Loading badges...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {badges.map(badge => (
                <div key={badge.slug} style={{
                  background: badge.earned ? '#030a03' : '#020602',
                  border: '1px solid ' + (badge.earned ? badge.color + '30' : '#0a140a'),
                  borderRadius: '8px', padding: '14px',
                  opacity: badge.earned ? 1 : 0.45,
                  transition: 'all 0.2s',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{badge.icon}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: badge.earned ? badge.color : '#2a4a2a', fontWeight: 700, marginBottom: '4px', letterSpacing: '0.05em' }}>{badge.name}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#2a5a2a', lineHeight: 1.5, marginBottom: '8px' }}>{badge.description}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: badge.earned ? '#ffb347' : '#1a3a1a' }}>
                    {badge.earned ? '✓ +' + badge.xp_reward + ' XP  ·  ' + new Date(badge.earned_at!).toLocaleDateString() : '+' + badge.xp_reward + ' XP on completion'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lab history tab */}
      {activeTab === 'labs' && (
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '1rem' }}>COMPLETED LAB LOG</div>
          {labStats.length === 0 ? (
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#2a4a2a', padding: '2rem', textAlign: 'center', border: '1px solid #0d1f0d', borderRadius: '8px' }}>
              No labs completed yet. <a href="/" style={{ color: '#00ff41', textDecoration: 'none' }}>Start your first lab →</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[...labStats].reverse().map((lab, i) => {
                const modNum = lab.module_id.replace(/\D/g, '').padStart(2, '0')
                const color = MODULE_COLORS[modNum] || '#00ff41'
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#030a03', border: '1px solid #0d1f0d', borderRadius: '5px', padding: '10px 14px' }}>
                    <div style={{ width: '3px', height: '24px', background: color, borderRadius: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#c8d8c8' }}>{lab.lab_id}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#2a5a2a', marginTop: '2px' }}>
                        {lab.completed_at ? new Date(lab.completed_at).toLocaleString() : 'Date unknown'}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#ffb347', fontWeight: 700 }}>+{lab.xp_earned} XP</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Sign out */}
      <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #0d1f0d', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={signOut} style={{
          background: 'transparent', border: '1px solid rgba(255,65,54,0.2)', borderRadius: '4px',
          padding: '7px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
          fontSize: '8px', color: '#3a2020', letterSpacing: '0.12em', transition: 'all 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,65,54,0.5)'; (e.currentTarget as HTMLElement).style.color = '#ff4136' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,65,54,0.2)'; (e.currentTarget as HTMLElement).style.color = '#3a2020' }}
        >
          ⎋ SIGN OUT
        </button>
      </div>
    </div>
  )
}

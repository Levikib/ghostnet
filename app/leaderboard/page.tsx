'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '../../lib/supabase/client'
import { RANK_LIST } from '../../lib/supabase'

const accent = '#00d4ff'
const mono = 'JetBrains Mono, monospace'

// Admin email — only this account sees the admin panel
const ADMIN_EMAIL = 'shanghost@ghostnet.io'

const MOD_COLORS: Record<string, string> = {
  'tor': '#00ff41', 'osint': '#00d4ff', 'crypto': '#ffb347',
  'offensive': '#bf5fff', 'active-directory': '#ff4136', 'web-attacks': '#00d4ff',
  'malware': '#00ff41', 'network-attacks': '#00ffff', 'cloud-security': '#ff9500',
  'social-engineering': '#ff6ec7', 'red-team': '#ff3333', 'wireless-attacks': '#aaff00',
  'mobile-security': '#7c4dff',
}

const MOD_LABELS: Record<string, string> = {
  'tor': 'Tor', 'osint': 'OSINT', 'crypto': 'Crypto',
  'offensive': 'Offensive', 'active-directory': 'Active Directory', 'web-attacks': 'Web Attacks',
  'malware': 'Malware', 'network-attacks': 'Network', 'cloud-security': 'Cloud',
  'social-engineering': 'Social Eng', 'red-team': 'Red Team', 'wireless-attacks': 'Wireless',
  'mobile-security': 'Mobile',
}

const LAB_IDS = [
  'tor-lab', 'osint-lab', 'crypto-lab', 'offensive-lab', 'active-directory-lab',
  'web-attacks-lab', 'malware-analysis-lab', 'network-attacks-lab', 'cloud-security-lab',
  'social-engineering-lab', 'red-team-lab', 'wireless-attacks-lab', 'mobile-security-lab',
]

function getRank(xp: number) {
  return [...RANK_LIST].reverse().find(r => xp >= r.minXp) || RANK_LIST[0]
}

interface Operator {
  id: string
  username: string
  email: string
  xp: number
  labs_completed: number
  last_active: string | null
  created_at: string
}

interface AdminUser extends Operator {
  rank: number
  rankTitle: string
  rankColor: string
  labDetails?: { lab_id: string; completed_at: string; xp_earned: number }[]
}

export default function LeaderboardPage() {
  const [operators, setOperators] = useState<AdminUser[]>([])
  const [myProfile, setMyProfile] = useState<{ xp: number; username: string; id: string; email: string } | null>(null)
  const [myRank, setMyRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'global' | 'admin'>('global')
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminExpanded, setAdminExpanded] = useState<string | null>(null)
  const [adminLabData, setAdminLabData] = useState<Record<string, AdminUser['labDetails']>>({})
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalLabsCompleted, setTotalLabsCompleted] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    const supabase = createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || ADMIN_EMAIL).split(',').map(e => e.trim())
      setIsAdmin(adminEmails.includes(user.email || ''))

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id, username, xp, email')
        .eq('id', user.id)
        .single()
      if (profile) {
        setMyProfile({ ...profile, email: user.email || profile.email || '' })
      }
    }

    // Fetch leaderboard — top 50
    const { data: board } = await supabase
      .from('user_profiles')
      .select('id, username, email, xp, labs_completed, last_active, created_at')
      .order('xp', { ascending: false })
      .limit(50)

    if (board) {
      const ranked = board.map((op, i) => {
        const r = getRank(op.xp || 0)
        return {
          ...op,
          xp: op.xp || 0,
          labs_completed: op.labs_completed || 0,
          rank: i + 1,
          rankTitle: r.title,
          rankColor: r.color,
        }
      })
      setOperators(ranked)
      setTotalUsers(board.length)

      // Find my rank position
      if (user) {
        const myPos = ranked.findIndex(o => o.id === user.id)
        setMyRank(myPos >= 0 ? myPos + 1 : null)
      }
    }

    // Aggregate stats
    const { count: labCount } = await supabase
      .from('lab_progress')
      .select('*', { count: 'exact', head: true })
      .eq('completed', true)
    setTotalLabsCompleted(labCount || 0)
    setLastUpdated(new Date())
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
    // Live refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Subscribe to realtime user_profiles changes
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('leaderboard_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, () => {
        fetchData()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lab_progress' }, () => {
        fetchData()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchData])

  async function loadAdminLabData(userId: string) {
    if (adminLabData[userId]) {
      setAdminExpanded(adminExpanded === userId ? null : userId)
      return
    }
    const supabase = createClient()
    const { data } = await supabase
      .from('lab_progress')
      .select('lab_id, completed_at, xp_earned')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
    setAdminLabData(prev => ({ ...prev, [userId]: data || [] }))
    setAdminExpanded(userId)
  }

  const top3Colors = ['#ff9500', '#c0c8c0', '#cd7f32']

  const myOperator = myProfile ? operators.find(o => o.id === myProfile.id) : null

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: mono, fontSize: '0.7rem', color: '#006a7a' }}>
        <Link href="/" style={{ color: '#006a7a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <span style={{ color: accent }}>LEADERBOARD</span>
        {lastUpdated && (
          <span style={{ marginLeft: 'auto', color: '#1a4a4a', fontSize: '0.6rem' }}>
            LIVE · updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#006a7a', letterSpacing: '0.22em', marginBottom: '5px' }}>OPERATOR RANKINGS</div>
          <h1 style={{ fontFamily: mono, fontSize: '1.8rem', fontWeight: 700, color: accent, margin: 0, textShadow: '0 0 30px rgba(0,212,255,0.2)' }}>Leaderboard</h1>
        </div>
        {/* Platform stats */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {[
            { label: 'OPERATORS', val: totalUsers },
            { label: 'LABS DONE', val: totalLabsCompleted },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: mono, fontSize: '1.2rem', fontWeight: 700, color: accent }}>{s.val}</div>
              <div style={{ fontFamily: mono, fontSize: '0.55rem', color: '#1a4a5a', letterSpacing: '0.18em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* My stats */}
      {myProfile && myOperator && (
        <div style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', padding: '14px 20px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#006a7a', letterSpacing: '0.18em', flexShrink: 0 }}>YOU</div>
          <div style={{ fontFamily: mono, fontSize: '0.85rem', color: accent, fontWeight: 700 }}>#{myRank}</div>
          <div style={{ fontFamily: mono, fontSize: '0.85rem', color: '#c0e0e0', fontWeight: 600 }}>{myOperator.username}</div>
          <div style={{ display: 'flex', gap: '20px', flex: 1, flexWrap: 'wrap' }}>
            <div><div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#1a4a5a', marginBottom: '1px' }}>XP</div><div style={{ fontFamily: mono, fontSize: '0.9rem', fontWeight: 700, color: accent }}>{myOperator.xp.toLocaleString()}</div></div>
            <div><div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#1a4a5a', marginBottom: '1px' }}>RANK</div><div style={{ fontFamily: mono, fontSize: '0.75rem', fontWeight: 700, color: myOperator.rankColor }}>{myOperator.rankTitle.toUpperCase()}</div></div>
            <div><div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#1a4a5a', marginBottom: '1px' }}>LABS</div><div style={{ fontFamily: mono, fontSize: '0.9rem', fontWeight: 700, color: '#00ff41' }}>{myOperator.labs_completed}</div></div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem' }}>
        {(['global', ...(isAdmin ? ['admin'] : [])] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            style={{
              background: tab === t ? 'rgba(0,212,255,0.1)' : 'transparent',
              border: '1px solid ' + (tab === t ? 'rgba(0,212,255,0.4)' : '#1a2e2e'),
              borderRadius: '4px', padding: '5px 16px', cursor: 'pointer',
              fontFamily: mono, fontSize: '0.68rem', letterSpacing: '0.12em',
              color: tab === t ? accent : '#2a5a6a',
            }}
          >
            {t === 'global' ? 'GLOBAL RANKINGS' : '⚙ ADMIN PANEL'}
          </button>
        ))}
        <button
          onClick={fetchData}
          style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid #1a2e2e', borderRadius: '4px', padding: '5px 12px', cursor: 'pointer', fontFamily: mono, fontSize: '0.62rem', color: '#1a4a5a', letterSpacing: '0.1em' }}
        >
          ↻ REFRESH
        </button>
      </div>

      {loading ? (
        <div style={{ fontFamily: mono, fontSize: '0.75rem', color: '#1a4a5a', padding: '3rem 0', textAlign: 'center', letterSpacing: '0.2em' }}>
          LOADING OPERATOR DATA...
        </div>
      ) : (

        <>
          {/* ── GLOBAL LEADERBOARD ── */}
          {tab === 'global' && (
            <div>
              {/* Column headers */}
              <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 100px 70px 80px 120px', gap: '8px', padding: '6px 14px', fontFamily: mono, fontSize: '0.58rem', color: '#1a4a5a', letterSpacing: '0.14em', borderBottom: '1px solid #0a1e1e', marginBottom: '4px' }}>
                <div>#</div><div>OPERATOR</div>
                <div style={{ textAlign: 'right' }}>XP</div>
                <div style={{ textAlign: 'right' }}>LABS</div>
                <div style={{ textAlign: 'right' }}>LAST ACTIVE</div>
                <div style={{ textAlign: 'right' }}>RANK</div>
              </div>

              {operators.length === 0 && (
                <div style={{ fontFamily: mono, fontSize: '0.72rem', color: '#1a4a5a', padding: '2rem 14px', textAlign: 'center' }}>
                  No operators yet. Be the first.
                </div>
              )}

              {operators.map((op, i) => {
                const isMe = myProfile?.id === op.id
                const isTop3 = i < 3
                const posColor = isTop3 ? top3Colors[i] : (isMe ? accent : '#2a5a6a')
                const lastActive = op.last_active
                  ? new Date(op.last_active).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                  : '—'

                return (
                  <div
                    key={op.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '44px 1fr 100px 70px 80px 120px',
                      gap: '8px',
                      padding: '10px 14px',
                      fontFamily: mono,
                      background: isMe
                        ? 'rgba(0,212,255,0.05)'
                        : i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                      borderRadius: '4px',
                      alignItems: 'center',
                      borderLeft: isTop3 ? '2px solid ' + top3Colors[i] : isMe ? '2px solid ' + accent : '2px solid transparent',
                      marginBottom: '2px',
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: posColor }}>
                      {i === 0 ? '◈' : i === 1 ? 'II' : i === 2 ? 'III' : op.rank}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.82rem', color: isMe ? accent : '#b0c8c8', fontWeight: isMe ? 700 : 500 }}>
                        {op.username}
                      </span>
                      {isMe && <span style={{ fontSize: '0.55rem', color: accent, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: '3px', padding: '1px 5px', letterSpacing: '0.1em' }}>YOU</span>}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: accent, textAlign: 'right', fontWeight: 600 }}>{op.xp.toLocaleString()}</div>
                    <div style={{ fontSize: '0.78rem', color: '#00ff41', textAlign: 'right' }}>{op.labs_completed}</div>
                    <div style={{ fontSize: '0.65rem', color: '#2a5a6a', textAlign: 'right' }}>{lastActive}</div>
                    <div style={{ fontSize: '0.62rem', color: op.rankColor, textAlign: 'right', letterSpacing: '0.06em', fontWeight: 600 }}>{op.rankTitle.toUpperCase()}</div>
                  </div>
                )
              })}

              <div style={{ marginTop: '1.5rem', padding: '10px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid #0a1e2e', borderRadius: '6px', fontFamily: mono, fontSize: '0.68rem', color: '#1a4a5a', lineHeight: 1.8 }}>
                Leaderboard updates in real-time. Complete labs to earn XP and climb the board.
                {!myProfile && (
                  <> <Link href="/auth" style={{ color: accent, textDecoration: 'none' }}>Sign in</Link> to appear on the global board.</>
                )}
              </div>
            </div>
          )}

          {/* ── ADMIN PANEL ── */}
          {tab === 'admin' && isAdmin && (
            <div>
              {/* Admin stats bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
                {[
                  { label: 'TOTAL OPERATORS', val: totalUsers, color: accent },
                  { label: 'LABS COMPLETED', val: totalLabsCompleted, color: '#00ff41' },
                  { label: 'AVG XP', val: operators.length ? Math.round(operators.reduce((s, o) => s + o.xp, 0) / operators.length).toLocaleString() : '0', color: '#ffb347' },
                  { label: 'TOP RANK', val: operators[0]?.rankTitle?.toUpperCase() || '—', color: '#ff4136' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #0a1e1e', borderRadius: '6px', padding: '12px 16px' }}>
                    <div style={{ fontFamily: mono, fontSize: '1.1rem', fontWeight: 700, color: s.color }}>{s.val}</div>
                    <div style={{ fontFamily: mono, fontSize: '0.55rem', color: '#1a3a3a', letterSpacing: '0.15em', marginTop: '2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* All users table */}
              <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#1a4a5a', letterSpacing: '0.18em', marginBottom: '10px' }}>
                ALL OPERATORS ({operators.length}) — CLICK ROW TO EXPAND LAB HISTORY
              </div>

              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 160px 80px 70px 80px 120px', gap: '8px', padding: '6px 12px', fontFamily: mono, fontSize: '0.56rem', color: '#1a4a5a', letterSpacing: '0.12em', borderBottom: '1px solid #0a1e1e', marginBottom: '4px' }}>
                <div>#</div><div>OPERATOR</div><div>EMAIL</div>
                <div style={{ textAlign: 'right' }}>XP</div>
                <div style={{ textAlign: 'right' }}>LABS</div>
                <div style={{ textAlign: 'right' }}>JOINED</div>
                <div style={{ textAlign: 'right' }}>LAST SEEN</div>
              </div>

              {operators.map((op, i) => (
                <div key={op.id}>
                  <div
                    onClick={() => loadAdminLabData(op.id)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '36px 1fr 160px 80px 70px 80px 120px',
                      gap: '8px',
                      padding: '9px 12px',
                      fontFamily: mono,
                      background: adminExpanded === op.id ? 'rgba(0,212,255,0.04)' : i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                      borderRadius: '4px',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderLeft: adminExpanded === op.id ? '2px solid ' + accent : '2px solid transparent',
                      marginBottom: '1px',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: '#2a5a6a' }}>{op.rank}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#b0c8c8', fontWeight: 500 }}>{op.username}</span>
                      <span style={{ fontSize: '0.6rem', color: op.rankColor, opacity: 0.8 }}>{op.rankTitle}</span>
                    </div>
                    <div className="leaderboard-col-hide" style={{ fontSize: '0.65rem', color: '#1a4a5a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{op.email}</div>
                    <div style={{ fontSize: '0.78rem', color: accent, textAlign: 'right', fontWeight: 600 }}>{op.xp.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: '#00ff41', textAlign: 'right' }}>{op.labs_completed}</div>
                    <div style={{ fontSize: '0.62rem', color: '#1a4a5a', textAlign: 'right' }}>
                      {op.created_at ? new Date(op.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: '#1a4a5a', textAlign: 'right' }}>
                      {op.last_active ? new Date(op.last_active).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'never'}
                    </div>
                  </div>

                  {/* Expanded lab history */}
                  {adminExpanded === op.id && adminLabData[op.id] && (
                    <div style={{ marginLeft: '48px', marginBottom: '8px', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid #0a1e2e', borderRadius: '6px' }}>
                      <div style={{ fontFamily: mono, fontSize: '0.58rem', color: '#1a4a5a', letterSpacing: '0.15em', marginBottom: '8px' }}>
                        LAB COMPLETION HISTORY — {op.username.toUpperCase()}
                      </div>
                      {adminLabData[op.id]!.length === 0 ? (
                        <div style={{ fontFamily: mono, fontSize: '0.68rem', color: '#1a3a3a' }}>No labs completed yet.</div>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {adminLabData[op.id]!.map(lab => {
                            const modKey = LAB_IDS.find(id => lab.lab_id === id)?.replace('-lab', '').replace('-analysis', '') || lab.lab_id
                            const color = MOD_COLORS[modKey] || '#5a7a5a'
                            const label = MOD_LABELS[modKey] || lab.lab_id
                            return (
                              <div key={lab.lab_id} style={{ fontFamily: mono, fontSize: '0.62rem', color, background: color + '15', border: '1px solid ' + color + '40', borderRadius: '3px', padding: '3px 8px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <span>{label}</span>
                                <span style={{ opacity: 0.5, fontSize: '0.55rem' }}>+{lab.xp_earned}xp</span>
                                <span style={{ opacity: 0.4, fontSize: '0.55rem' }}>
                                  {lab.completed_at ? new Date(lab.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

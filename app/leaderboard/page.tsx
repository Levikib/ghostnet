'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import OperatorAvatar from '../components/OperatorAvatar'
import { RANK_COLORS, RANK_LIST } from '../../lib/supabase'
import { api } from '../../lib/client/api'

const mono = 'JetBrains Mono, monospace'
const sans = 'DM Sans, system-ui, sans-serif'

type Row = { position: number; username: string; display_name: string; avatar_seed: string | null; avatar_color: string | null; xp: number; rank: keyof typeof RANK_COLORS; streak_days: number; labs: number; you: boolean }

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [myRank, setMyRank] = useState<number | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    api<{ operators: Row[]; myRank: number | null }>('/api/leaderboard').then(r => {
      if (r.ok === false || !r.operators) { setError(true); setRows([]); return }
      setRows(r.operators); setMyRank(r.myRank)
    })
  }, [])

  const podium = (rows || []).slice(0, 3)
  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      <div style={{ marginBottom: '22px' }}>
        <div style={{ fontFamily: mono, fontSize: '.62rem', letterSpacing: '.35em', color: '#00d4ff' }}>// GLOBAL OPERATOR RANKINGS</div>
        <h1 style={{ fontFamily: mono, fontSize: 'clamp(1.4rem, 5vw, 2rem)', color: '#eaffea', margin: '8px 0 6px', letterSpacing: '.08em' }}>LEADERBOARD</h1>
        <p style={{ fontFamily: sans, color: '#7faf8f', fontSize: '.9rem', margin: 0 }}>
          Ranked by XP from chapters and labs. {myRank ? <>You are <b style={{ color: '#00ff41' }}>#{myRank}</b>. </> : <><Link href="/auth?mode=register" style={{ color: '#00d4ff' }}>Enlist</Link> to appear here. </>}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '22px' }}>
        {RANK_LIST.map(r => <span key={r.title} style={{ fontFamily: mono, fontSize: '.6rem', letterSpacing: '.15em', padding: '5px 10px', border: '1px solid ' + r.color + '55', color: r.color }}>{r.title.toUpperCase()} {r.minXp.toLocaleString()}+</span>)}
      </div>

      {rows === null ? (
        <div style={{ fontFamily: mono, fontSize: '.7rem', letterSpacing: '.3em', color: '#2f7f4f', padding: '40px 0', textAlign: 'center' }}>QUERYING THE NETWORK…</div>
      ) : rows.length === 0 ? (
        <div style={{ fontFamily: sans, color: '#7faf8f', padding: '30px', border: '1px dashed rgba(0,255,65,.2)', textAlign: 'center' }}>{error ? 'The leaderboard is unavailable right now.' : 'No operators ranked yet. Be the first.'}</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px', marginBottom: '18px' }}>
            {podium.map(r => {
              const c = ['#ffb347', '#d8e8e8', '#cd7f32'][r.position - 1]
              return (
                <div key={r.username} style={{ padding: '18px', border: '1px solid ' + c + '55', background: 'linear-gradient(160deg, ' + c + '10, rgba(0,6,1,.9))', display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ fontFamily: mono, fontSize: '1.6rem', color: c, fontWeight: 800, width: '34px' }}>{r.position}</div>
                  <OperatorAvatar seed={r.avatar_seed || r.username} color={r.avatar_color} size={54} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: mono, fontSize: '.88rem', color: '#f0fff0', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.display_name}{r.you ? ' (you)' : ''}</div>
                    <div style={{ fontFamily: mono, fontSize: '.64rem', color: RANK_COLORS[r.rank] }}>{r.rank.toUpperCase()} · {r.xp.toLocaleString()} XP</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ border: '1px solid rgba(0,255,65,.12)' }}>
            {rows.slice(3).map(r => (
              <div key={r.username} style={{ display: 'grid', gridTemplateColumns: '40px 40px minmax(0, 1fr) auto', alignItems: 'center', gap: '12px', padding: '10px 14px', borderBottom: '1px solid rgba(0,255,65,.06)', background: r.you ? 'rgba(0,255,65,.06)' : 'transparent' }}>
                <span style={{ fontFamily: mono, fontSize: '.8rem', color: '#4f8f5f' }}>#{r.position}</span>
                <OperatorAvatar seed={r.avatar_seed || r.username} color={r.avatar_color} size={34} glow={false} />
                <span style={{ fontFamily: mono, fontSize: '.82rem', color: '#d8f0d8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.display_name}{r.you ? ' (you)' : ''} <span style={{ color: '#3f6f4f' }}>@{r.username}</span></span>
                <span style={{ fontFamily: mono, fontSize: '.7rem', color: RANK_COLORS[r.rank], whiteSpace: 'nowrap' }}>{r.xp.toLocaleString()} XP · {r.labs} labs</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

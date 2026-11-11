'use client'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { RANK_COLORS } from '../../lib/supabase'
import { api, looksSignedIn } from '../../lib/client/api'
import type { ModuleProgress } from '../../lib/learning'

/** The signed-in operator, as returned by GET /api/auth/me. */
export type Operator = {
  id: string
  email: string
  username: string
  display_name: string
  role: string
  avatar_seed: string | null
  avatar_color: string | null
  bio: string | null
  country: string | null
  skill_level: string | null
  interests: string[]
  goal: string | null
  is_public: boolean
  onboarded: boolean
  two_factor: boolean
  email_verified: boolean
  created_at: string
  last_login_at: string | null
  xp: number
  ghost_rank: 'Ghost' | 'Specter' | 'Phantom' | 'Wraith' | 'Legend'
  next_rank: { title: string; minXp: number; color: string } | null
  streak_days: number
  modules: ModuleProgress[]
  overall_percent: number
  labs_completed: number
  chapters_read: number
  recent: { kind: string; module_id: string | null; ref: string | null; xp: number; created_at: string }[]
}

interface AuthContextType {
  /** Minimal identity (kept for older components). */
  user: { id: string; email: string } | null
  /** Full operator profile with progress. */
  profile: Operator | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  setProfile: (p: Operator | null) => void
  /** Always true now; kept so older components keep compiling. */
  isSupabaseConfigured: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  setProfile: () => {},
  isSupabaseConfigured: true,
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Operator | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    if (!looksSignedIn()) { setProfile(null); setLoading(false); return }
    const r = await api<{ user: Operator | null }>('/api/auth/me')
    setProfile(r.user ?? null)
    setLoading(false)
  }, [])

  useEffect(() => { refreshProfile() }, [refreshProfile])

  // Labs, chapters and the auth pages fire this after anything that changes the profile.
  useEffect(() => {
    const on = () => { refreshProfile() }
    window.addEventListener('ghostnet_profile_refresh', on)
    window.addEventListener('ghostnet_auth_changed', on)
    return () => {
      window.removeEventListener('ghostnet_profile_refresh', on)
      window.removeEventListener('ghostnet_auth_changed', on)
    }
  }, [refreshProfile])

  const signOut = useCallback(async () => {
    await api('/api/auth/logout', {})
    setProfile(null)
    window.dispatchEvent(new Event('ghostnet_auth_changed'))
    window.location.href = '/welcome'
  }, [])

  const user = profile ? { id: profile.id, email: profile.email } : null

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile, setProfile, isSupabaseConfigured: true }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────
// NavUserBadge — rank pill in the nav
// ─────────────────────────────────────────────────────────────────
export function NavUserBadge() {
  const { profile, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const mono = 'JetBrains Mono, monospace'

  if (!profile) {
    return (
      <a href="/auth" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '8px', letterSpacing: '0.1em', padding: '4px 10px', borderRadius: '4px', color: '#00ff41', border: '1px solid rgba(0,255,65,0.3)', background: 'rgba(0,255,65,0.05)', flexShrink: 0 }}>
        ⎋ LOGIN
      </a>
    )
  }

  const rank = profile.ghost_rank
  const rankColor = RANK_COLORS[rank] || '#00ff41'

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button onClick={() => setMenuOpen(o => !o)} aria-expanded={menuOpen} aria-label="Account menu"
        style={{ background: 'transparent', border: '1px solid ' + rankColor + '44', borderRadius: '4px', cursor: 'pointer', padding: '3px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: rankColor, boxShadow: '0 0 6px ' + rankColor }} />
        <span style={{ fontFamily: mono, fontSize: '7.5px', color: rankColor, letterSpacing: '0.1em', fontWeight: 600 }}>{profile.username.toUpperCase().slice(0, 12)}</span>
        <span style={{ fontFamily: mono, fontSize: '6.5px', color: rankColor + 'aa', letterSpacing: '0.08em' }}>{profile.xp.toLocaleString()} XP</span>
      </button>
      {menuOpen && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#040d04', border: '1px solid #1a3a1a', borderRadius: '8px', zIndex: 300, minWidth: '170px', boxShadow: '0 20px 50px rgba(0,0,0,0.85)', padding: '8px' }}>
          <div style={{ padding: '6px 10px 8px', borderBottom: '1px solid #0d1f0d', marginBottom: '4px' }}>
            <div style={{ fontFamily: mono, fontSize: '8px', color: rankColor, fontWeight: 700 }}>{rank.toUpperCase()}</div>
            <div style={{ fontFamily: mono, fontSize: '7px', color: '#5a8a5a', marginTop: '2px' }}>{profile.xp.toLocaleString()} XP · {profile.streak_days}d streak · {profile.overall_percent}% overall</div>
          </div>
          <a href="/profile" onClick={() => setMenuOpen(false)} style={{ display: 'block', textDecoration: 'none', fontFamily: mono, fontSize: '8px', color: '#00ff41', padding: '6px 10px', borderRadius: '3px', letterSpacing: '0.08em' }}>◈ MY PROFILE</a>
          <a href="/profile#security" onClick={() => setMenuOpen(false)} style={{ display: 'block', textDecoration: 'none', fontFamily: mono, fontSize: '8px', color: '#00d4ff', padding: '6px 10px', borderRadius: '3px', letterSpacing: '0.08em' }}>⛨ SECURITY</a>
          <button onClick={() => { setMenuOpen(false); signOut() }} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', fontFamily: mono, fontSize: '8px', color: '#ff4136', padding: '6px 10px', borderRadius: '3px', cursor: 'pointer', letterSpacing: '0.08em' }}>⎋ SIGN OUT</button>
        </div>
      )}
    </div>
  )
}

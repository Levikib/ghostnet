'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, UserProfile, getRank, RANK_COLORS } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  isSupabaseConfigured: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
  isSupabaseConfigured: false,
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const isSupabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== '' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url_here'
  )

  async function fetchProfile(userId: string) {
    if (!isSupabaseConfigured) return
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (!error && data) {
        setProfile(data as UserProfile)
      }
    } catch {
      // Supabase might not be set up yet — silently fail
    }
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id)
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [isSupabaseConfigured])

  // Listen for lab-completion events to refresh profile immediately
  useEffect(() => {
    const onRefresh = () => {
      if (user) fetchProfile(user.id)
    }
    window.addEventListener('ghostnet_profile_refresh', onRefresh)
    return () => window.removeEventListener('ghostnet_profile_refresh', onRefresh)
  }, [user])

  async function signIn(email: string, password: string) {
    if (!isSupabaseConfigured) return { error: 'Supabase not configured' }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error?.message || null }
    } catch (e) {
      return { error: 'Sign in failed' }
    }
  }

  async function signUp(email: string, password: string, username: string) {
    if (!isSupabaseConfigured) return { error: 'Supabase not configured' }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      })
      return { error: error?.message || null }
    } catch (e) {
      return { error: 'Sign up failed' }
    }
  }

  async function signOut() {
    if (!isSupabaseConfigured) return
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile, isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────
// UserBadge — small rank pill shown in nav
// ─────────────────────────────────────────────────────────────────
export function NavUserBadge() {
  const { user, profile, signOut, isSupabaseConfigured } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!isSupabaseConfigured) return null

  if (!user || !profile) {
    return (
      <a href="/auth" style={{
        textDecoration: 'none',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '8px',
        letterSpacing: '0.1em',
        padding: '4px 10px',
        borderRadius: '4px',
        color: '#00ff41',
        border: '1px solid rgba(0,255,65,0.3)',
        background: 'rgba(0,255,65,0.05)',
        flexShrink: 0,
        cursor: 'pointer',
      }}>
        ⎋ LOGIN
      </a>
    )
  }

  const rank = profile.ghost_rank
  const rankColor = RANK_COLORS[rank as keyof typeof RANK_COLORS] || '#00ff41'

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setMenuOpen(o => !o)}
        style={{
          background: 'transparent',
          border: '1px solid ' + rankColor + '44',
          borderRadius: '4px',
          cursor: 'pointer',
          padding: '3px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: rankColor, boxShadow: '0 0 6px ' + rankColor }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: rankColor, letterSpacing: '0.1em', fontWeight: 600 }}>
          {profile.username.toUpperCase().slice(0, 12)}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '6.5px', color: rankColor + 'aa', letterSpacing: '0.08em' }}>
          {profile.xp.toLocaleString()} XP
        </span>
      </button>

      {menuOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: '#040d04', border: '1px solid #1a3a1a',
          borderRadius: '8px', zIndex: 300, minWidth: '160px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.85)', padding: '8px',
        }}>
          <div style={{ padding: '6px 10px 8px', borderBottom: '1px solid #0d1f0d', marginBottom: '4px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: rankColor, fontWeight: 700 }}>{rank.toUpperCase()}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#5a8a5a', marginTop: '2px' }}>{profile.xp.toLocaleString()} XP · {profile.streak_days}d streak</div>
          </div>
          <a href="/profile" onClick={() => setMenuOpen(false)} style={{ display: 'block', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#00ff41', padding: '5px 10px', borderRadius: '3px', letterSpacing: '0.08em' }}>
            ◈ MY PROFILE
          </a>
          <button onClick={() => { signOut(); setMenuOpen(false) }} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#ff4136', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', letterSpacing: '0.08em' }}>
            ⎋ SIGN OUT
          </button>
        </div>
      )}
    </div>
  )
}

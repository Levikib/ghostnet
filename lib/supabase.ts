'use client'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Browser client — used in components
// When env vars are missing the client is created but all calls will fail gracefully
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Type definitions matching the Supabase schema
export interface UserProfile {
  id: string
  username: string
  email: string
  avatar_url?: string
  ghost_rank: 'Ghost' | 'Specter' | 'Phantom' | 'Wraith' | 'Legend'
  xp: number
  streak_days: number
  last_active: string
  created_at: string
  is_public: boolean
}

export interface LabProgress {
  id: string
  user_id: string
  lab_id: string
  module_id: string
  completed: boolean
  xp_earned: number
  completed_at?: string
  attempts: number
  notes?: string
}

export interface Badge {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
  xp_reward: number
  requirement_type: 'labs_completed' | 'module_mastery' | 'streak' | 'total_xp' | 'special'
  requirement_value: number
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  badge?: Badge
}

export interface GhostMemory {
  id: string
  user_id: string
  memory_type: 'skill_level' | 'completed_topic' | 'struggle_area' | 'preference'
  key: string
  value: string
  updated_at: string
}

// XP thresholds per rank
export const RANK_THRESHOLDS = {
  Ghost: 0,
  Specter: 1000,
  Phantom: 3000,
  Wraith: 7500,
  Legend: 15000,
} as const

// Ordered rank list for UI rendering
export const RANK_LIST = [
  { title: 'Ghost',   minXp: 0,     color: '#4a9a4a' },
  { title: 'Specter', minXp: 1000,  color: '#00d4ff' },
  { title: 'Phantom', minXp: 3000,  color: '#bf5fff' },
  { title: 'Wraith',  minXp: 7500,  color: '#ff4136' },
  { title: 'Legend',  minXp: 15000, color: '#ffb347' },
] as const

export function getNextRankInfo(xp: number): { title: string; minXp: number; color: string } | null {
  return RANK_LIST.find(r => xp < r.minXp) || null
}

export type GhostRank = keyof typeof RANK_THRESHOLDS

export function getRank(xp: number): GhostRank {
  if (xp >= 15000) return 'Legend'
  if (xp >= 7500) return 'Wraith'
  if (xp >= 3000) return 'Phantom'
  if (xp >= 1000) return 'Specter'
  return 'Ghost'
}

export const RANK_COLORS: Record<GhostRank, string> = {
  Ghost:   '#4a9a4a',
  Specter: '#00d4ff',
  Phantom: '#bf5fff',
  Wraith:  '#ff4136',
  Legend:  '#ffb347',
}

export const RANK_GLOWS: Record<GhostRank, string> = {
  Ghost:   '0 0 8px rgba(0,255,65,0.3)',
  Specter: '0 0 12px rgba(0,212,255,0.5)',
  Phantom: '0 0 14px rgba(191,95,255,0.5)',
  Wraith:  '0 0 16px rgba(255,65,54,0.6)',
  Legend:  '0 0 20px rgba(255,179,71,0.7)',
}

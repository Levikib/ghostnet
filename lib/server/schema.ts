import { sql } from './db'

/**
 * Self-healing schema: every statement is idempotent, and ensureSchema()
 * runs once per server instance before the first query. New columns go at
 * the end as ALTER TABLE ... ADD COLUMN IF NOT EXISTS.
 */
const STATEMENTS = [
  `CREATE EXTENSION IF NOT EXISTS citext`,
  `CREATE EXTENSION IF NOT EXISTS pgcrypto`,

  // ── Identity ──────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email citext UNIQUE NOT NULL,
    email_verified_at timestamptz,
    username citext UNIQUE NOT NULL,
    display_name text,
    password_hash text NOT NULL,
    role text NOT NULL DEFAULT 'student' CHECK (role IN ('student','instructor','admin','super_admin')),
    avatar_seed text,
    avatar_color text,
    bio text,
    country text,
    skill_level text DEFAULT 'beginner',
    interests jsonb NOT NULL DEFAULT '[]'::jsonb,
    goal text,
    is_public boolean NOT NULL DEFAULT true,
    onboarded_at timestamptz,
    totp_secret text,
    totp_pending text,
    totp_enabled_at timestamptz,
    failed_logins int NOT NULL DEFAULT 0,
    locked_until timestamptz,
    xp int NOT NULL DEFAULT 0,
    streak_days int NOT NULL DEFAULT 0,
    last_active_date date,
    last_login_at timestamptz,
    password_changed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS email_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    email citext NOT NULL,
    purpose text NOT NULL CHECK (purpose IN ('verify','reset','login')),
    code_hash text NOT NULL,
    attempts int NOT NULL DEFAULT 0,
    expires_at timestamptz NOT NULL,
    consumed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS email_codes_lookup ON email_codes (email, purpose, created_at DESC)`,

  `CREATE TABLE IF NOT EXISTS sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash text UNIQUE NOT NULL,
    ip text,
    user_agent text,
    device_label text,
    location text,
    created_at timestamptz NOT NULL DEFAULT now(),
    last_seen_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz NOT NULL,
    revoked_at timestamptz
  )`,
  `CREATE INDEX IF NOT EXISTS sessions_user ON sessions (user_id, revoked_at)`,

  `CREATE TABLE IF NOT EXISTS mfa_challenges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash text UNIQUE NOT NULL,
    attempts int NOT NULL DEFAULT 0,
    expires_at timestamptz NOT NULL,
    consumed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS backup_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code_hash text NOT NULL,
    used_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS known_devices (
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_hash text NOT NULL,
    label text,
    first_seen timestamptz NOT NULL DEFAULT now(),
    last_seen timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, device_hash)
  )`,

  `CREATE TABLE IF NOT EXISTS auth_events (
    id bigserial PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    email citext,
    type text NOT NULL,
    ip text,
    user_agent text,
    location text,
    meta jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS auth_events_user ON auth_events (user_id, created_at DESC)`,

  `CREATE TABLE IF NOT EXISTS rate_limits (
    key text PRIMARY KEY,
    window_start timestamptz NOT NULL,
    count int NOT NULL
  )`,

  // ── Learning ──────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS module_progress (
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id text NOT NULL,
    chapters_read jsonb NOT NULL DEFAULT '[]'::jsonb,
    chapters_total int NOT NULL DEFAULT 0,
    last_chapter int NOT NULL DEFAULT 0,
    started_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, module_id)
  )`,

  `CREATE TABLE IF NOT EXISTS lab_progress (
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lab_id text NOT NULL,
    module_id text NOT NULL,
    steps_done int NOT NULL DEFAULT 0,
    steps_total int NOT NULL DEFAULT 0,
    completed boolean NOT NULL DEFAULT false,
    xp_earned int NOT NULL DEFAULT 0,
    attempts int NOT NULL DEFAULT 0,
    started_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    completed_at timestamptz,
    PRIMARY KEY (user_id, lab_id)
  )`,

  `CREATE TABLE IF NOT EXISTS activity (
    id bigserial PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind text NOT NULL,
    module_id text,
    ref text,
    xp int NOT NULL DEFAULT 0,
    meta jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS activity_user ON activity (user_id, created_at DESC)`,

  // ── Later additions (keep idempotent) ─────────────────────────
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_last_step bigint`,
]

let ready: Promise<void> | null = null

export function ensureSchema(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      for (const s of STATEMENTS) await sql(s)
    })().catch(e => {
      ready = null
      throw e
    })
  }
  return ready
}

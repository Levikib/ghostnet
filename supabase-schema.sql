-- ═══════════════════════════════════════════════════════════════════
-- GHOSTNET — Supabase Database Schema
-- Run this entire file in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────
-- TABLE: user_profiles
-- Extends Supabase auth.users with platform-specific data
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.user_profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  username      text unique not null,
  email         text not null,
  avatar_url    text,
  ghost_rank    text not null default 'Ghost'
                  check (ghost_rank in ('Ghost','Specter','Phantom','Wraith','Legend')),
  xp            integer not null default 0 check (xp >= 0),
  streak_days   integer not null default 0,
  last_active   timestamptz not null default now(),
  is_public     boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "Public profiles are visible to all"
  on public.user_profiles for select
  using (is_public = true);

-- ─────────────────────────────────────────────────────────────────
-- TABLE: lab_progress
-- Tracks per-user lab completions, XP earned, and notes
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.lab_progress (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  lab_id       text not null,
  module_id    text not null,
  completed    boolean not null default false,
  xp_earned    integer not null default 0,
  attempts     integer not null default 0,
  notes        text,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  unique(user_id, lab_id)
);

alter table public.lab_progress enable row level security;

create policy "Users manage their own lab progress"
  on public.lab_progress for all
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────
-- TABLE: badges
-- Platform badge definitions (seeded below)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.badges (
  id                  uuid default uuid_generate_v4() primary key,
  slug                text unique not null,
  name                text not null,
  description         text not null,
  icon                text not null,
  color               text not null default '#00ff41',
  xp_reward           integer not null default 0,
  requirement_type    text not null
                        check (requirement_type in (
                          'labs_completed','module_mastery','streak','total_xp','special'
                        )),
  requirement_value   integer not null default 1,
  created_at          timestamptz not null default now()
);

-- All users can read badge definitions
alter table public.badges enable row level security;
create policy "Badges are public"
  on public.badges for select to anon, authenticated
  using (true);

-- ─────────────────────────────────────────────────────────────────
-- TABLE: user_badges
-- Junction table: which users have earned which badges
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.user_badges (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  badge_id   uuid references public.badges(id) not null,
  earned_at  timestamptz not null default now(),
  unique(user_id, badge_id)
);

alter table public.user_badges enable row level security;

create policy "Users can view their own badges"
  on public.user_badges for select
  using (auth.uid() = user_id);

create policy "Users can view public badge awards"
  on public.user_badges for select
  using (true);

-- ─────────────────────────────────────────────────────────────────
-- TABLE: ghost_memory
-- Persistent AI context per user — skill level, preferences, history
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.ghost_memory (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  memory_type  text not null
                 check (memory_type in (
                   'skill_level','completed_topic','struggle_area','preference','note'
                 )),
  key          text not null,
  value        text not null,
  updated_at   timestamptz not null default now(),
  unique(user_id, memory_type, key)
);

alter table public.ghost_memory enable row level security;

create policy "Users manage their own ghost memory"
  on public.ghost_memory for all
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────
-- TABLE: lab_results
-- Stores individual lab session data (flag submissions, command logs)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.lab_results (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  lab_id        text not null,
  session_data  jsonb,
  flags_found   text[] default '{}',
  score         integer default 0,
  created_at    timestamptz not null default now()
);

alter table public.lab_results enable row level security;

create policy "Users manage their own lab results"
  on public.lab_results for all
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────
-- FUNCTION: handle_new_user
-- Automatically creates a user_profile row when auth.users is created
-- ─────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_profiles (id, username, email)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    ),
    new.email
  );
  return new;
end;
$$;

-- Trigger: fire after every new auth signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────
-- FUNCTION: update_xp_and_rank
-- Called after lab completion to add XP and recalculate rank
-- ─────────────────────────────────────────────────────────────────
create or replace function public.update_xp_and_rank(
  p_user_id uuid,
  p_xp_delta integer
)
returns void language plpgsql security definer as $$
declare
  new_xp integer;
  new_rank text;
begin
  update public.user_profiles
  set xp = xp + p_xp_delta, last_active = now()
  where id = p_user_id
  returning xp into new_xp;

  -- Recalculate rank
  -- Total earnable XP across 13 labs: ~5,450
  -- Ghost 0 | Specter 750 | Phantom 1,800 | Wraith 3,200 | Legend 5,000
  new_rank := case
    when new_xp >= 5000 then 'Legend'
    when new_xp >= 3200 then 'Wraith'
    when new_xp >= 1800 then 'Phantom'
    when new_xp >= 750  then 'Specter'
    else 'Ghost'
  end;

  update public.user_profiles
  set ghost_rank = new_rank
  where id = p_user_id;
end;
$$;

-- ─────────────────────────────────────────────────────────────────
-- SEED: badges table
-- ─────────────────────────────────────────────────────────────────
insert into public.badges (slug, name, description, icon, color, xp_reward, requirement_type, requirement_value)
values
  -- Progression badges
  ('first_blood',     'First Blood',        'Complete your first lab',                    '🩸', '#ff4136', 50,   'labs_completed',  1),
  ('specter',         'Specter',            'Reach Specter rank (750 XP)',                '👻', '#00d4ff', 100,  'total_xp',        750),
  ('phantom',         'Phantom',            'Reach Phantom rank (1,800 XP)',              '🌑', '#bf5fff', 200,  'total_xp',        1800),
  ('wraith',          'Wraith',             'Reach Wraith rank (3,200 XP)',               '💀', '#ff4136', 500,  'total_xp',        3200),
  ('legend',          'Legend',             'Reach Legend rank (5,000 XP)',               '⚡', '#ffb347', 1000, 'total_xp',        5000),
  -- Lab completion badges (13 labs total on the platform)
  ('lab_x3',          'Lab Rat',            'Complete 3 labs',                            '🐀', '#00ff41', 75,   'labs_completed',  3),
  ('lab_x7',          'Operator',           'Complete 7 labs',                            '🔧', '#00d4ff', 150,  'labs_completed',  7),
  ('lab_x10',         'Elite Operator',     'Complete 10 labs',                           '🎯', '#ffb347', 300,  'labs_completed',  10),
  ('lab_x13',         'Ghost Protocol',     'Complete all 13 labs — full platform clear', '🔱', '#ff4136', 750,  'labs_completed',  13),
  -- Module mastery badges
  ('tor_master',      'Tor Master',         'Complete all Tor & Dark Web labs',           '🧅', '#00ff41', 200,  'module_mastery',  1),
  ('osint_master',    'OSINT Ghost',        'Complete all OSINT & Surveillance labs',     '👁️', '#00d4ff', 200,  'module_mastery',  2),
  ('crypto_master',   'Chain Analyst',      'Complete all Crypto & Blockchain labs',      '⛓️', '#ffb347', 200,  'module_mastery',  3),
  ('offensive_master','Exploitation God',   'Complete all Offensive Security labs',       '💣', '#bf5fff', 250,  'module_mastery',  4),
  ('ad_master',       'Domain Lord',        'Complete all Active Directory labs',         '🏰', '#ff4136', 300,  'module_mastery',  5),
  ('web_master',      'Web Assassin',       'Complete all Web Attacks labs',              '🕷️', '#00d4ff', 250,  'module_mastery',  6),
  ('malware_master',  'Malware Surgeon',    'Complete all Malware Analysis labs',         '🦠', '#00ff41', 300,  'module_mastery',  7),
  ('network_master',  'Network Phantom',    'Complete all Network Attacks labs',          '🌐', '#00ffff', 250,  'module_mastery',  8),
  ('cloud_master',    'Cloud Wraith',       'Complete all Cloud Security labs',           '☁️', '#ff9500', 300,  'module_mastery',  9),
  ('se_master',       'Social Engineer',    'Complete all Social Engineering labs',       '🎭', '#ff6ec7', 250,  'module_mastery',  10),
  ('redteam_master',  'Red Team Operator',  'Complete all Red Team Ops labs',             '🔴', '#ff3333', 350,  'module_mastery',  11),
  ('wireless_master', 'Signal Ghost',       'Complete all Wireless Attacks labs',         '📡', '#aaff00', 250,  'module_mastery',  12),
  ('mobile_master',   'Mobile Infiltrator', 'Complete all Mobile Security labs',          '📱', '#7c4dff', 300,  'module_mastery',  13),
  -- Streak badges
  ('streak_3',        'On Fire',            '3-day activity streak',                      '🔥', '#ffb347', 50,   'streak',          3),
  ('streak_7',        'Week Warrior',       '7-day activity streak',                      '⚔️', '#ff4136', 150,  'streak',          7),
  ('streak_30',       'Ghost Protocol',     '30-day activity streak',                     '🌟', '#bf5fff', 500,  'streak',          30),
  -- Special badges
  ('all_modules',     'Ghost Architect',    'Complete at least one lab in every module',  '🏆', '#ffb347', 500,  'special',         1),
  ('report_writer',   'Pentest Pro',        'Generate a full pentest report',             '📄', '#00ff41', 100,  'special',         2),
  ('tool_master',     'Toolsmith',          'Use all 9 interactive tools',                '🛠️', '#00d4ff', 100,  'special',         3)
on conflict (slug) do nothing;

-- Users (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  name text not null,
  strava_id bigint unique,
  strava_access_token text,
  strava_refresh_token text,
  strava_token_expires_at bigint,
  xp integer default 0,
  tier text default 'Jogger',
  streak_weeks integer default 0,
  avatar_url text,
  created_at timestamptz default now()
);

-- Runs
create table runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  strava_activity_id bigint unique,
  distance_km numeric(6,2),
  duration_seconds integer,
  pace_per_km numeric(5,2),
  elevation_m numeric(6,1),
  start_time timestamptz,
  is_group_run boolean default false,
  xp_earned integer default 0,
  created_at timestamptz default now()
);

-- Badges
create table badges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon text
);

create table user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  badge_id uuid references badges(id),
  earned_at timestamptz default now(),
  unique(user_id, badge_id)
);

-- Challenges
create table challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text check (type in ('team','personal','duel')),
  target_value numeric,
  unit text,
  start_date date,
  end_date date,
  created_at timestamptz default now()
);

create table challenge_participants (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references challenges(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  current_value numeric default 0,
  unique(challenge_id, user_id)
);

-- Kudos
create table kudos (
  id uuid primary key default gen_random_uuid(),
  giver_id uuid references profiles(id) on delete cascade,
  run_id uuid references runs(id) on delete cascade,
  created_at timestamptz default now(),
  unique(giver_id, run_id)
);

-- Row level security
alter table profiles enable row level security;
alter table runs enable row level security;
alter table user_badges enable row level security;

create policy "Public profiles" on profiles for select using (true);
create policy "Own profile update" on profiles for update using (auth.uid() = id);
create policy "Public runs" on runs for select using (true);
create policy "Own runs insert" on runs for insert with check (auth.uid() = user_id);
create policy "Public badges" on user_badges for select using (true);

-- Indexes for leaderboard queries
create index on runs(user_id, start_time);
create index on runs(start_time);
create index on profiles(xp desc);

-- Run this in your Supabase project's SQL Editor.
-- Safe to re-run: uses IF NOT EXISTS for tables and drops policies before recreating them.

-- ===================================================================
-- PROJECTS
-- ===================================================================
create table if not exists projects (
  id text primary key,
  club_slug text not null,
  title text not null,
  category text,
  date text,
  location text,
  summary text,
  body text,
  cover text,
  gallery jsonb default '[]'::jsonb,
  attendees int,
  volunteer_hours numeric,
  duration text,
  jointly_with text,
  host_status text,
  updated bigint
);
alter table projects enable row level security;

-- If projects already existed before this update, run these once:
-- alter table projects add column if not exists attendees int;
-- alter table projects add column if not exists volunteer_hours numeric;
-- alter table projects add column if not exists duration text;
-- alter table projects add column if not exists jointly_with text;
-- alter table projects add column if not exists host_status text;
drop policy if exists "Public can view projects" on projects;
drop policy if exists "Anon can write projects" on projects;
create policy "Public can view projects" on projects for select using (true);
create policy "Anon can write projects" on projects for all using (true) with check (true);

-- ===================================================================
-- CLUB PROFILES — editable BOD, about, vision, goals per club
-- ===================================================================
create table if not exists club_profiles (
  club_slug text primary key,
  board jsonb default '[]'::jsonb,
  about text,
  vision text,
  goals jsonb default '[]'::jsonb,
  updated bigint
);
alter table club_profiles enable row level security;
drop policy if exists "Public can view club_profiles" on club_profiles;
drop policy if exists "Anon can write club_profiles" on club_profiles;
create policy "Public can view club_profiles" on club_profiles for select using (true);
create policy "Anon can write club_profiles" on club_profiles for all using (true) with check (true);

-- ===================================================================
-- EVENTS
-- ===================================================================
create table if not exists events (
  id text primary key,
  title text not null,
  event_date text,
  description text,
  rsvp_link text,
  updated bigint
);
alter table events enable row level security;
drop policy if exists "Public can view events" on events;
drop policy if exists "Anon can write events" on events;
create policy "Public can view events" on events for select using (true);
create policy "Anon can write events" on events for all using (true) with check (true);

-- ===================================================================
-- GUIDES
-- ===================================================================
create table if not exists guides (
  id text primary key,
  title text not null,
  category text,
  description text,
  file_name text,
  file_data text,
  updated bigint
);
alter table guides enable row level security;
drop policy if exists "Public can view guides" on guides;
drop policy if exists "Anon can write guides" on guides;
create policy "Public can view guides" on guides for select using (true);
create policy "Anon can write guides" on guides for all using (true) with check (true);

-- ===================================================================
-- BAROMETER
-- ===================================================================
create table if not exists barometer (
  club_slug text primary key,
  checked_items jsonb default '[]'::jsonb,
  updated bigint
);
alter table barometer enable row level security;
drop policy if exists "Public can view barometer" on barometer;
drop policy if exists "Anon can write barometer" on barometer;
create policy "Public can view barometer" on barometer for select using (true);
create policy "Anon can write barometer" on barometer for all using (true) with check (true);

-- ===================================================================
-- LEADERSHIP — current zonal team (ZRR, Secretary, etc.)
-- ===================================================================
create table if not exists leadership (
  id text primary key,
  role text not null,
  role_full text not null,
  name text not null,
  club text,
  bio text,
  photo text,
  sort_order int default 0,
  updated bigint
);
alter table leadership enable row level security;
alter table leadership add column if not exists club text;
drop policy if exists "Public can view leadership" on leadership;
drop policy if exists "Anon can write leadership" on leadership;
create policy "Public can view leadership" on leadership for select using (true);
create policy "Anon can write leadership" on leadership for all using (true) with check (true);

-- ===================================================================
-- ZRRS — ZRR history timeline
-- ===================================================================
create table if not exists zrrs (
  id text primary key,
  name text not null,
  years text not null,
  sort_order int default 0,
  is_current boolean default false,
  club text,
  bio text,
  photo text,
  updated bigint
);
alter table zrrs enable row level security;
alter table zrrs add column if not exists club text;
drop policy if exists "Public can view zrrs" on zrrs;
drop policy if exists "Anon can write zrrs" on zrrs;
create policy "Public can view zrrs" on zrrs for select using (true);
create policy "Anon can write zrrs" on zrrs for all using (true) with check (true);

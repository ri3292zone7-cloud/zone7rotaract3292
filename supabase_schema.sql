-- Run this once in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New Query → paste → Run)

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
  updated bigint
);

-- Enable Row Level Security
alter table projects enable row level security;

-- Anyone (including anonymous visitors) can READ projects — needed so
-- club.html / project.html can show them to the public.
create policy "Public can view projects"
  on projects for select
  using (true);

-- Anyone with the anon key can INSERT/UPDATE/DELETE.
-- This matches the current front-end-only password gate in admin.html
-- (the club password check happens in the browser, not the database).
-- If you want real per-club write security later, this is the policy
-- to tighten — e.g. by adding Supabase Auth and checking auth.uid().
create policy "Anon can write projects"
  on projects for all
  using (true)
  with check (true);

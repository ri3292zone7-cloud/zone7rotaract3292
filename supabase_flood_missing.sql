-- Flood Missing Persons — direct public writes (no club verification)
-- Run this once in Supabase SQL Editor
-- Anyone can add, and it appears immediately

create table if not exists flood_missing_persons (
  id text primary key,
  name text not null,
  last_seen_area text not null,
  reporter_name text not null,
  reporter_phone text not null,
  reporter_relation text,
  photo_url text,
  details text,
  consent boolean default false,
  status text default 'missing' check (status in ('missing','found','verified')),
  created_at bigint not null,
  updated_at bigint
);

alter table flood_missing_persons enable row level security;

drop policy if exists "Public can view flood_missing" on flood_missing_persons;
drop policy if exists "Anon can write flood_missing" on flood_missing_persons;

create policy "Public can view flood_missing" on flood_missing_persons
  for select using (true);

create policy "Anon can write flood_missing" on flood_missing_persons
  for all using (true) with check (true);

-- Optional: index for search
create index if not exists flood_missing_name_idx on flood_missing_persons (lower(name));
create index if not exists flood_missing_area_idx on flood_missing_persons (lower(last_seen_area));

-- Storage bucket for photos is the existing "project-images"
-- No new bucket needed — we reuse it with folder "flood-missing/"

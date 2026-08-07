# OPS — Zone 7 Rotaract Website Runbook

Static site on Vercel + Supabase (Postgres + Storage). No build step, no server to
patch. The one-time operating checklist lives below; everything else is ~5 min/month.

## Current stack (RY 2026-27)

- **Hosting**: Vercel Free — pure static HTML/CSS/JS + 3 serverless functions in `/api`
- **Database**: Supabase Free (`pdlolyghlgztjrpxwytl`) — tables: projects, events,
  guides, club_profiles, barometer, leadership, zrrs, guest_requests,
  membership_applications. Storage bucket: `project-images`
- **Email**: `api/notify-request.js` — Gmail SMTP via nodemailer
- **AI**: `api/rota-gpt.js` — DeepSeek/Pollinations chat for the RotaGPT widget.
  Works without any key: `rota-gpt.js` answers instantly from the built-in
  knowledge base, then upgrades the same bubble with an LLM reply when Vercel
  has `DEEPSEEK_API_KEY` or `POLLINATIONS_API_KEY` set (get a key at
  enter.pollinations.ai; the current endpoint is `gen.pollinations.ai/v1/chat/completions`)

## Deploy (manual file upload — no git/CLI)

1. Edit files locally.
2. Upload changed files to the Vercel project dashboard (same paths as local repo).
3. Hard-refresh (`Ctrl+Shift+R`) or test in incognito — the browser cache hides changes.

## First-time / one-time setup (already done)

- `supabase_schema.sql` → run in Supabase SQL Editor (creates tables + RLS).
- **Migration 1** → run `supabase-migration-1-scalability.sql` in the SQL Editor
  (adds indexes, `guides.file_url`, unique `(club_slug, project_code)`).
- Vercel env vars for the API functions (Email, etc.).
- GitHub: add repo secret `SUPABASE_ANON_KEY` for the backup workflow.

## Scalability rules (why the code looks the way it does)

- PostgREST silently caps responses at **1,000 rows**. `zone7-data.js` therefore
  always passes `limit`/`offset`; lists on the site are capped by design
  (mosaic 400, carousel 12/club, gallery 80/club, club page 60, admin pager 25).
- New project codes come from `nextProjectCode()` (max code + 1), NOT a count,
  and the DB unique constraint makes duplicates fail loudly. Admin retries 3x on
  a 409 before showing an error.
- Project images and guide files are uploaded to Storage (URLs in the DB), never
  base64. Old guide rows still carry `file_data` and keep working.
- Deleting a project/guide also deletes its Storage objects (best effort).
- Analytics "Total Projects" uses an exact count header, so it stays correct
  beyond 1,000 rows (the per-club chart is capped at the 1,000 newest).

## Monthly checks (~5 min)

1. Supabase Dashboard → Database → Backups (PITR snapshot) — verify last backup.
2. Check `backups/` in GitHub if the weekly workflow ran (also covers table dumps).
3. Storage usage: Storage → project-images — if near 1 GB, compress/delete old images.
4. Scan Vercel Analytics/usage — confirm no runaway requests to `/api/*`.

## If something breaks

- **Live page shows stale data**: hard refresh; check Supabase Table Editor for rows.
- **Mosaic/carousel/gallery empty**: `zone7-data.js` fetch failing — check the
  project URL (`pdlolyghlgztjrpxwytl.supabase.co`) and anon key in the file.
- **Image upload fails**: Storage policy for `project-images` (INSERT/SELECT
  must be open to anon — check Storage → Policies).
- **Save fails with 409 duplicate**: project code race — admin auto-retries;
  if persistent, two clubs shared a code pattern; fix codes in Table Editor.
- **Sitemap missing**: `/sitemap.xml` rewrites to `/api/sitemap` (see vercel.json).

## Restore from backup

Backups are JSONL dumps (one JSON array per table per week, paginated).
To restore a table:

1. Open Supabase SQL Editor.
2. Generate INSERTs from the JSONL (small script or table-plus):
   `python3 -c "import json,sys; rows=json.load(open('backups/projects.jsonl')); print(';'.join(rows))"` then wrap in INSERT statements, or use Supabase "Import data from CSV/JSON" for a single table.
3. For full disaster recovery use Supabase's native PITR (Dashboard → Database → Backups) — it runs automatically and is the primary restore path; the JSONL dumps are the portable fallback.

## Known debt (accepted, tracked)

- Security hardening (RLS to anon=false, real auth, rate limits on /api) — deferred;
  credentials are hardcoded in `zone7-data.js` (see CLUB_CREDENTIALS / ZONAL_PASSWORD).
- SEO phase (dynamic meta, OG/Twitter cards, PWA) — planned next.
- `files.zip` in repo root is publicly downloadable — remove it when convenient.

# District → Zone 7 sync (ongoing)

The district software (my.rotaract3292.org) has no webhooks, so new Zone 7
reports are pulled on a schedule. One command does everything:

```powershell
cd 'D:\6) Obsidian\Rotaract Zone 7\Website\wt-district-reports-import\sync'
python3 sync_district.py
```

What it does (read-only on the district side, writes only to Zone 7 Supabase):
1. Authenticates portably (`district_auth`: probe saved cookies, else
   email/password login — no api-anything, no Windows-only calls, so the
   same code runs on a PC and on GitHub Actions).
2. Lists Zone VII reports newest-first, takes ids above `district-sync-state.json → last_seen_id`.
3. Keeps rows from the 9 Zone 7 clubs of ANY Rotary Year (`keep_row_any_ry`); everything else is logged and skipped. Older years land in the Archive automatically (RY is derived from the project date).
4. Fetches each detail page, parses fields + report images (`district_parse.py`).
5. Downloads images, shrinks (cover ≤1600px, gallery ≤1200px), uploads to Supabase storage `project-images/{covers,gallery}/d3292-{id}-{n}.jpg`.
6. Upserts the project row (`on_conflict=id`, so re-runs never duplicate) with the next per-club `project_code`.
7. Advances the watermark. Out-of-scope rows still advance it (logged to stdout).

## Full-history backfill (every Rotary Year → Archive)

One-shot, resume-safe (re-run it freely — finished reports are skipped via
Supabase id check + local jsonl files). Requires a fresh district session first:

```powershell
cd 'D:\6) Obsidian\Rotaract Zone 7\Website\wt-district-reports-import\sync'
api-anything login rotaract3292
python3 backfill_all_years.py > backfill-run.log 2>&1
```
(one-shot helpers live next to the sync modules; run them from `sync/`).

Phase 1 paginates ALL Zone VII list pages (~230, a few minutes) and keeps
in-scope clubs of any RY → `district-extract-all-years.jsonl`. Phase 2 fetches
each detail page → `district-details-all-years.jsonl`. Phase 3 parses, rehosts
images, and upserts every missing report (logs to `backfill-log.csv`). The 44
already-imported RY 2026-27 reports are detected in Supabase and skipped.
Expect tens of minutes for a few hundred reports (polite delays throughout).

Seed after the first import — the watermark is the max district id seen:

```powershell
python3 -c "import json; rows=[json.loads(l) for l in open('district-extract-2026-27.jsonl',encoding='utf-8')]; print(max(r['id'] for r in rows))"
```

then write it into `district-sync-state.json`:

```json
{ "last_seen_id": <that number>, "last_run": null, "total_synced": 44 }
```

## Schedule — AUTOMATIC via GitHub (primary)

`.github/workflows/district-sync.yml` runs `sync/sync_district.py` **daily
21:00 NPT** plus on-demand ("Run workflow" in the Actions tab).
No AI agent, no local PC needed. The watermark
(`sync/district-sync-state.json`, tracked) is committed back after every
successful run, so runs stay incremental. The live site reads Supabase
directly, so synced reports appear within minutes — no redeploy.

One-time setup (do this once):
1. Create a **dedicated automation-only** district account (read Zone VII
   reports; never log it in anywhere else, or its cookies die early).
2. Repo Settings → Secrets and variables → Actions → add
   `DISTRICT_EMAIL` and `DISTRICT_PASSWORD`.
3. Actions tab → District sync → Run workflow → watch it go green.

### Credentials for local runs (never commit these)

`district_auth` reads, in order: `DISTRICT_EMAIL` / `DISTRICT_PASSWORD`
env vars, else `sync/district-credentials.json` (gitignored):

```json
{ "email": "automation@example.com", "password": "..." }
```

A successful credentialed login refreshes the api-anything session file
too, so the old `api-anything call` path keeps working as a fallback.

### Local fallback (Windows Task Scheduler)

Job **`Zone7 District Sync`**: every **Sunday 21:00**, runs `run-sync.ps1`
in this folder (logs to `sync/sync-scheduled.log`). Keep it enabled until
the Action has gone green twice, then disable it — two writers advancing
separate watermarks would confuse the state (both are idempotent on
upserts, but the file watermark only tracks one of them).
Verify anytime with `schtasks /query /tn 'Zone7 District Sync'`.
Run on demand between Sundays:

```powershell
.\run-sync.ps1
```

## Known limitations

- New reports only. Edits to already-synced reports don't resurface in the newest-first list and are NOT re-pulled — fix those in the Zone 7 admin panel.
- `RAC Baneshwor (OLD)` rows quarantine for a human decision (old vs new Baneshwor club).
- Reports from SAIM College / Mountaineering-Kathmandu (also Zone VII) are out of scope and skipped.

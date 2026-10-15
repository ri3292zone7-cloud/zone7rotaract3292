# District Reports → Zone 7 Projects Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract only Zone 7 clubs' RY 2026-27 reports from `my.rotaract3292.org/software/dashboard` via api-anything and import them as `projects` rows in Zone 7 Supabase.

**Architecture:** Teach api-anything 2 read ops (list + detail) from the district frontend's own XHR, dump JSON locally, filter to 9 Zone 7 slugs + RY window, transform to Zone 7 `projects` schema, upsert via `ZONE7_DB.saveProject` / SQL.

**Tech Stack:** api-anything (Node 22.13+, Chromium), Python 3.11 for transform, Supabase PostgREST (`projects` table)

**Spec:** User confirmed legitimate login + permission to export Zone 7 2026-27 only. Source: https://github.com/goodnight000/api-anything + https://my.rotaract3292.org/software/dashboard

## Global Constraints

- Do NOT ask for / store district password in repo — login happens via `api-anything login` browser flow only.
- Scope is Zone 7 only: `balkumari, baneshwor, liberty, kathmanduwest, kathmanduheight, sankhu, newroadcity, sukedhara, tripureswor` — from `zone7-data.js:30`.
- Date window is RY 2026-27 only: `2026-07-01` to `2027-06-30T23:59:59` — same as `zone7InRY2627()` in `zone7-data.js:196`.
- No writes to district software — api-anything reads only, no `--allow-writes`.
- Respect district ToS / Alpas backend — sequential calls, stop on 429 / auth error, credentials stay in `~/.api-anything` never in repo.
- Target schema is exact `database/supabase_schema.sql:9-26`: `id, club_slug, title, category, date, location, summary, body, cover, gallery(jsonb), attendees(int), volunteer_hours(numeric), duration, jointly_with, host_status, updated(bigint), project_code`.

## Review Focus

- District club names differ from Zone 7 slugs (e.g. "RAC Kathmandu West" vs `kathmanduwest`) — expect unmapped names to be quarantined not dropped silently.
- Report dates outside RY or missing dates must not leak into import — default is exclude.
- Duplicate district report IDs re-run must upsert same Zone 7 `id`, not create duplicates.
- `attendees` / `volunteer_hours` non-numeric strings must become null, not NaN / 0.
- Image URLs from district (if any) go to `cover` as URL string, never base64 into DB — per `OPS-README.md` scalability rules.

---

### Task 1: Install + login api-anything

**Files:**
- Modify: none (local env only)
- Test: `api-anything call hacker-news search query=sqlite` returns `"ok":true`

**Interfaces:**
- Consumes: Node v24.19.0 already present (requires >=22.13), Chromium (Chrome/Edge/Brave)
- Produces: `api-anything` CLI + MCP available, `~/.api-anything` session for site `rotaract3292`

- [ ] **Step 1: Install api-anything from temp clone (do not use npm install -g github:...)**

Run:
```bash
node --version && npm --version && git --version
```
Expected: Node >=22.13 (you have v24.19.0).

Then in Git Bash / sh:
```bash
dir="$(mktemp -d)" && trap 'rm -rf "$dir"' EXIT && git clone -q --depth 1 https://github.com/goodnight000/api-anything.git "$dir" && cd "$dir" && npm ci --no-audit --no-fund && archive="$(npm pack --silent)" && npm install -g "$archive"
```
Expected: exit 0. On EACCES do NOT sudo — stop and report.

- [ ] **Step 2: Verify install works**

Run: `api-anything call hacker-news search query=sqlite`
Expected: JSON with `"ok":true`, `"tier":1`.

- [ ] **Step 3: Login to district software (you do this, not the agent)**

Run: `api-anything login rotaract3292`
Expected: On Windows it opens a browser window — sign in with your authorized district account by hand. Session saved to `~/.api-anything`, never to repo. Verify with `api-anything ops rotaract3292` (empty list is OK at this stage).

### Task 2: Teach list + detail read ops

**Files:**
- Create: `D:\6) Obsidian\Rotaract Zone 7\Website\zone7rotaract3292-main\zone7rotaract3292-main\docs\superpowers\plans\district-capture-notes.md` (trigger URLs, param names)
- Test: `api-anything call rotaract3292 listReports <param>=<unseen-value>` returns JSON with report rows

**Interfaces:**
- Consumes: authenticated session from Task 1
- Produces: ops `rotaract3292/listReports`, `rotaract3292/getReportDetail` + capture notes file

- [ ] **Step 1: Scout with outline (do not guess endpoints)**

Run: `api-anything capture --outline "https://my.rotaract3292.org/software/dashboard"`
Expected: summary listing the XHRs the dashboard page actually makes (list endpoint, filters, auth headers). Save the real list URL + query params into `district-capture-notes.md`.

- [ ] **Step 2: Propose ops and wait for user approval**

Propose: `listReports` (params: club filter + date/page) and `getReportDetail` (param: report id). Do NOT build until user approves param list.

- [ ] **Step 3: Build listReports with 2 examples from 2 different Zone 7 clubs**

Example shape (replace trigger/match with real values from Step 1):
```bash
api-anything add rotaract3292 listReports --trigger 'https://my.rotaract3292.org/<real-list-path>?club={club}&page={page}' --example club=<clubA> --example2 club=<clubB> --match path=/<real-list-path>
```
Expected: learn succeeds, template saved.

- [ ] **Step 4: Verify with 3rd unseen input**

Run: `api-anything call rotaract3292 listReports club=<third-club>`
Expected: `"ok":true`, rows contain recognizable report titles. If `class:"auth"` → re-run `api-anything login rotaract3292`. If CAPTCHA / challenge → stop, clear by hand per api-anything Limits.

- [ ] **Step 5: Build + verify getReportDetail same way (2 examples + 1 unseen id)**

### Task 3: Extract Zone 7 RY 2026-27 raw dump

**Files:**
- Create: `scripts/district-extract-2026-27.jsonl` (raw, gitignored if sensitive)
- Create: `scripts/district-extract-log.csv` (report_id, district_club_name, date, included_yes_no, reason)
- Test: log shows only 9 clubs + RY window, counts reconcile with dashboard

**Interfaces:**
- Consumes: `rotaract3292/listReports`, `rotaract3292/getReportDetail`
- Produces: JSONL raw dump + log CSV

- [ ] **Step 1: Write failing count check**

Assert raw dump length equals dashboard count for Zone 7 RY filter ± documented pagination. Run and confirm it fails before extract.

- [ ] **Step 2: Extract sequentially (no parallel hammering)**

Loop 9 slugs → list → for each report in `2026-07-01..2027-06-30` call `getReportDetail`. Save each detail as one JSON line. Stop on 429/401 and report. Do NOT attempt other zones / other years.

- [ ] **Step 3: Verify counts + log**

Run: count JSONL lines, count `included_yes_no=yes`, compare to dashboard Zone 7 total. Expected: PASS, mismatches listed in log with reason (`out_of_RY`, `non_Zone7`, `missing_date`).

### Task 4: Transform + import to Zone 7 projects

**Files:**
- Create: `scripts/map-district-to-zone7.py`
- Modify: `database/supabase_schema.sql` — no change (read-only reference)
- Test: `python scripts/map-district-to-zone7.py --dry-run` produces `scripts/zone7-import-preview.json` with zero schema violations

**Interfaces:**
- Consumes: `scripts/district-extract-2026-27.jsonl`
- Produces: `scripts/zone7-import-preview.json` then real upsert via `ZONE7_DB.saveProject(clubSlug, project)` in `zone7-data.js:590`
- Mapping function: `map_report(district_row: dict) -> project_row: dict` with fields `id, club_slug, title, category, date, location, summary, body, cover, gallery, attendees, volunteer_hours, duration, jointly_with, host_status, project_code, updated`

- [ ] **Step 1: Write failing mapping test**

```python
def test_map_known_report():
  assert map_report(SAMPLE_DISTRICT_ROW)["club_slug"] == "sukedhara"
  assert map_report(SAMPLE_DISTRICT_ROW)["date"] >= "2026-07-01"
```
Run: `pytest scripts/test_map.py -v` Expected: FAIL (function not defined).

- [ ] **Step 2: Implement `map_report()` in `scripts/map-district-to-zone7.py`**

Rules: district club name → slug via explicit dict (quarantine unknowns); `id = "dist2627-<district_id>"`; `project_code` via existing prefix or leave blank for `nextProjectCode()` in `zone7-data.js:541`; non-numeric attendees/hours → null; missing date → exclude; `cover` = URL only; `updated = Date.now()` at import time.

- [ ] **Step 3: Dry-run and verify preview**

Run: `python scripts/map-district-to-zone7.py --dry-run`
Expected: `zone7-import-preview.json` created, validator reports 0 missing `id/club_slug/title`, 0 out-of-RY dates, 0 base64 covers.

- [ ] **Step 4: Import via admin path (small batch first)**

Use existing `ZONE7_DB.saveProject()` (respects `zone7CacheBustClub()`) or Table Editor CSV for 3 rows, check `club.html?club=<slug>` renders, then full import. On 409 duplicate code → retry with `nextProjectCode()` per `OPS-README.md`.

- [ ] **Step 5: Commit mapping script only (never raw dump if it contains PII)**

```bash
git add scripts/map-district-to-zone7.py scripts/test_map.py
git commit -m "feat: map district 2026-27 reports to zone7 projects"
```

### Task 5: Verify on live Zone 7 site

**Files:**
- Modify: none
- Test: homepage mosaic + `club.html` + `gallery.html` show imported 2026-27 projects

**Interfaces:**
- Consumes: imported `projects` rows
- Produces: verification checklist in plan file

- [ ] **Step 1: Check admin list + public pages**

Open `/admin`, `/?` mosaic, `/club.html?club=sukedhara` (and 1 more club), confirm new titles/dates appear. Hard-refresh (`Ctrl+Shift+R`) to bypass cache per `OPS-README.md`.

- [ ] **Step 2: Check barometer auto-checks**

Confirm items 32/36 (`zone7AutoCheck()` in `zone7-data.js:218`) still evaluate correctly with new `category/title/summary/body` text.

- [ ] **Step 3: Record final counts in `district-extract-log.csv` + close**

## Self-Review

- Spec coverage: login-gated extraction, Zone 7-only filter, RY window, projects-schema import, verification — each has a task.
- Step scan: each step is one action with checkable output; no TBDs.
- Type consistency: `club_slug` values match `CLUB_DIRECTORY` keys; `project` shape matches `saveProject()` row in `zone7-data.js:591-610`.
- Proportion: plan is decisions only; bodies live in implementer's script.

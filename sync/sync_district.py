"""Ongoing Zone 7 <-> district sync. New district reports -> Supabase projects.

State: district-sync-state.json {last_seen_id, last_run, total_synced}.
Polls reportsByZone (zone=7, sort desc by id) and processes only ids newer
than last_seen_id, then reuses the one-shot pipeline modules:
  zone7_filter -> fetch_details -> district_parse -> images_pipeline/
  import_images -> map_district_to_zone7 -> import_projects.

Limitations (documented, not hidden):
- New reports only. Edits to old reports don't resurface in the desc-by-id
  list, so they are NOT picked up. Fix manually via admin panel.
- District has no webhooks; run on a schedule (see SYNC-README.md).
"""
import json
import sys
import time
from datetime import datetime, timezone

import extract_zone7
import fetch_details
import import_images
import import_projects
from map_district_to_zone7 import to_project
from images_pipeline import storage_paths, shrink_jpeg
from zone7_filter import keep_row_any_ry

STATE = 'district-sync-state.json'


def new_since_state(rows, last_seen_id):
    """Rows (desc by id) newer than the stored watermark."""
    return [r for r in rows if r.get('id', 0) > last_seen_id]


def load_state():
    try:
        return json.load(open(STATE, encoding='utf-8'))
    except FileNotFoundError:
        return {'last_seen_id': 0, 'last_run': None, 'total_synced': 0}


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    state = load_state()
    last_seen = state['last_seen_id']
    print(f'state: last_seen_id={last_seen}', flush=True)
    fresh = []
    page = 1
    while True:
        try:
            d = extract_zone7.call_page(page)
        except RuntimeError as e:
            # Auth failure (dead session, no/expired credentials) — say so
            # plainly for the scheduled-run logs instead of a bare traceback.
            print(f'SYNC ABORTED: {e}', flush=True)
            return 2
        rows = d.get('data', [])
        if not rows:
            break
        batch = new_since_state(rows, last_seen)
        fresh.extend(batch)
        if len(batch) < len(rows):
            break  # reached previously-seen ids
        page += 1
        if page > 50:
            print('safety cap 50 pages', flush=True)
            break
        time.sleep(extract_zone7.DELAY_S)
    print(f'new rows since {last_seen}: {len(fresh)}', flush=True)
    if not fresh:
        state['last_run'] = datetime.now(timezone.utc).isoformat()
        json.dump(state, open(STATE, 'w', encoding='utf-8'), indent=1)
        print('nothing new', flush=True)
        return
    kept = []
    for r in fresh:
        ok, slug, reason = keep_row_any_ry(r)
        print(f"{r.get('id')}: {reason} ({r.get('clubs')})", flush=True)
        if ok:
            kept.append({**r, '_slug': slug})
    if not kept:
        state['last_seen_id'] = max(r['id'] for r in fresh)
        state['last_run'] = datetime.now(timezone.utc).isoformat()
        json.dump(state, open(STATE, 'w', encoding='utf-8'), indent=1)
        print('new rows but none in scope; watermark advanced', flush=True)
        return
    opener = fetch_details.make_opener()
    img_opener = import_images.district_opener()
    counters = {}
    synced = 0
    for r in kept:
        rid = r['id']
        try:
            html = fetch_details.fetch(opener, rid)
            if 'Report Profile' not in html:
                print(f'{rid}: not a report page, skipped', flush=True)
                continue
            from district_parse import parse_report_detail
            d = parse_report_detail(html, rid)
            d['_slug'] = r['_slug']
            d['_list'] = {k: r[k] for k in
                          ('title', 'clubs', 'avenue', 'project_type',
                           'start_date', 'end_date', 'current_rota_year_id')}
            urls = d.get('images') or []
            cover, gallery = '', []
            if urls:
                cp, gp = storage_paths(rid, len(urls))
                cover = import_images.upload(
                    cp, shrink_jpeg(import_images.download(img_opener, urls[0])))
                gallery = [import_images.upload(
                    p, shrink_jpeg(import_images.download(img_opener, u),
                                   max_width=1200))
                    for p, u in zip(gp, urls[1:])]
            p = to_project(d, strict_ry=False)
            p['cover'] = cover
            p['gallery'] = gallery
            if r['_slug'] not in counters:
                counters[r['_slug']] = import_projects.existing_codes(r['_slug'])
            p['project_code'] = import_projects.next_code(counters, r['_slug'])
            p['updated'] = int(time.time() * 1000)
            import_projects.upsert(p)
            synced += 1
            print(f"{rid}: synced {p['club_slug']} {p['project_code']}", flush=True)
        except ValueError as e:
            print(f'{rid}: quarantined ({e})', flush=True)
        except Exception as e:  # noqa: BLE001 — keep going
            print(f'{rid}: FAIL {type(e).__name__} {str(e)[:120]}', flush=True)
        time.sleep(1.5)
    state['last_seen_id'] = max(r['id'] for r in fresh)
    state['last_run'] = datetime.now(timezone.utc).isoformat()
    state['total_synced'] = state.get('total_synced', 0) + synced
    json.dump(state, open(STATE, 'w', encoding='utf-8'), indent=1)
    print(f'DONE synced={synced} watermark={state["last_seen_id"]}', flush=True)


if __name__ == '__main__':
    sys.exit(main())

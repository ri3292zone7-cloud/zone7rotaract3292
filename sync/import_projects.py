"""Upsert mapped district projects into live Supabase projects table."""
import csv
import json
import re
import sys
import time
import urllib.request

SUPABASE_URL = 'https://pdlolyghlgztjrpxwytl.supabase.co'
SUPABASE_KEY = 'sb_publishable_MNRC6w2H8lZ9OANmmntZaQ__OBFwqCj'
HEADERS = {'apikey': SUPABASE_KEY,
           'Authorization': 'Bearer ' + SUPABASE_KEY,
           'Content-Type': 'application/json'}
LOG = 'import-log.csv'
DELAY_S = 0.5


def rest(method, path, body=None):
    req = urllib.request.Request(
        SUPABASE_URL + path,
        data=json.dumps(body).encode() if body is not None else None,
        method=method, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def existing_codes(club_slug):
    rows = rest('GET', f'/rest/v1/projects?select=project_code&club_slug=eq.{club_slug}&limit=1000')
    nums = []
    for r in rows:
        m = re.search(r'(\d+)', str(r.get('project_code') or ''))
        if m:
            nums.append(int(m.group(1)))
    return max(nums) if nums else 0


def next_code(prefix_counters, club_slug):
    prefix = club_slug[:4].upper()
    n = prefix_counters[club_slug] + 1
    prefix_counters[club_slug] = n
    return f'{prefix}-{n:02d}'


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    projects = json.load(open('import-preview.json', encoding='utf-8'))
    images = json.load(open('image-map.json', encoding='utf-8'))
    slugs = sorted(set(p['club_slug'] for p in projects))
    counters = {s: existing_codes(s) for s in slugs}
    print('existing max codes:', counters, flush=True)
    already = {}
    for s in slugs:
        for r in rest('GET', f'/rest/v1/projects?select=id,project_code&club_slug=eq.{s}&limit=1000'):
            already[r['id']] = r.get('project_code') or ''
    n_ok, n_fail = 0, 0
    with open(LOG, 'w', encoding='utf-8', newline='') as lf:
        log = csv.writer(lf)
        log.writerow(['id', 'club_slug', 'project_code', 'title', 'status'])
        for p in projects:
            row = dict(p)
            img = images.get(str(row['id'].split('-d3292-')[-1]), {})
            row['cover'] = img.get('cover', '')
            row['gallery'] = img.get('gallery', [])
            row['project_code'] = already.get(row['id']) or next_code(counters, row['club_slug'])
            row['updated'] = int(time.time() * 1000)
            try:
                upsert(row)
                log.writerow([row['id'], row['club_slug'], row['project_code'],
                              row['title'][:80], 'ok'])
                print(f"{row['club_slug']} {row['project_code']} ok — {row['title'][:60]}",
                      flush=True)
                n_ok += 1
            except Exception as e:  # noqa: BLE001
                log.writerow([row['id'], row['club_slug'], '', row['title'][:80],
                              f'FAIL {type(e).__name__} {str(e)[:100]}'])
                print(f"{row['id']}: FAIL {type(e).__name__} {str(e)[:150]}", flush=True)
                n_fail += 1
            time.sleep(DELAY_S)
    print(f'DONE ok={n_ok} fail={n_fail}')


def upsert(row):
    req = urllib.request.Request(
        SUPABASE_URL + '/rest/v1/projects?on_conflict=id',
        data=json.dumps(row).encode(), method='POST',
        headers={**HEADERS, 'Prefer': 'resolution=merge-duplicates,return=representation'})
    with urllib.request.urlopen(req, timeout=30) as r:
        r.read()


if __name__ == '__main__':
    sys.exit(main())

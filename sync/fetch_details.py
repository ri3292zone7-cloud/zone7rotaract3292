"""Fetch + parse district detail pages for extracted RY rows (read-only, polite)."""
import http.cookiejar
import json
import os
import ssl
import sys
import time
import urllib.request
from http.cookiejar import Cookie

import district_auth
from district_parse import parse_report_detail

BASE = 'https://my.rotaract3292.org'
IN_JSONL = 'district-extract-2026-27.jsonl'
OUT_JSONL = 'district-details-2026-27.jsonl'
DELAY_S = 1.5
SESSIONS = [
    r'C:\Users\Predator\.api-anything\sessions\rotaract3292.json',
    r'C:\Users\Predator\.api-anything\sessions\my.rotaract3292.org.json',
]


def _working_session():
    """Return the first session file whose cookies still authenticate."""
    import urllib.request
    files = ([os.environ[district_auth.SESSION_ENV]]
             if os.environ.get(district_auth.SESSION_ENV) else []) + SESSIONS
    last = files[0]
    for path in files:
        try:
            sess = json.load(open(path))
        except FileNotFoundError:
            continue
        last = path
        ck = '; '.join(c['name'] + '=' + c['value'] for c in sess['cookies'])
        req = urllib.request.Request(
            BASE + '/software/project-reports/61667',
            headers={'Cookie': ck, 'User-Agent': 'Mozilla/5.0'})
        try:
            body = urllib.request.urlopen(
                req, context=ssl._create_unverified_context(),
                timeout=30).read().decode('utf-8', errors='ignore')
            if 'Report Profile' in body:
                return path
        except Exception:  # noqa: BLE001 — try next file
            continue
    return last


def make_opener(session_file=None):
    if session_file:
        sess = json.load(open(session_file))
        cj = http.cookiejar.CookieJar()
        for c in sess['cookies']:
            cj.set_cookie(Cookie(0, c['name'], c['value'], None, False,
                                 c['domain'], False, False, '/', True, False,
                                 None, None, None, None, None))
        # NOTE: site cert expired (verified 2026-10-15); read-only GETs only.
        ctx = ssl._create_unverified_context()
        return urllib.request.build_opener(
            urllib.request.HTTPCookieProcessor(cj),
            urllib.request.HTTPSHandler(context=ctx))
    # Portable path: probe cookie files, else credentialed login.
    return district_auth.make_opener()


def fetch(opener, report_id):
    url = f'{BASE}/software/project-reports/{report_id}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    return opener.open(req, timeout=30).read().decode('utf-8', errors='ignore')


def main():
    rows = [json.loads(l) for l in
            open(IN_JSONL, encoding='utf-8') if l.strip()]
    done = set()
    try:
        for l in open(OUT_JSONL, encoding='utf-8'):
            if l.strip():
                done.add(json.loads(l)['id'])
    except FileNotFoundError:
        pass
    opener = make_opener()
    n_ok, n_fail = 0, 0
    with open(OUT_JSONL, 'a', encoding='utf-8') as out:
        for r in rows:
            rid = r['id']
            if rid in done:
                continue
            try:
                html = fetch(opener, rid)
                if 'Report Profile' not in html:
                    print(f'{rid}: NOT A REPORT PAGE (login wall?)', flush=True)
                    n_fail += 1
                    continue
                d = parse_report_detail(html, rid)
                d['_slug'] = r['_slug']
                d['_list'] = {k: r[k] for k in
                              ('title', 'clubs', 'avenue', 'project_type',
                               'start_date', 'end_date', 'current_rota_year_id')}
                out.write(json.dumps(d) + '\n')
                out.flush()
                n_ok += 1
                print(f'{rid}: ok ({r["_slug"]})', flush=True)
            except Exception as e:  # noqa: BLE001 — keep going, report at end
                print(f'{rid}: FAIL {type(e).__name__} {str(e)[:120]}', flush=True)
                n_fail += 1
            time.sleep(DELAY_S)
    print(f'DONE ok={n_ok} fail={n_fail}')


if __name__ == '__main__':
    sys.exit(main())

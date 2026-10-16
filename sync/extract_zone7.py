"""Extract Zone 7 RY 2026-27 list rows via reportsByZone (read-only, polite)."""
import csv
import json
import re
import sys
import time
import pathlib

import district_auth
from zone7_filter import keep_row, should_stop

OUT_JSONL = 'district-extract-2026-27.jsonl'
OUT_LOG = 'district-extract-log.csv'
DELAY_S = 1.2
MAX_PAGES = 231  # zone=7 total 2304 @ 10/page


def call_page(page):
    # Direct HTTPS (same endpoint the api-anything operation captured).
    # Raises RuntimeError with an actionable message on a login wall.
    return district_auth.call_page(page)


def main():
    kept_total = 0
    seen_total = 0
    recent = []
    pages = 0
    with open(OUT_JSONL, 'w', encoding='utf-8') as jf, \
            open(OUT_LOG, 'w', encoding='utf-8', newline='') as lf:
        log = csv.writer(lf)
        log.writerow(['page', 'id', 'club', 'slug', 'title', 'ry', 'decision'])
        for page in range(1, MAX_PAGES + 1):
            try:
                d = call_page(page)
            except Exception as e:  # noqa: BLE001 — log and continue once
                print(f'page {page}: CALL FAILED {e}', flush=True)
                time.sleep(DELAY_S * 3)
                try:
                    d = call_page(page)
                except Exception as e2:  # noqa: BLE001
                    print(f'page {page}: retry failed {e2}, stopping', flush=True)
                    break
            rows = d.get('data', [])
            pages = page
            kept_this = 0
            for r in rows:
                seen_total += 1
                kept, slug, reason = keep_row(r)
                log.writerow([page, r.get('id'), r.get('clubs'), slug,
                              (r.get('title') or '')[:120],
                              r.get('current_rota_year_id'), reason])
                if kept:
                    kept_this += 1
                    kept_total += 1
                    jf.write(json.dumps({**r, '_slug': slug}) + '\n')
            recent.append(kept_this)
            print(f'page {page}: rows={len(rows)} kept={kept_this} '
                  f'total_kept={kept_total}', flush=True)
            if should_stop(recent):
                print(f'stop: 3 consecutive empty pages at {page}', flush=True)
                break
            time.sleep(DELAY_S)
    print(f'DONE pages={pages} seen={seen_total} kept={kept_total}')


if __name__ == '__main__':
    sys.exit(main())

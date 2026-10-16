"""Download district report images, rehost on Supabase storage. Writes image-map.json."""
import http.cookiejar
import json
import ssl
import sys
import time
import urllib.request
from http.cookiejar import Cookie

from images_pipeline import storage_paths, shrink_jpeg
import district_auth

SUPABASE_URL = 'https://pdlolyghlgztjrpxwytl.supabase.co'
SUPABASE_KEY = 'sb_publishable_MNRC6w2H8lZ9OANmmntZaQ__OBFwqCj'
BUCKET = 'project-images'
OUT = 'image-map.json'
DELAY_S = 0.8


def district_opener():
    # Portable: probe cookie files, else credentialed login.
    return district_auth.make_opener()


def download(opener, url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    return opener.open(req, timeout=60).read()


def upload(path, jpeg_bytes):
    req = urllib.request.Request(
        f'{SUPABASE_URL}/storage/v1/object/{BUCKET}/{path}',
        data=jpeg_bytes, method='POST',
        headers={'apikey': SUPABASE_KEY,
                 'Authorization': 'Bearer ' + SUPABASE_KEY,
                 'Content-Type': 'image/jpeg',
                 'x-upsert': 'true'})
    with urllib.request.urlopen(req, timeout=60) as r:
        r.read()
    return f'{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{path}'


def main():
    details = [json.loads(l) for l in
               open('district-details-2026-27.jsonl', encoding='utf-8')
               if l.strip()]
    try:
        done = json.load(open(OUT, encoding='utf-8'))
    except FileNotFoundError:
        done = {}
    opener = district_opener()
    for d in details:
        rid = str(d['id'])
        if rid in done:
            continue
        urls = d.get('images') or []
        if not urls:
            done[rid] = {'cover': '', 'gallery': []}
            continue
        cover_path, gallery_paths = storage_paths(d['id'], len(urls))
        try:
            cover = upload(cover_path,
                           shrink_jpeg(download(opener, urls[0])))
            gallery = [upload(p, shrink_jpeg(download(opener, u), max_width=1200))
                       for p, u in zip(gallery_paths, urls[1:])]
            done[rid] = {'cover': cover, 'gallery': gallery}
            print(f'{rid}: cover + {len(gallery)} gallery', flush=True)
        except Exception as e:  # noqa: BLE001 — record, keep going
            print(f'{rid}: IMAGE FAIL {type(e).__name__} {str(e)[:120]}', flush=True)
            done[rid] = {'cover': '', 'gallery': [],
                         'error': f'{type(e).__name__}: {str(e)[:120]}'}
        json.dump(done, open(OUT, 'w', encoding='utf-8'), indent=1)
        time.sleep(DELAY_S)
    n_cov = sum(1 for v in done.values() if v.get('cover'))
    print(f'DONE reports={len(done)} with_cover={n_cov}')


if __name__ == '__main__':
    sys.exit(main())

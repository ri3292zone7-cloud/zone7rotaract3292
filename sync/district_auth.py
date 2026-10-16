"""Portable district auth + API client (no api-anything, no Windows-only calls).

Session sources, in order:
1. DISTRICT_SESSION_FILE env var (a JSON cookie file), else the two
   api-anything session paths (local runs).
2. Email/password login — DISTRICT_EMAIL / DISTRICT_PASSWORD env vars,
   else district-credentials.json next to this file (gitignored, never
   committed). Fresh cookies are saved back to the session file so the
   next run (and the api-anything CLI) keeps working.

Works identically on a dev PC and on GitHub Actions.
"""
import http.cookiejar
import json
import os
import re
import ssl
import urllib.parse
import urllib.request
from http.cookiejar import Cookie

BASE = 'https://my.rotaract3292.org'
UA = {'User-Agent': 'Mozilla/5.0'}
LOGIN_PAGE = BASE + '/software'
LOGIN_POST = BASE + '/software/login'
LIST_PATH = '/software/api/project-reportsList'
PROBE_PATH = '/software/project-reports/61667'  # any real report id

SESSION_ENV = 'DISTRICT_SESSION_FILE'
EMAIL_ENV, PASS_ENV = 'DISTRICT_EMAIL', 'DISTRICT_PASSWORD'
CRED_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                         'district-credentials.json')
DEFAULT_SESSIONS = [
    r'C:\Users\Predator\.api-anything\sessions\rotaract3292.json',
    r'C:\Users\Predator\.api-anything\sessions\my.rotaract3292.org.json',
]
SAVE_SESSION = DEFAULT_SESSIONS[1]  # canonical file to refresh on login


def _ctx():
    # NOTE: site cert expired (verified 2026-10-15); read-only GETs + login POST.
    return ssl._create_unverified_context()


def session_files():
    """Candidate cookie files: env override first, then local defaults."""
    env = os.environ.get(SESSION_ENV)
    files = [env] if env else []
    return files + [p for p in DEFAULT_SESSIONS if p not in files]


def load_file(path):
    try:
        sess = json.load(open(path, encoding='utf-8'))
        cookies = sess.get('cookies') or []
        return [c for c in cookies if c.get('name') and c.get('value')]
    except (FileNotFoundError, ValueError, AttributeError):
        return []


def cookie_header(cookies):
    return '; '.join(c['name'] + '=' + c['value'] for c in cookies)


def probe(cookies):
    """True if these cookies still authenticate (read-only detail GET)."""
    if not cookies:
        return False
    try:
        req = urllib.request.Request(BASE + PROBE_PATH, headers=UA)
        req.add_header('Cookie', cookie_header(cookies))
        body = urllib.request.urlopen(
            req, context=_ctx(), timeout=30).read().decode('utf-8', 'ignore')
        return 'Report Profile' in body
    except Exception:
        return False


def find_working_file():
    """First cookie file whose cookies still authenticate, else None."""
    for path in session_files():
        if probe(load_file(path)):
            return path
    return None


def read_creds():
    """(email, password) from env, else the local gitignored cred file."""
    email = os.environ.get(EMAIL_ENV)
    password = os.environ.get(PASS_ENV)
    if email and password:
        return email, password
    try:
        cred = json.load(open(CRED_FILE, encoding='utf-8'))
        if cred.get('email') and cred.get('password'):
            return cred['email'], cred['password']
    except (FileNotFoundError, ValueError, AttributeError):
        pass
    return None, None


def login(email, password, save_to=None):
    """Form login (Laravel: session cookie + _token). Returns cookie list.

    Raises RuntimeError('LOGIN FAILED ...') when the credentials are
    rejected, so scheduled runs log a plain-English line.
    """
    jar = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(jar),
        urllib.request.HTTPSHandler(context=_ctx()))
    page = opener.open(
        urllib.request.Request(LOGIN_PAGE, headers=UA),
        timeout=30).read().decode('utf-8', 'ignore')
    m = re.search(r'name="_token"\s+value="([^"]+)"', page)
    if not m:
        raise RuntimeError('LOGIN FAILED: no CSRF token on login page')
    data = urllib.parse.urlencode({
        '_token': m.group(1), 'email': email, 'password': password,
    }).encode()
    opener.open(
        urllib.request.Request(LOGIN_POST, data=data, headers=UA),
        timeout=30).read()
    cookies = [{'name': c.name, 'value': c.value,
                'domain': c.domain or 'my.rotaract3292.org'} for c in jar]
    if not probe(cookies):
        raise RuntimeError('LOGIN FAILED: credentials rejected '
                           '(or login form changed)')
    if save_to:
        try:
            json.dump({'cookies': cookies}, open(save_to, 'w'), indent=1)
        except OSError:
            pass
    print(f'district login ok ({len(cookies)} cookies)', flush=True)
    return cookies


def get_cookies():
    """Working cookies: probe files first, else login via stored creds.

    Raises RuntimeError with an actionable message when neither works.
    """
    for path in session_files():
        cookies = load_file(path)
        if probe(cookies):
            return cookies
    email, password = read_creds()
    if not email:
        raise RuntimeError(
            'LOGIN WALL: no working session and no credentials. '
            f'Set {EMAIL_ENV}/{PASS_ENV} or add {CRED_FILE}.')
    return login(email, password, save_to=SAVE_SESSION)


def make_opener(cookies=None):
    """Cookie-jar opener for detail/image GETs (same shape as before)."""
    cookies = cookies if cookies is not None else get_cookies()
    jar = http.cookiejar.CookieJar()
    for c in cookies:
        jar.set_cookie(Cookie(0, c['name'], c['value'], None, False,
                              c.get('domain') or 'my.rotaract3292.org',
                              False, False, '/', True, False,
                              None, None, None, None, None))
    return urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(jar),
        urllib.request.HTTPSHandler(context=_ctx()))


def api_get(path, params):
    """GET a district JSON API path with auth. Returns parsed JSON."""
    cookies = get_cookies()
    url = BASE + path + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    req.add_header('Cookie', cookie_header(cookies))
    return json.load(urllib.request.urlopen(req, context=_ctx(), timeout=60))


def call_page(page, perpage=10, zone=7):
    """One desc-by-id Zone VII list page — same return shape as before."""
    return api_get(LIST_PATH, {
        'pagination[page]': page,
        'pagination[perpage]': perpage,
        'sort[sort]': 'desc',
        'sort[field]': 'id',
        'query[ZoneID]': zone,
    })

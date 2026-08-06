"""Local preview server for the Zone 7 site.

Mirrors vercel.json rewrites so clean URLs (e.g. /meetings) work locally
exactly as they do in production.

Usage:
    python serve.py          # serves on http://localhost:8000
    python serve.py 3000     # custom port
"""
import http.server
import os
import sys
import urllib.parse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
ROOT = os.path.dirname(os.path.abspath(__file__))

PAGE_REWRITES = {
    "/about": "/about.html",
    "/gallery": "/gallery.html",
    "/guides": "/guides.html",
    "/club-guides": "/club-guides.html",
    "/meetings": "/meetings.html",
    "/tutorials": "/tutorials.html",
    "/tutorial-meetings": "/tutorial-meetings.html",
    "/tutorial-board": "/tutorial-board.html",
    "/tutorial-assembly": "/tutorial-assembly.html",
    "/tutorial-zrr": "/tutorial-zrr.html",
    "/tutorial-drr": "/tutorial-drr.html",
    "/tutorial-blood": "/tutorial-blood.html",
    "/join": "/join.html",
    "/handbook": "/handbook.html",
    "/handbook-grants": "/handbook-grants.html",
    "/handbook-twinship": "/handbook-twinship.html",
    "/handbook-newclub": "/handbook-newclub.html",
    "/handbook-projects": "/handbook-projects.html",
    "/handbook-health": "/handbook-health.html",
}

CLUB_SLUGS = [
    "balkumari", "baneshwor", "liberty", "kathmanduwest", "kathmanduheight",
    "sankhu", "newroadcity", "sukedhara", "tripureswor",
]

MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".txt": "text/plain; charset=utf-8",
    ".xml": "application/xml",
    ".sql": "text/plain; charset=utf-8",
    ".json": "application/json",
}


class Zone7Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        path = urllib.parse.unquote(urllib.parse.urlparse(self.path).path)
        if path == "/" or path == "":
            self.serve_file("/index.html")
            return

        if path in PAGE_REWRITES:
            self.serve_file(PAGE_REWRITES[path])
            return

        if path in [f"/{slug}" for slug in CLUB_SLUGS]:
            slug = path.lstrip("/")
            self.send_response(302)
            self.send_header("Location", f"/club.html?club={slug}")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return

        self.serve_file(path)

    def serve_file(self, rel):
        target = os.path.normpath(os.path.join(ROOT, rel.lstrip("/")))
        if not target.startswith(ROOT):
            self.send_error(404, "Not Found")
            return
        if not os.path.isfile(target) and not os.path.splitext(rel)[1]:
            alt = target + ".html"
            if os.path.isfile(alt):
                target = alt
        if not os.path.isfile(target):
            target = os.path.join(ROOT, "404.html")
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            with open(target, "rb") as f:
                data = f.read()
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        ext = os.path.splitext(target)[1].lower()
        ctype = MIME.get(ext, "application/octet-stream")
        with open(target, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        sys.stderr.write("[%s] %s\n" % (self.address_string(), fmt % args))


if __name__ == "__main__":
    server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Zone7Handler)
    print(f"Zone 7 preview server running at http://localhost:{PORT}")
    print("Clean URLs work locally, mirroring vercel.json:")
    for k in list(PAGE_REWRITES) + [f"/{s}" for s in CLUB_SLUGS]:
        print(f"  http://localhost:{PORT}{k}")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass

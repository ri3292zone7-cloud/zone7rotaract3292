"""Local preview server for the Zone 7 site.

Mirrors vercel.json rewrites so clean URLs (e.g. /meetings) work locally
exactly as they do in production.

Usage:
    python serve.py          # serves on http://localhost:8000
    python serve.py 3000     # custom port
"""
import http.server
import os
import re
import sys
import urllib.parse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
ROOT = os.path.dirname(os.path.abspath(__file__))

PAGE_REWRITES = {
    "/about": "/about.html",
    "/search": "/search.html",
    "/gallery": "/gallery.html",
    "/project": "/project.html",
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
    "/store": "/React JS/dist-store/store-standalone.html",
    "/store-react.html": "/React JS/dist-store/store-standalone.html",
    "/merch": "/merch-react.html",
    "/vendor/paws-nepal": "/React JS/dist-vendor-pawsnepal/vendor-pawsnepal.html",
    "/vendor/paws-nepal/": "/React JS/dist-vendor-pawsnepal/vendor-pawsnepal.html",
    "/vendor/mannka-creation": "/React JS/dist-vendor-mannka/vendor-mannka.html",
    "/vendor/mannka-creation/": "/React JS/dist-vendor-mannka/vendor-mannka.html",
    "/vendors": "/React JS/dist-vendors/vendors-react.html",
    "/district-overview": "/district-overview.html",
    "/selftest": "/selftest.html",
    "/ne-about": "/ne-about.html",
    "/ne/about": "/ne-about.html",
    "/ne/join": "/join.html",
    "/club-tools": "/club-tools.html",
    "/club": "/club.html",
    "/pending-applications": "/pending-applications.html",
    "/rkt-quiz": "/rkt-quiz.html",
    "/admin": "/admin.html",
}

CLUB_SLUGS = [
    "balkumari", "baneshwor", "liberty", "kathmanduwest", "kathmanduheight",
    "sankhu", "newroadcity", "sukedhara", "tripureswor",
]

MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
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
            self.serve_file("/club.html")
            return

        self.serve_file(path, range_support=True)

    def serve_file(self, rel, range_support=False):
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
        size = os.path.getsize(target)
        range_header = self.headers.get("Range")
        if range_support and range_header:
            m = re.match(r"bytes=(\d*)-(\d*)", range_header)
            if m:
                start = int(m.group(1)) if m.group(1) else 0
                end = int(m.group(2)) if m.group(2) else size - 1
                if start >= size:
                    self.send_response(416)
                    self.send_header("Content-Range", "bytes */%d" % size)
                    self.end_headers()
                    return
                end = min(end, size - 1)
                length = end - start + 1
                self.send_response(206)
                self.send_header("Content-Type", ctype)
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
                self.send_header("Content-Length", str(length))
                self.end_headers()
                with open(target, "rb") as f:
                    f.seek(start)
                    self.wfile.write(f.read(length))
                return
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(size))
        self.end_headers()
        with open(target, "rb") as f:
            self.wfile.write(f.read())

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

#!/usr/bin/env python3
"""
Local dev server that respects vercel.json rewrites.
Usage: python serve-vercel.py [port] [directory]
Defaults: port 8000, directory = this file's folder.
"""
import http.server
import socketserver
import urllib.parse
import json
import os
import sys
import mimetypes

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
DOCROOT = sys.argv[2] if len(sys.argv) > 2 else os.path.dirname(os.path.abspath(__file__))

VERCEL_JSON = os.path.join(DOCROOT, "vercel.json")
rewrites = []
try:
    with open(VERCEL_JSON, "r", encoding="utf-8") as f:
        vercel = json.load(f)
        rewrites = vercel.get("rewrites", [])
    print(f"Loaded {len(rewrites)} rewrites from vercel.json")
except Exception as e:
    print(f"Warning: could not load vercel.json: {e}")

# Pre-decode sources for matching
for rw in rewrites:
    rw["_src_decoded"] = urllib.parse.unquote(rw["source"])
    if ":path*" in rw["source"]:
        base = rw["source"].split("/:path*")[0]
        rw["_base_decoded"] = urllib.parse.unquote(base)

class VercelHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DOCROOT, **kwargs)

    def translate_path(self, path):
        # path includes query string, e.g. "/club.html?club=balkumari" or "/vendors"
        parsed = urllib.parse.urlparse(path)
        raw_path = parsed.path
        path_decoded = urllib.parse.unquote(raw_path)

        # 1) check rewrites in order
        for rw in rewrites:
            src = rw["source"]
            if ":path*" in src:
                base_decoded = rw["_base_decoded"]
                if path_decoded == base_decoded or path_decoded.startswith(base_decoded + "/"):
                    dest = rw["destination"]
                    dest_path = dest.split("?")[0]
                    dest_decoded = urllib.parse.unquote(dest_path)
                    fpath = os.path.join(DOCROOT, dest_decoded.lstrip("/"))
                    # normalize to avoid traversal
                    fpath = os.path.normpath(fpath)
                    # print(f"Rewrite {path_decoded} -> {dest_decoded} => {fpath}")
                    return fpath
            else:
                src_decoded = rw["_src_decoded"]
                if path_decoded == src_decoded:
                    dest = rw["destination"]
                    dest_path = dest.split("?")[0]
                    dest_decoded = urllib.parse.unquote(dest_path)
                    fpath = os.path.join(DOCROOT, dest_decoded.lstrip("/"))
                    fpath = os.path.normpath(fpath)
                    return fpath

        # 2) no rewrite: handle "/" -> index.html
        if path_decoded == "/":
            return os.path.join(DOCROOT, "index.html")

        # 3) default: serve file as-is (decoded)
        fpath = os.path.join(DOCROOT, path_decoded.lstrip("/"))
        fpath = os.path.normpath(fpath)
        # If path is a directory, SimpleHTTPRequestHandler will look for index.html/index.htm
        return fpath

    def end_headers(self):
        # add cache headers similar to vercel.json for static assets (optional)
        path = urllib.parse.urlparse(self.path).path
        if any(path.endswith(ext) for ext in (".jpg",".jpeg",".png",".gif",".webp",".svg",".ico",".woff",".woff2",".ttf",".pdf")):
            self.send_header("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400")
        elif any(path.endswith(ext) for ext in (".css",".js")):
            self.send_header("Cache-Control", "public, max-age=86400, stale-while-revalidate=86400")
        super().end_headers()

    def log_message(self, format, *args):
        sys.stdout.write("%s - - [%s] %s\n" % (self.client_address[0], self.log_date_time_string(), format%args))

mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")

with socketserver.TCPServer(("", PORT), VercelHandler, bind_and_activate=False) as httpd:
    httpd.allow_reuse_address = True
    httpd.server_bind()
    httpd.server_activate()
    print(f"Serving {DOCROOT} at http://localhost:{PORT}/  (Vercel rewrites enabled)")
    print(f"Try: http://localhost:{PORT}/vendors  http://localhost:{PORT}/join  http://localhost:{PORT}/vendor/mannka-creation")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")

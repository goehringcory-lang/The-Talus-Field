#!/usr/bin/env python3
"""Local dev server for the editorial site, with SPA fallback.

Production runs as a Cloudflare Worker with static assets and
`not_found_handling: "single-page-application"` (see wrangler.jsonc).
Python's plain `http.server` does not, so a refresh on
`/articles/<slug>` or `/section/<id>` returns 404 locally instead of
the SPA shell. This wrapper matches production behavior: any request
whose path is not a real file (and does not look like a static asset
by extension) falls back to /index.html.

Usage: python serve.py [port]   # default port: 8766
"""

import http.server
import os
import socketserver
import sys
from urllib.parse import unquote, urlparse


class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = unquote(urlparse(self.path).path)
        rel = path.lstrip("/")
        candidate = os.path.normpath(os.path.join(os.getcwd(), rel))
        cwd = os.path.abspath(os.getcwd())

        if not candidate.startswith(cwd):
            return self.send_error(403)

        if os.path.isfile(candidate):
            return super().do_GET()
        if os.path.isdir(candidate) and os.path.isfile(os.path.join(candidate, "index.html")):
            return super().do_GET()

        _, ext = os.path.splitext(path)
        if ext:
            return super().do_GET()

        self.path = "/index.html"
        return super().do_GET()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8766
    with socketserver.TCPServer(("", port), SPAHandler) as httpd:
        print(f"Serving http://localhost:{port} with SPA fallback. Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass

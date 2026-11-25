#!/usr/bin/env python3
"""Serve the shipped static site (`docs/`) locally, with no dependencies.

The public product is a build-free static site: Vercel publishes `docs/`
directly (`vercel.json` sets an empty build command and `outputDirectory`).
This server exists so that the site can be reviewed and tested over real HTTP
(Playwright, the HTTP contract tests) without installing a bundler.

Usage
-----
    python3 scripts/serve_docs.py                     # http://0.0.0.0:4173
    python3 scripts/serve_docs.py --port 8080
    python3 scripts/serve_docs.py --root docs --port 4173 --bind 127.0.0.1
    python3 scripts/serve_docs.py --check             # self-test, then exit

Exit codes
----------
0  Server stopped cleanly (or `--check` passed).
2  Invalid arguments or missing document root.
"""

from __future__ import annotations

import argparse
import functools
import http.server
import socket
import socketserver
import sys
import threading
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ROOT = ROOT / "docs"
DEFAULT_PORT = 4173
DEFAULT_BIND = "0.0.0.0"

# Explicit MIME map: the browser refuses SVG/WebAssembly modules served as
# text/plain, and ES modules need a JavaScript MIME type.
EXTRA_TYPES = {
    ".svg": "image/svg+xml",
    ".webmanifest": "application/manifest+json",
    ".json": "application/json; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".cjs": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".woff2": "font/woff2",
    ".wasm": "application/wasm",
}

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "SAMEORIGIN",
    "Cache-Control": "no-store",
}


class StaticHandler(http.server.SimpleHTTPRequestHandler):
    """Static handler with deterministic MIME types and security headers."""

    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        **EXTRA_TYPES,
    }

    def end_headers(self) -> None:  # noqa: D102 - documented by the base class
        for name, value in SECURITY_HEADERS.items():
            self.send_header(name, value)
        super().end_headers()

    def log_message(self, format: str, *args: object) -> None:  # noqa: A002
        if getattr(self.server, "quiet", False):
            return
        super().log_message(format, *args)


class ThreadingStaticServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    """Threaded server so parallel browser requests do not queue."""

    daemon_threads = True
    allow_reuse_address = True

    def __init__(self, address: tuple[str, int], root: Path, quiet: bool = False) -> None:
        if not (root / "index.html").is_file() and not (root / "living-machine").is_dir():
            raise FileNotFoundError(f"no static site found under {root}")
        handler = functools.partial(StaticHandler, directory=str(root))
        super().__init__(address, handler)
        self.quiet = quiet
        self.root = root


def create_server(
    root: Path = DEFAULT_ROOT,
    port: int = DEFAULT_PORT,
    bind: str = DEFAULT_BIND,
    quiet: bool = True,
) -> ThreadingStaticServer:
    """Create (but do not start) a server bound to ``bind:port``."""
    return ThreadingStaticServer((bind, port), root=root, quiet=quiet)


def base_url(server: ThreadingStaticServer) -> str:
    host, port = server.server_address[:2]
    host = "127.0.0.1" if host in {"0.0.0.0", "::"} else str(host)
    return f"http://{host}:{port}"


def _self_check(server: ThreadingStaticServer) -> int:
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    url = base_url(server) + "/index.html"
    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            body = response.read()
            status = response.status
            ctype = response.headers.get("Content-Type", "")
    finally:
        server.shutdown()
        server.server_close()
    ok = status == 200 and b"<" in body and "text/html" in ctype
    print(f"{'OK  ' if ok else 'FAIL'} {url} -> {status} {ctype} ({len(body)} bytes)")
    return 0 if ok else 1


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="serve_docs.py",
        description="Serve the shipped static site over HTTP without any dependency.",
        epilog="The server is read-only and never writes to the document root.",
    )
    parser.add_argument("--root", type=Path, default=DEFAULT_ROOT, help="document root (default: docs/)")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help=f"TCP port (default: {DEFAULT_PORT})")
    parser.add_argument("--bind", default=DEFAULT_BIND, help=f"bind address (default: {DEFAULT_BIND})")
    parser.add_argument("--quiet", action="store_true", help="suppress per-request logging")
    parser.add_argument(
        "--check",
        action="store_true",
        help="start on an ephemeral port, request index.html, print the result and exit",
    )
    args = parser.parse_args(argv)

    root = args.root if args.root.is_absolute() else (Path.cwd() / args.root)
    try:
        server = create_server(root, port=0 if args.check else args.port, bind=args.bind, quiet=True)
    except FileNotFoundError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    except OSError as exc:
        print(f"error: cannot bind {args.bind}:{args.port}: {exc}", file=sys.stderr)
        return 2

    if args.check:
        return _self_check(server)

    server.quiet = args.quiet
    url = f"http://{'127.0.0.1' if args.bind in {'0.0.0.0', '::'} else args.bind}:{server.server_address[1]}"
    print(f"Serving {root} at {url} (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    sys.exit(main())

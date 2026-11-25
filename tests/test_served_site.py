"""End-to-end HTTP contract for the published static site.

The deliverable is a build-free static site. These tests start the real server
(`scripts/serve_docs.py`) on an ephemeral port and verify what a browser or a
crawler actually receives: status codes, MIME types, security headers, the 404
behaviour, MIME correctness for ES modules/manifests and resistance to path
traversal. They replace "does it render?" guesswork with observable facts and
need no browser, network or dependency.

Run: python -m unittest discover -s tests -p 'test_served_site.py' -v
"""

from __future__ import annotations

import contextlib
import email.message
import importlib.util
import socket
import sys
import threading
import unittest
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
SCRIPT = ROOT / "scripts" / "serve_docs.py"

_spec = importlib.util.spec_from_file_location("serve_docs", SCRIPT)
assert _spec and _spec.loader
serve_docs = importlib.util.module_from_spec(_spec)
sys.modules[_spec.name] = serve_docs
_spec.loader.exec_module(serve_docs)

SITEMAP_NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"


def free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


class ServedSiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.server = serve_docs.create_server(DOCS, port=0, bind="127.0.0.1", quiet=True)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = serve_docs.base_url(cls.server)

    @classmethod
    def tearDownClass(cls) -> None:
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(timeout=5)

    def request(self, path: str, method: str = "GET") -> tuple[int, "email.message.Message", bytes]:
        request = urllib.request.Request(self.base + path, method=method)
        try:
            with urllib.request.urlopen(request, timeout=10) as response:
                # The header object is case-insensitive, unlike a plain dict.
                return response.status, response.headers, response.read()
        except urllib.error.HTTPError as error:
            return error.code, error.headers, error.read()

    def test_landing_page_is_html_with_security_headers(self) -> None:
        status, headers, body = self.request("/index.html")
        self.assertEqual(status, 200)
        self.assertIn("text/html", headers.get("Content-Type", ""))
        self.assertEqual(headers.get("X-Content-Type-Options"), "nosniff")
        self.assertEqual(headers.get("Referrer-Policy"), "strict-origin-when-cross-origin")
        self.assertEqual(headers.get("X-Frame-Options"), "SAMEORIGIN")
        self.assertIn(b'<html dir="ltr" lang="es">', body)

    def test_every_published_page_answers_200(self) -> None:
        pages = sorted(p.relative_to(DOCS).as_posix() for p in DOCS.rglob("*.html"))
        self.assertGreaterEqual(len(pages), 8)
        for page in pages:
            with self.subTest(page=page):
                status, headers, _body = self.request("/" + page)
                self.assertEqual(status, 200)
                self.assertIn("text/html", headers.get("Content-Type", ""))

    def test_local_assets_are_served_with_correct_mime_types(self) -> None:
        expectations = {
            "/assets/a11y.css": "text/css",
            "/living-machine/manifest.webmanifest": "application/manifest+json",
            "/living-machine/studio-core.js": "text/javascript",
            "/living-machine/studio-icon.svg": "image/svg+xml",
        }
        for path, expected in expectations.items():
            with self.subTest(path=path):
                status, headers, _body = self.request(path)
                self.assertEqual(status, 200, path)
                self.assertIn(expected, headers.get("Content-Type", ""), path)

    def test_directory_urls_resolve_to_index(self) -> None:
        for path in ("/", "/living-machine/", "/projects/"):
            with self.subTest(path=path):
                status, headers, _body = self.request(path)
                self.assertEqual(status, 200)
                self.assertIn("text/html", headers.get("Content-Type", ""))

    def test_unknown_paths_return_404(self) -> None:
        status, _headers, _body = self.request("/no-existe.html")
        self.assertEqual(status, 404)

    def test_path_traversal_cannot_escape_the_document_root(self) -> None:
        for path in ("/../README.md", "/..%2fREADME.md", "/%2e%2e/.git/config"):
            with self.subTest(path=path):
                status, _headers, body = self.request(path)
                self.assertNotEqual(status, 200, path)
                self.assertNotIn(b"Pedro Belentani", body)

    def test_head_requests_are_supported(self) -> None:
        status, headers, body = self.request("/index.html", method="HEAD")
        self.assertEqual(status, 200)
        self.assertIn("text/html", headers.get("Content-Type", ""))
        self.assertEqual(body, b"")

    def test_sitemap_only_lists_published_documents(self) -> None:
        status, headers, body = self.request("/sitemap.xml")
        self.assertEqual(status, 200)
        self.assertIn("xml", headers.get("Content-Type", ""))
        root = ET.fromstring(body)
        locations = [element.text or "" for element in root.iter(f"{SITEMAP_NS}loc")]
        self.assertGreaterEqual(len(locations), 8)
        for location in locations:
            with self.subTest(location=location):
                self.assertTrue(location.startswith("https://belentani7.github.io/belentani7/"))
                relative = location.split("/belentani7/", 1)[1] or "index.html"
                target = DOCS / relative
                if relative.endswith("/"):
                    target = DOCS / relative / "index.html"
                self.assertTrue(target.exists(), location)

    def test_robots_points_at_the_sitemap(self) -> None:
        status, headers, body = self.request("/robots.txt")
        self.assertEqual(status, 200)
        self.assertIn("text/plain", headers.get("Content-Type", ""))
        self.assertIn(b"Sitemap:", body)


class ServerCliTests(unittest.TestCase):
    def test_self_check_exits_zero(self) -> None:
        import contextlib
        import io

        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            code = serve_docs.main(["--root", str(DOCS), "--check"])
        try:
            self.assertEqual(code, 0)
        finally:
            self.assertIsNotNone(output)
        self.assertIn("OK", output.getvalue())

    def test_missing_document_root_exits_two(self) -> None:
        import tempfile

        with tempfile.TemporaryDirectory() as empty:
            code = serve_docs.main(["--root", empty, "--port", str(free_port())])
        self.assertEqual(code, 2)

    def test_help_lists_usage(self) -> None:
        with open("/dev/null", "w", encoding="utf-8") as sink:
            with contextlib.redirect_stdout(sink), self.assertRaises(SystemExit) as raised:
                serve_docs.main(["--help"])
        self.assertEqual(raised.exception.code, 0)


if __name__ == "__main__":
    unittest.main()

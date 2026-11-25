"""Keep the published artifact and the repository mirrors in agreement.

`docs/` is the only tree that the deploy workflow uploads, while several pages
also exist at the repository root for the legacy branch deployment. A mirror
that silently drifts is worse than no mirror: it publishes a different page
than the one under review. These tests make the duplication explicit and
bounded, and keep the sitemap honest.

Run: python -m unittest discover -s tests -p 'test_published_mirrors.py' -v
"""

from __future__ import annotations

import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
SITEMAP_NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
SITE_URL = "https://belentani7.github.io/belentani7/"

# Pages published both at the repository root (legacy branch deploy) and inside
# `docs/` (current Pages/Vercel artifact). They must stay byte-identical.
MIRRORS = ("index.html", "docs.html", "accesibilidad.html", "privacidad.html", "404.html")

# Published documents that must not appear in the sitemap.
NOT_INDEXED = {"404.html"}


def sitemap_locations() -> list[str]:
    root = ET.parse(DOCS / "sitemap.xml").getroot()
    return [element.text or "" for element in root.iter(f"{SITEMAP_NS}loc")]


def sitemap_pages() -> set[str]:
    """Sitemap entries as document paths, expanding directory URLs."""
    pages = set()
    for location in sitemap_locations():
        relative = location[len(SITE_URL) :] or "index.html"
        pages.add(relative + "index.html" if relative.endswith("/") else relative)
    return pages


class MirrorTests(unittest.TestCase):
    def test_mirrors_are_byte_identical(self) -> None:
        for name in MIRRORS:
            with self.subTest(page=name):
                root_page = ROOT / name
                docs_page = DOCS / name
                self.assertTrue(root_page.is_file(), f"missing root page {name}")
                self.assertTrue(docs_page.is_file(), f"missing published page {name}")
                self.assertEqual(root_page.read_bytes(), docs_page.read_bytes(), name)

    def test_seo_files_are_published(self) -> None:
        for name in ("sitemap.xml", "robots.txt"):
            with self.subTest(file=name):
                self.assertTrue((ROOT / name).is_file(), name)
                self.assertEqual((ROOT / name).read_bytes(), (DOCS / name).read_bytes(), name)

    def test_published_tree_contains_no_symbolic_links(self) -> None:
        for path in DOCS.rglob("*"):
            self.assertFalse(path.is_symlink(), f"symlink in artifact: {path}")

    def test_robots_points_to_the_published_sitemap(self) -> None:
        robots = (DOCS / "robots.txt").read_text(encoding="utf-8")
        self.assertIn(f"{SITE_URL}sitemap.xml", robots)
        self.assertNotIn("Disallow: /", robots)


class SitemapTests(unittest.TestCase):
    def test_sitemap_is_well_formed_and_bounded(self) -> None:
        locations = sitemap_locations()
        self.assertGreaterEqual(len(locations), 8)
        self.assertEqual(len(locations), len(set(locations)), "duplicate <loc> entries")
        for location in locations:
            self.assertTrue(location.startswith(SITE_URL), location)

    def test_every_listed_url_exists_in_the_artifact(self) -> None:
        for location in sitemap_locations():
            relative = location[len(SITE_URL) :] or "index.html"
            target = DOCS / relative
            if relative.endswith("/"):
                target = target / "index.html"
            with self.subTest(url=location):
                self.assertTrue(target.is_file(), f"{location} is not in docs/")

    def test_main_pages_are_indexed(self) -> None:
        listed = sitemap_pages()
        for page in (
            "index.html",
            "catalogo.html",
            "auditoria.html",
            "docs.html",
            "accesibilidad.html",
            "privacidad.html",
            "living-machine/index.html",
            "living-machine/studio.html",
        ):
            with self.subTest(page=page):
                self.assertIn(page, listed)

    def test_published_pages_are_indexed_or_explicitly_excluded(self) -> None:
        listed = sitemap_pages()
        for page in sorted(DOCS.rglob("*.html")):
            relative = page.relative_to(DOCS).as_posix()
            if relative in NOT_INDEXED or relative.startswith("projects/secure-t/") or relative.startswith(
                "projects/music-os/"
            ):
                continue
            with self.subTest(page=relative):
                self.assertIn(relative, listed, f"{relative} is published but missing from sitemap.xml")


if __name__ == "__main__":
    unittest.main()

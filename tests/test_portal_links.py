"""Regression tests for the public project showcase; no external network."""
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "docs" / "index.html"
ROOT_HTML = ROOT / "index.html"
EXPECTED_DESTINATIONS = {
    "Belentani — The Experience": "https://github.com/belentani7/belentani.es",
    "secure-t": "https://github.com/belentani7/secure-t",
}
EXCLUDED_DESTINATIONS = (
    "https://github.com/belentani7/Belentani.cv-ai",
    "https://github.com/belentani7/ivy-la-vie",
    "https://github.com/belentani7/CARQUIDEC",
    "https://github.com/belentani7/linguaforge",
    "https://github.com/belentani7/belentani-omg-portal",
    "https://github.com/belentani7/ManosAbiertas",
    "https://judas-experience-13898.buildaispace.app/",
    "https://belentani7-profile.vercel.app/",
    "http://www.belentani.es/",
    "http://www.belentani.eu/",
)


class ProjectLinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.anchors = []
        self.active = None

    def handle_starttag(self, tag, attrs):
        if tag != "a":
            return
        values = dict(attrs)
        if "project-link" in values.get("class", "").split():
            self.active = {"attrs": values, "label": ""}

    def handle_data(self, data):
        if self.active is not None:
            self.active["label"] += data

    def handle_endtag(self, tag):
        if tag == "a" and self.active is not None:
            self.anchors.append(self.active)
            self.active = None


class PublicPortalTests(unittest.TestCase):
    def setUp(self):
        self.source = HTML.read_text(encoding="utf-8")
        parser = ProjectLinkParser()
        parser.feed(self.source)
        self.items = parser.anchors

    def test_exactly_two_verified_project_links(self):
        self.assertEqual(len(self.items), 2)
        for item in self.items:
            with self.subTest(label=item["label"].strip()):
                attrs = item["attrs"]
                url = urlsplit(attrs.get("href", ""))
                self.assertEqual(url.scheme, "https")
                self.assertEqual(url.netloc, "github.com")
                self.assertTrue(url.path.startswith("/belentani7/"))
                self.assertIn("Ver repositorio", item["label"])
        hrefs = [item["attrs"]["href"] for item in self.items]
        self.assertEqual(set(hrefs), set(EXPECTED_DESTINATIONS.values()))
        self.assertEqual(len(hrefs), len(set(hrefs)))

    def test_excluded_destinations_are_absent(self):
        hrefs = [item["attrs"].get("href") for item in self.items]
        for destination in EXCLUDED_DESTINATIONS:
            self.assertNotIn(destination, hrefs)

    def test_docs_mirror_is_byte_identical_to_root(self):
        self.assertEqual(self.source, ROOT_HTML.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()

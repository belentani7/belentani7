"""Regression tests for the branded public portal links; no external network."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import unittest

HTML = Path(__file__).resolve().parents[1] / "docs" / "index.html"


class PortalParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.anchors = []
        self.active = None

    def handle_starttag(self, tag, attrs):
        if tag != "a":
            return
        values = dict(attrs)
        if "portal-btn" in values.get("class", "").split():
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
        parser = PortalParser()
        parser.feed(self.source)
        self.items = parser.anchors

    def test_all_portal_buttons_have_safe_https_destinations(self):
        self.assertGreaterEqual(len(self.items), 6)
        for item in self.items:
            with self.subTest(label=item["label"].strip()):
                attrs = item["attrs"]
                url = urlsplit(attrs.get("href", ""))
                self.assertEqual(url.scheme, "https")
                self.assertTrue(url.netloc)
                self.assertEqual(attrs.get("target"), "_blank")
                self.assertTrue({"noopener", "noreferrer"} <= set(attrs.get("rel", "").split()))

    def test_each_project_points_to_its_own_verified_destination(self):
        expected = {
            "Judas Exp": "https://judas-experience-13898.buildaispace.app/",
            "Portfolio": "https://belentani7-profile.vercel.app/",
            "NOIACORE": "https://github.com/belentani7/noiacore",
        }
        for label, href in expected.items():
            with self.subTest(label=label):
                matches = [item for item in self.items if label in item["label"]]
                self.assertEqual(len(matches), 1, f"Missing or duplicated {label} button")
                self.assertEqual(matches[0]["attrs"]["href"], href)

    def test_no_brand_name_reuses_an_unrelated_project(self):
        urls = [item["attrs"].get("href") for item in self.items]
        self.assertEqual(len(urls), len(set(urls)))
        self.assertNotIn("http://www.belentani.es/", urls)
        self.assertNotIn("http://www.belentani.eu/", urls)


if __name__ == "__main__":
    unittest.main()

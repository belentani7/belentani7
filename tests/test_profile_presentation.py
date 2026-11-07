"""Regression checks for the public GitHub profile's credibility and presentation.

Run: python -m unittest discover -s tests -p 'test_profile_presentation.py' -v
No API key, external network or third-party Python package is required.
"""
import re
import unittest
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
README = ROOT / "README.md"
HERO = ROOT / "assets" / "profile-senior-systems-2026.svg"
ATLAS = ROOT / "assets" / "engineering-capabilities-2026.svg"
HISTORY = ROOT / "docs" / "profile-archive-2026-10-29.md"
EVIDENCE = ROOT / "docs" / "engineering-evidence-2026-10-29.md"
SELECTED_REPOSITORIES = (
    "safe-exec",
    "meta-skill",
    "keyrotor",
    "belentani-forge",
    "CARQUIDEC",
    "llm-vfx-orchestrator",
)
SVG_NS = "{http://www.w3.org/2000/svg}"


class PublicProfilePresentationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.readme = README.read_text(encoding="utf-8")

    def test_cover_is_local_accessible_and_not_a_tracker(self):
        self.assertTrue(HERO.is_file(), "The branded SVG file must exist")
        self.assertIn('src="./assets/profile-senior-systems-2026.svg"', self.readme)
        img = re.search(r"<img\b[^>]+>", self.readme, re.IGNORECASE | re.DOTALL)
        self.assertIsNotNone(img, "README needs its editorial image")
        self.assertRegex(img.group(0), r'\balt="[^"]{30,}"')
        self.assertNotRegex(img.group(0), r'\bsrc="https?://')

    def test_svg_is_static_safe_and_described(self):
        for asset in (HERO, ATLAS):
            with self.subTest(asset=asset.name):
                self._check_svg(asset)

    def _check_svg(self, asset):
        root = ET.parse(asset).getroot()
        self.assertEqual(root.tag, SVG_NS + "svg")
        self.assertEqual(root.attrib.get("role"), "img")
        self.assertTrue(root.attrib.get("viewBox"))
        title = root.find(SVG_NS + "title")
        desc = root.find(SVG_NS + "desc")
        self.assertIsNotNone(title)
        self.assertIsNotNone(desc)
        self.assertTrue((title.text or "").strip())
        self.assertGreaterEqual(len((desc.text or "").strip()), 45)
        banned = {"script", "foreignObject", "image", "iframe", "animate", "animateMotion", "set"}
        for node in root.iter():
            local_tag = node.tag.rsplit("}", 1)[-1]
            self.assertNotIn(local_tag, banned, f"Unexpected unsafe SVG element: {local_tag}")
            for attr, value in node.attrib.items():
                local_attr = attr.rsplit("}", 1)[-1].lower()
                self.assertFalse(local_attr.startswith("on"), f"Event attribute: {attr}")
                if local_attr in {"href", "src"}:
                    self.assertFalse(urlsplit(value).scheme, f"Remote SVG asset: {value}")
        self.assertLess(asset.stat().st_size, 30_000)

    def test_six_verified_public_repositories_are_distinct(self):
        # Verify the six prominent project cards, not incidental source links
        # in the broader README (which may legitimately repeat a URL).
        selected = self.readme.split("## Selected systems", 1)[1].split("## Products built for people", 1)[0]
        headline_urls = re.findall(
            r'<h3><a href="https://github\\.com/belentani7/([\\w.\\-]+)">0[1-6] / [^<]+</a></h3>',
            selected,
        )
        self.assertEqual(len(headline_urls), 6, "Six actual project cards must be rendered")
        self.assertEqual(set(headline_urls), set(SELECTED_REPOSITORIES))
        self.assertEqual(len(set(headline_urls)), len(headline_urls))

    def test_evidence_and_history_are_traceable(self):
        self.assertTrue(EVIDENCE.is_file())
        self.assertTrue(HISTORY.is_file())
        self.assertIn("./docs/engineering-evidence-2026-10-29.md", self.readme)
        self.assertIn("./docs/profile-archive-2026-10-29.md", self.readme)
        self.assertIn("cannot", self.readme.split("## Engineering evidence", 1)[1].lower())
        evidence = EVIDENCE.read_text(encoding="utf-8")
        self.assertIn("110 commit entries", evidence)
        self.assertIn("8,199", evidence)
        self.assertIn("7,034", evidence)
        self.assertIn("1,033", evidence)
        self.assertIn("not a distribution of hours", evidence)
        self.assertIn("not", evidence.lower())

    def test_professional_content_is_readable_and_bounded(self):
        self.assertIn("# Pedro Belentani", self.readme)
        self.assertIn("## Experience behind the code", self.readme)
        self.assertIn("## Contact", self.readme)
        self.assertIn("Trust & Safety", self.readme)
        self.assertIn("2018–2025", self.readme)
        self.assertIn("2016–2018", self.readme)
        self.assertLess(len(self.readme), 16_000)
        self.assertNotIn("replaced a 10-person team", self.readme.lower())
        self.assertNotIn("99.2% accuracy", self.readme.lower())

    def test_profile_requires_no_external_widgets(self):
        self.assertNotRegex(self.readme, r"<script\b|<iframe\b")
        self.assertNotIn("github-readme-stats.vercel.app", self.readme)
        self.assertNotIn("visitor-badge", self.readme)


if __name__ == "__main__":
    unittest.main()

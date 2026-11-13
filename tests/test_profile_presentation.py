"""Regression checks for the public GitHub profile's credibility and presentation.

The profile page is now an English, evidence-led résumé. The guarantees this
suite protects are unchanged in intent — one verified brand asset, local-only
imagery, traceable evidence, two distinct verified repositories, a bounded page
and no third-party widgets — so the checks follow the current carrier instead of
the retired Spanish layout.

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
HERO = ROOT / "assets" / "profile-editorial-2026.svg"
HISTORY = ROOT / "docs" / "profile-archive-2026-10-29.md"
EVIDENCE = ROOT / "docs" / "engineering-evidence-2026-10-29.md"
SELECTED_REPOSITORIES = (
    "belentani.es",
    "secure-t",
)
EXCLUDED_REPOSITORIES = (
    "Belentani.cv-ai",
    "ivy-la-vie",
    "CARQUIDEC",
    "linguaforge",
    "belentani-omg-portal",
    "ManosAbiertas",
)
FEATURED_SECTION = "## Featured systems"
EVIDENCE_SECTION = "## Evidence & operational governance"
SVG_NS = "{http://www.w3.org/2000/svg}"


def section(readme: str, heading: str) -> str:
    """Slice the body of a level-2 section, up to the next level-2 heading."""
    _, _, body = readme.partition(heading)
    assert body, f"missing section: {heading}"
    return re.split(r"\n## ", body, maxsplit=1)[0]


class PublicProfilePresentationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.readme = README.read_text(encoding="utf-8")

    def test_cover_is_local_accessible_and_not_a_tracker(self):
        self.assertTrue(HERO.is_file(), "The branded SVG file must exist")
        images = re.findall(r"<img\b[^>]+>", self.readme, re.IGNORECASE | re.DOTALL)
        self.assertTrue(images, "README needs its editorial image")
        for img in images:
            self.assertRegex(img, r'\balt="[^"]{30,}"')
            self.assertNotRegex(img, r'\bsrc="https?://')
        self.assertIn('src="./assets/profile-editorial-2026.svg"', self.readme)

    def test_svg_is_static_safe_and_described(self):
        root = ET.parse(HERO).getroot()
        self.assertEqual(root.tag, SVG_NS + "svg")
        self.assertEqual(root.attrib.get("role"), "img")
        self.assertTrue(root.attrib.get("viewBox"))
        title = root.find(SVG_NS + "title")
        desc = root.find(SVG_NS + "desc")
        self.assertIsNotNone(title)
        self.assertIsNotNone(desc)
        self.assertIn("Belentani", title.text or "")
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
        self.assertLess(HERO.stat().st_size, 30_000)

    def test_two_verified_public_repositories_are_distinct(self):
        featured = section(self.readme, FEATURED_SECTION)
        for repo in SELECTED_REPOSITORIES:
            self.assertIn(f"https://github.com/belentani7/{repo}", featured, repo)
        github_links = re.findall(r"https://github\.com/belentani7/([\w.\-]+)", featured)
        self.assertGreaterEqual(
            len(set(github_links)), 2, "at least two distinct verified repositories must be featured"
        )
        for repo in EXCLUDED_REPOSITORIES:
            self.assertNotIn(f"https://github.com/belentani7/{repo}", featured, repo)
            self.assertNotIn(f"https://github.com/belentani7/{repo}", self.readme, repo)

    def test_evidence_and_history_are_traceable(self):
        self.assertTrue(EVIDENCE.is_file())
        self.assertTrue(HISTORY.is_file())
        governance = section(self.readme, EVIDENCE_SECTION)
        self.assertIn("./docs/engineering-evidence-2026-10-29.md", governance)
        self.assertIn("./docs/profile-archive-2026-10-29.md", governance)
        lowered = governance.lower()
        self.assertIn("not verified", lowered)
        self.assertIn("claim → evidence → status", governance)
        evidence = EVIDENCE.read_text(encoding="utf-8")
        self.assertIn("110 commit entries", evidence)
        self.assertIn("8,199", evidence)
        self.assertIn("7,034", evidence)
        self.assertIn("1,033", evidence)
        self.assertIn("not a distribution of hours", evidence)

    def test_professional_content_is_readable_and_bounded(self):
        self.assertIn("pedro belentani", self.readme.lower())
        for heading in (FEATURED_SECTION, EVIDENCE_SECTION, "## Technology"):
            self.assertIn(heading, self.readme)
        self.assertLess(len(self.readme), 12_000)
        for claim in ("replaced a 10-person team", "99.2% accuracy", "10x faster", "world-class"):
            self.assertNotIn(claim, self.readme.lower())

    def test_profile_requires_no_external_widgets(self):
        self.assertNotRegex(self.readme, r"<script\b|<iframe\b")
        self.assertNotIn("github-readme-stats.vercel.app", self.readme)
        self.assertNotIn("visitor-badge", self.readme)


if __name__ == "__main__":
    unittest.main()

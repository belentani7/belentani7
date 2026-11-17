"""Keep the professional GitHub profile aligned with the canonical identity spec.

Offline, hermetic checks. These tests validate public copy and links only;
they do not verify the underlying engineering performance claims.
"""
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
README = ROOT / "README.md"
IDENTITY = ROOT / "docs" / "professional-identity.json"
POLICY = ROOT / "docs" / "PROFESSIONAL_IDENTITY.md"


class ProfessionalIdentityContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.identity = json.loads(IDENTITY.read_text(encoding="utf-8"))
        cls.readme = README.read_text(encoding="utf-8")

    def test_canonical_professional_role(self):
        self.assertEqual(self.identity["schema_version"], 1)
        self.assertIn(self.identity["role_statement"], self.readme[:600])
        self.assertIn(self.identity["public_name"], self.readme[:120])
        self.assertEqual(self.identity["creative_identity"]["placement"], "secondary_on_professional_surfaces")

    def test_public_six_project_contract(self):
        selected = self.readme.split("## Selected systems", 1)[1].split("\n## ", 1)[0]
        for repo in self.identity["featured_public_repositories"]:
            with self.subTest(repository=repo):
                self.assertIn(f"https://github.com/belentani7/{repo}", selected)
        self.assertEqual(len(self.identity["featured_public_repositories"]), 6)

    def test_artist_not_lead_professional_heading(self):
        lead = self.readme.split("## Selected systems", 1)[0].lower()
        self.assertNotIn("judas", lead)
        self.assertNotIn("singer", lead)
        self.assertIn("trust & safety", lead)
        self.assertIn("python", lead)
        self.assertIn("typescript", lead)

    def test_source_and_provenance_linked(self):
        self.assertIn("./docs/PROFESSIONAL_IDENTITY.md", self.readme)
        self.assertIn("professional-identity.json", POLICY.read_text(encoding="utf-8"))
        self.assertIn("TELUS — Trust & Safety operations", self.readme)
        self.assertNotIn("TELUS Digital / CCC", self.readme)
        self.assertNotIn("client brands", self.readme.lower())

    def test_no_inflated_seniority_claim(self):
        self.assertNotIn("Staff Engineer", self.readme)
        self.assertNotIn("client identity", self.readme.lower())
        self.assertNotIn("70% savings", self.readme)

if __name__ == "__main__":
    unittest.main()

"""Contract tests for the reproducible profile evidence audit.

Runs the audit as a subprocess so the test does not depend on package layout.
No network access and no third-party packages are required.
"""
import json
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "profile_evidence.py"
PROOF = ROOT / "PROOF.md"


class ProfileEvidenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        result = subprocess.run(
            [sys.executable, str(SCRIPT), "--json"],
            capture_output=True,
            text=True,
            encoding="utf-8",
            cwd=ROOT,
        )
        cls.returncode = result.returncode
        cls.stderr = result.stderr
        cls.evidence = json.loads(result.stdout)

    def test_audit_passes(self):
        self.assertEqual(self.returncode, 0, self.stderr)
        self.assertTrue(self.evidence["ok"])
        self.assertTrue(all(self.evidence["checks"].values()))

    def test_no_external_images_and_one_local_cover(self):
        self.assertEqual(self.evidence["images"]["external"], 0)
        self.assertGreaterEqual(self.evidence["images"]["local"], 1)

    def test_curation_is_bounded(self):
        self.assertGreaterEqual(self.evidence["selected_systems"], 3)
        self.assertGreaterEqual(len(self.evidence["featured_repositories"]), 3)
        self.assertLess(self.evidence["readme_bytes"], 12_000)

    def test_relative_links_resolve(self):
        self.assertEqual(self.evidence["missing_relative_links"], [])

    def test_featured_repositories_are_public(self):
        self.assertTrue(self.evidence["checks"]["featured_repositories_public"])
        self.assertTrue(all(self.evidence["featured_visibility"].values()))
        self.assertEqual(len(self.evidence["featured_repositories"]), 3)

    def test_proof_states_rubric_and_falsifiers(self):
        text = PROOF.read_text(encoding="utf-8")
        self.assertIn("## The rubric", text)
        self.assertIn("## Claim → evidence → status", text)
        self.assertIn("## What would falsify this page", text)
        self.assertIn("unverified", text.lower())

    def test_snapshot_is_generated(self):
        output = ROOT / "docs" / "profile-evidence.json"
        self.assertTrue(output.is_file())
        snapshot = json.loads(output.read_text(encoding="utf-8"))
        self.assertIn("generated_at", snapshot)
        self.assertTrue(snapshot["ok"])


if __name__ == "__main__":
    unittest.main()

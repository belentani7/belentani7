"""Offline tests: no GitHub token or network required."""
import sys
import unittest
from pathlib import Path
from urllib import error
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from pages_preflight import classify, fetch_status


class PagesPreflightTests(unittest.TestCase):
    def test_pages_not_created_is_not_a_build_failure(self):
        self.assertEqual(classify(404, {}), (False, "Pages is not configured, or is not visible to the workflow token."))

    def test_correct_workflow_source(self):
        self.assertTrue(classify(200, {"build_type": "workflow"})[0])

    def test_legacy_source_is_not_ready(self):
        self.assertFalse(classify(200, {"build_type": "legacy"})[0])

    def test_auth_failure_is_not_hidden(self):
        with self.assertRaisesRegex(RuntimeError, "HTTP 403"):
            classify(403, {})

    def test_unknown_server_error_is_not_hidden(self):
        with self.assertRaisesRegex(RuntimeError, "HTTP 500"):
            classify(500, {})

    def test_untrusted_repo_and_missing_token(self):
        with self.assertRaises(ValueError):
            fetch_status("../../other", "any")
        with self.assertRaises(ValueError):
            fetch_status("belentani7/belentani7", "")

    def test_network_404_is_read_as_missing_pages(self):
        fake_error = error.HTTPError(
            "https://api.github.com/repos/belentani7/belentani7/pages", 404,
            "Not Found", {}, None
        )
        with patch("pages_preflight.request.urlopen", side_effect=fake_error):
            self.assertEqual(fetch_status("belentani7/belentani7", "test-token"), (404, {}))


if __name__ == "__main__":
    unittest.main()

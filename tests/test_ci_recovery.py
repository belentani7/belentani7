"""Safety policy unit tests for bounded runner-only recovery."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from ci_recovery import eligible, safe_to_retry


def event(**overrides):
    run = {
        "name": "CI", "id": 1234, "status": "completed", "conclusion": "failure",
        "run_attempt": 1, "event": "push", "head_branch": "main",
        "head_repository": {"full_name": "belentani7/belentani7"},
    }
    run.update(overrides)
    return {"action": "completed",
            "repository": {"full_name": "belentani7/belentani7"},
            "workflow_run": run}


class RecoveryTests(unittest.TestCase):
    def test_exact_main_branch_first_attempt_only(self):
        repo = "belentani7/belentani7"
        self.assertTrue(eligible(event(), repo))
        for key, invalid in [
            ("run_attempt", 2), ("head_branch", "feature"),
            ("event", "pull_request"), ("conclusion", "cancelled"),
            ("name", "Self-Healing"), ("status", "in_progress"),
            ("id", "1"), ("head_repository", {"full_name": "attacker/fork"}),
        ]:
            self.assertFalse(eligible(event(**{key: invalid}), repo), key)

    def test_retry_only_before_any_user_step(self):
        setup_failure = {"conclusion": "failure",
                         "steps": [{"name": "Set up job", "conclusion": "failure"},
                                   {"name": "Run tests", "conclusion": "skipped"}]}
        self.assertTrue(safe_to_retry([setup_failure]))
        self.assertFalse(safe_to_retry([{"conclusion": "failure", "steps": [
            {"name": "Test suite", "conclusion": "failure"}]}]))
        self.assertFalse(safe_to_retry([{"conclusion": "failure", "steps": [
            {"name": "Set up job", "conclusion": "failure"},
            {"name": "Deploy", "conclusion": "failure"}]}]))
        self.assertFalse(safe_to_retry([{"conclusion": "timed_out", "steps": []}]))
        self.assertFalse(safe_to_retry([]))


if __name__ == "__main__":
    unittest.main()

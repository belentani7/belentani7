"""Deterministic tests for observable CI metrics; never require network access."""
import json
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from ci_health import fetch_runs, main, markdown, metrics, summarize

NOW = datetime(2026, 10, 28, 20, 0, tzinfo=timezone.utc)


def run(days_ago=1, outcome="success", event="push", branch="main", number=1):
    return {
        "id": number, "name": "CI", "event": event, "head_branch": branch,
        "status": "completed" if outcome != "pending" else "in_progress",
        "conclusion": None if outcome == "pending" else outcome,
        "created_at": (NOW - timedelta(days=days_ago)).isoformat(),
    }


class CiHealthTests(unittest.TestCase):
    def test_denominator_excludes_cancelled_pending_and_pull_requests(self):
        sample = [run(1, "success", number=1), run(1, "failure", number=2),
                  run(1, "cancelled", number=3), run(1, "pending", number=4),
                  run(1, "failure", event="pull_request", number=5),
                  run(1, "failure", branch="feature", number=6)]
        value = metrics(sample, NOW - timedelta(days=7), NOW)
        self.assertEqual(value["completed_measured"], 2)
        self.assertEqual(value["success_rate_pct"], 50.0)
        self.assertEqual(value["cancelled"], 1)
        self.assertEqual(value["pending"], 1)
        self.assertEqual(len(value["recent_failures"]), 1)

    def test_trend_and_previous_window(self):
        sample = [run(1, "success", number=i) for i in range(6)]
        sample += [run(10, "failure", number=i + 10) for i in range(6)]
        value = summarize(sample, "belentani7/belentani7", NOW, 7)
        self.assertEqual(value["trend"], "improving")
        self.assertEqual(value["status"], "meets_target")
        self.assertEqual(value["previous"]["success_rate_pct"], 0)

    def test_insufficient_and_truncated_are_not_silent_success(self):
        value = summarize([], "belentani7/belentani7", NOW, 7)
        self.assertEqual(value["status"], "unknown")
        self.assertEqual(value["trend"], "insufficient_data")
        sample = [run(1, "success", number=i) for i in range(5)]
        self.assertEqual(summarize(sample, "belentani7/belentani7", NOW, 7, True)["status"], "unknown")

    def test_report_sanitizes_untrusted_workflow_name(self):
        value = summarize([dict(run(1, "failure"), name="<script>|oops")],
                          "belentani7/belentani7", NOW)
        text = markdown(value)
        self.assertNotIn("<script>", text)
        self.assertIn("https://github.com/belentani7/belentani7/actions/runs/1", text)

    def test_main_offline_fixture_writes_parseable_artifacts(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixture = root / "runs.json"
            fixture.write_text(json.dumps({"workflow_runs": []}), encoding="utf-8")
            with self.assertRaises(SystemExit):
                main(["--days", "0", "--fixture", str(fixture)])
            self.assertEqual(main(["--fixture", str(fixture),
                                   "--json", str(root / "report.json"),
                                   "--markdown", str(root / "report.md")]), 0)
            self.assertEqual(json.loads((root / "report.json").read_text())["status"], "unknown")
            self.assertIn("# CI observability", (root / "report.md").read_text())

    def test_api_rejects_invalid_repository_before_request(self):
        with patch("ci_health.urlopen") as opener:
            with self.assertRaises(ValueError):
                fetch_runs("../unsafe", "", NOW)
            opener.assert_not_called()


if __name__ == "__main__":
    unittest.main()

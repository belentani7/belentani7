#!/usr/bin/env python3
"""Bounded read-only CI metrics; Python stdlib, no invented ROI or MTTR."""
import argparse
import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

VALID_REPO = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")
EVENTS = {"push", "workflow_dispatch", "schedule"}
OUTCOMES = {"success", "failure", "timed_out"}
TARGET = 95.0


def at(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)


def fetch_runs(repo, token, oldest, max_pages=5):
    if not VALID_REPO.fullmatch(repo) or any(part in {".", ".."} for part in repo.split("/")):
        raise ValueError("Expected safe owner/name")
    runs = []
    truncated = False
    # Filter server-side to avoid unrelated Dependabot dynamic/PR runs exhausting
    # the page budget. GitHub accepts one event filter per API request.
    for event in sorted(EVENTS):
        exhausted = True
        for page in range(1, max_pages + 1):
            query = urlencode({"branch": "main", "event": event,
                               "per_page": 100, "page": page})
            request = Request(
                f"https://api.github.com/repos/{repo}/actions/runs?{query}",
                headers={"Accept": "application/vnd.github+json",
                         "User-Agent": "belentani-ci-health/1",
                         **({"Authorization": f"Bearer {token}"} if token else {})},
            )
            with urlopen(request, timeout=20) as response:
                batch = json.load(response)["workflow_runs"]
            if not isinstance(batch, list):
                raise ValueError("Invalid GitHub API response")
            runs.extend(batch)
            if len(batch) < 100 or (batch and at(batch[-1]["created_at"]) < oldest):
                exhausted = False
                break
        truncated |= exhausted
    return runs, truncated


def metrics(runs, start, end):
    selected = [r for r in runs if r.get("head_branch") == "main"
                and r.get("event") in EVENTS and start <= at(r["created_at"]) < end]
    completed = [r for r in selected if r.get("status") == "completed"
                 and r.get("conclusion") in OUTCOMES]
    success = sum(r["conclusion"] == "success" for r in completed)
    failed = sorted((r for r in completed if r["conclusion"] != "success"),
                    key=lambda r: r["created_at"], reverse=True)
    return {
        "observed": len(selected),
        "completed_measured": len(completed),
        "success": success,
        "failed": len(failed),
        "cancelled": sum(r.get("conclusion") == "cancelled" for r in selected),
        "pending": sum(r.get("status") != "completed" for r in selected),
        "success_rate_pct": round(100 * success / len(completed), 2) if completed else None,
        "recent_failures": [
            {"id": int(r["id"]), "name": str(r.get("name") or "Unnamed")[:100],
             "conclusion": r["conclusion"], "created_at": r["created_at"]}
            for r in failed[:10]
        ],
    }


def summarize(runs, repo, now, days=7, truncated=False):
    current = metrics(runs, now - timedelta(days=days), now)
    previous = metrics(runs, now - timedelta(days=2 * days), now - timedelta(days=days))
    if min(current["completed_measured"], previous["completed_measured"]) < 5:
        trend = "insufficient_data"
    else:
        delta = current["success_rate_pct"] - previous["success_rate_pct"]
        trend = "improving" if delta > 1 else "degrading" if delta < -1 else "stable"
    status = ("unknown" if truncated or current["success_rate_pct"] is None else
              "meets_target" if current["success_rate_pct"] >= TARGET else "below_target")
    return {
        "schema_version": 1, "repository": repo, "generated_at_utc": now.isoformat(),
        "window_days": days, "target_success_rate_pct": TARGET,
        "data_truncated": truncated, "status": status, "trend": trend,
        "current": current, "previous": previous,
        "limitations": [
            "Sample: main branch push, schedule and workflow_dispatch runs only.",
            "Cancelled runs are excluded from the success-rate denominator.",
            "Success rate is not uptime, deployment success, MTTR or auto-fix rate.",
            "If pagination is truncated, no SLO status is certified.",
        ],
    }


def md(value):
    return re.sub(r"[\r\n|<>]", " ", str(value)).replace(chr(96), "'")[:120]


def markdown(report):
    current, previous = report["current"], report["previous"]
    def fmt(value):
        return "N/A" if value is None else f"{value:.2f}%"
    lines = [
        "# CI observability — measured GitHub Actions data",
        f"Repository: {md(report['repository'])} · {md(report['generated_at_utc'])}",
        f"Status: **{report['status']}** · Trend: **{report['trend']}**",
        "",
        "| Window | Completed | Success | Failed | Success rate |",
        "|---|---:|---:|---:|---:|",
        f"| Current {report['window_days']} days | {current['completed_measured']} | {current['success']} | {current['failed']} | {fmt(current['success_rate_pct'])} |",
        f"| Previous {report['window_days']} days | {previous['completed_measured']} | {previous['success']} | {previous['failed']} | {fmt(previous['success_rate_pct'])} |",
        "",
        f"Target: {TARGET:.0f}% (goal, not a guarantee).",
        f"Cancelled: {current['cancelled']} · Pending: {current['pending']} · Truncated: {report['data_truncated']}",
        "",
        "## Recent failures",
    ]
    for item in current["recent_failures"]:
        url = f"https://github.com/{report['repository']}/actions/runs/{item['id']}"
        lines.append(f"- [{md(item['name'])} #{item['id']}]({url}): {md(item['conclusion'])}")
    if not current["recent_failures"]:
        lines.append("No measured failures in the current sample.")
    lines += ["", "## Limitations", *[f"- {md(line)}" for line in report["limitations"]]]
    return "\n".join(lines) + "\n"


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--repo", default=os.getenv("GITHUB_REPOSITORY", "belentani7/belentani7"))
    p.add_argument("--days", type=int, default=7)
    p.add_argument("--json", type=Path, default=Path("ci-health.json"))
    p.add_argument("--markdown", type=Path, default=Path("ci-health.md"))
    p.add_argument("--fixture", type=Path, help="Offline test data: JSON with workflow_runs")
    args = p.parse_args(argv)
    if not (1 <= args.days <= 30) or not VALID_REPO.fullmatch(args.repo) or any(part in {".", ".."} for part in args.repo.split("/")):
        p.error("Expected --repo owner/name and --days in 1..30")
    now = datetime.now(timezone.utc)
    try:
        if args.fixture:
            payload = json.loads(args.fixture.read_text(encoding="utf-8"))
            runs, truncated = payload["workflow_runs"], payload.get("truncated", False)
        else:
            runs, truncated = fetch_runs(args.repo, os.getenv("GITHUB_TOKEN", ""),
                                         now - timedelta(days=2 * args.days))
        report = summarize(runs, args.repo, now, args.days, bool(truncated))
        args.json.parent.mkdir(parents=True, exist_ok=True)
        args.markdown.parent.mkdir(parents=True, exist_ok=True)
        args.json.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        args.markdown.write_text(markdown(report), encoding="utf-8")
        print(f"CI observability: {report['status']}, {report['current']['completed_measured']} completed")
        return 0
    except (HTTPError, URLError, OSError, KeyError, TypeError, ValueError) as error:
        print(f"Observability unavailable: {type(error).__name__}: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())

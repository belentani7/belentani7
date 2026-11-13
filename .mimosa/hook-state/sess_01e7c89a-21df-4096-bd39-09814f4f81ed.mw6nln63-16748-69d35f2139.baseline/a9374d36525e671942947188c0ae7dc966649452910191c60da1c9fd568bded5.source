#!/usr/bin/env python3
"""One bounded automatic retry for runner setup failures; never retry code failures."""
import json
import os
import re
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

SAFE_REPO = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")
WORKFLOWS = {"CI", "Build", "Quality", "CodeQL Analysis", "Repository Security"}


def eligible(event, repo):
    run = event.get("workflow_run") or {}
    return (
        event.get("action") == "completed"
        and (event.get("repository") or {}).get("full_name") == repo
        and (run.get("head_repository") or {}).get("full_name") == repo
        and run.get("name") in WORKFLOWS
        and run.get("head_branch") == "main"
        and run.get("event") in {"push", "schedule", "workflow_dispatch"}
        and run.get("status") == "completed"
        and run.get("conclusion") == "failure"
        and run.get("run_attempt") == 1
        and isinstance(run.get("id"), int) and run["id"] > 0
    )


def safe_to_retry(jobs):
    """All failed jobs must have failed ONLY during runner setup (no user code)."""
    failures = [job for job in jobs if job.get("conclusion") == "failure"]
    if not failures or any(job.get("conclusion") not in {"failure", "success", "skipped"} for job in jobs):
        return False
    for job in failures:
        broken = [s for s in job.get("steps", []) if s.get("conclusion") == "failure"]
        if (len(broken) != 1 or broken[0].get("name") != "Set up job"
                or broken[0].get("number") != 1):
            return False
    return True


def api(url, token, method="GET"):
    request = Request(
        url, method=method, data=b"{}" if method == "POST" else None,
        headers={"Authorization": f"Bearer {token}",
                 "Accept": "application/vnd.github+json",
                 "User-Agent": "belentani-ci-recovery/1",
                 "X-GitHub-Api-Version": "2022-11-28"},
    )
    with urlopen(request, timeout=20) as response:
        if method == "POST":
            return {"status": response.status}
        return json.load(response)


def main():
    repo = os.getenv("GITHUB_REPOSITORY", "")
    token = os.getenv("GITHUB_TOKEN", "")
    event_path = os.getenv("GITHUB_EVENT_PATH", "")
    if not SAFE_REPO.fullmatch(repo) or any(part in {".", ".."} for part in repo.split("/")):
        print("Unsafe or absent repository identifier; no retry.")
        return 0
    if not event_path:
        print("No workflow_run event; no retry.")
        return 0
    try:
        event = json.loads(Path(event_path).read_text(encoding="utf-8"))
        if not eligible(event, repo):
            print("Not an eligible main-branch first-attempt failure; no retry.")
            return 0
        if not token:
            print("Missing scoped GITHUB_TOKEN", file=sys.stderr)
            return 2
        run_id = event["workflow_run"]["id"]
        base = f"https://api.github.com/repos/{repo}/actions/runs/{run_id}"
        jobs = api(base + "/jobs?per_page=100", token)
        if jobs.get("total_count", 0) > 100 or not safe_to_retry(jobs.get("jobs", [])):
            print("Failure did not satisfy strict runner-only allowlist; no retry.")
            return 0
        result = api(base + "/rerun-failed-jobs", token, method="POST")
        print(f"Requested one retry of runner-setup-only failure for run {run_id}: HTTP {result['status']}")
        return 0
    except (HTTPError, URLError, OSError, KeyError, TypeError, ValueError) as error:
        print(f"Recovery API error: {type(error).__name__}: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())

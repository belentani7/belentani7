#!/usr/bin/env python3
"""Read-only GitHub Pages readiness check; never configures or deploys Pages."""
import json
import os
import re
import sys
from pathlib import Path
from urllib import error, request

API = "https://api.github.com/repos"


def classify(status: int, payload: dict) -> tuple[bool, str]:
    """Distinguish missing setup from actual API failures."""
    if status == 404:
        return False, "Pages is not configured, or is not visible to the workflow token."
    if status != 200:
        raise RuntimeError(f"Pages API returned HTTP {status}; deployment cannot be checked.")
    if payload.get("build_type") != "workflow":
        return False, "Pages is not configured with GitHub Actions as its publishing source."
    return True, "GitHub Pages is configured for GitHub Actions."


def fetch_status(repository: str, token: str) -> tuple[int, dict]:
    if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository):
        raise ValueError("Invalid GITHUB_REPOSITORY value")
    if not token:
        raise ValueError("Missing GITHUB_TOKEN")
    req = request.Request(
        f"{API}/{repository}/pages",
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "User-Agent": "belentani-pages-readiness/1.0",
        },
    )
    try:
        with request.urlopen(req, timeout=12) as response:
            status = response.status
            payload = json.load(response)
    except error.HTTPError as exc:
        # A missing Pages site is an external configuration dependency, not a broken build.
        # Other API errors (especially 401/403/5xx) must remain visible failures.
        return exc.code, {}
    if not isinstance(payload, dict):
        raise ValueError("Unexpected GitHub Pages API response")
    return status, payload


def main() -> int:
    try:
        status, payload = fetch_status(
            os.environ.get("GITHUB_REPOSITORY", ""),
            os.environ.get("GITHUB_TOKEN", ""),
        )
        ready, message = classify(status, payload)
    except (ValueError, RuntimeError, error.URLError) as exc:
        print(f"::error title=Pages readiness check failed::{type(exc).__name__}: {exc}")
        return 1
    output = os.environ.get("GITHUB_OUTPUT")
    if output:
        with Path(output).open("a", encoding="utf-8") as file:
            file.write(f"ready={'true' if ready else 'false'}\n")
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with Path(summary).open("a", encoding="utf-8") as file:
            file.write("## GitHub Pages preflight\n\n")
            file.write(f"- API status: HTTP {status}\n")
            file.write(f"- Deployment ready: {'yes' if ready else 'no'}\n")
            file.write(f"- Reason: {message}\n")
            if not ready:
                file.write(
                    "- Action: Settings → Pages → Build and deployment → "
                    "Source → GitHub Actions, then rerun this workflow.\n"
                )
    if ready:
        print("GitHub Pages publishing source verified.")
    else:
        print(f"::notice title=Pages deployment skipped::{message}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

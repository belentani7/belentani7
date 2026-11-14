#!/usr/bin/env python3
"""Reproducible evidence audit for the public GitHub profile.

The profile makes a small number of claims. This script turns the ones that can
be checked from the repository into machine-readable evidence: asset locality,
link integrity, curation bounds and the presence of the evidence contract.

Usage:
    python scripts/profile_evidence.py --json
    python scripts/profile_evidence.py --write

Exit code 0 means every check passed. Exit code 1 means the profile drifted
from its own contract.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
README = ROOT / "README.md"
PROOF = ROOT / "PROOF.md"
HERO = ROOT / "assets" / "hero-2026.svg"
PRESENTATION_TESTS = ROOT / "tests" / "test_profile_presentation.py"
OUTPUT = ROOT / "docs" / "profile-evidence.json"

IMG_TAG = re.compile(r"<img\b[^>]*>", re.IGNORECASE | re.DOTALL)
MD_IMAGE = re.compile(r"!\[[^\]]*\]\(([^)\s]+)")
ATTR_SRC = re.compile(r'\bsrc="([^"]+)"', re.IGNORECASE)
MD_LINK = re.compile(r"(?<!!)\[[^\]]*\]\(([^)\s]+)")
SYSTEM_HEADING = re.compile(r"^###\s+\d{2}\s+—\s+", re.MULTILINE)
TEST_DEF = re.compile(r"^\s*def test_", re.MULTILINE)
# The audit writes this file; it should not fail the link check on a clean run.
GENERATED = {"docs/profile-evidence.json"}
API_ROOT = "https://api.github.com/repos/belentani7/"


def _is_external(target: str) -> bool:
    scheme = urlsplit(target).scheme.lower()
    return scheme in {"http", "https", "data"}


def _local_target(target: str) -> str | None:
    if not target or target.startswith("#"):
        return None
    parsed = urlsplit(target)
    if parsed.scheme or parsed.netloc or target.startswith("mailto:"):
        return None
    return parsed.path


def _public_visibility(repositories: list[str]) -> dict[str, bool]:
    """Ask the public GitHub API whether each featured repository is public.

    Uses GITHUB_TOKEN when available to avoid anonymous rate limits; the
    ``private`` field is authoritative either way.
    """
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    results: dict[str, bool] = {}
    for repo in repositories:
        request = urllib.request.Request(
            API_ROOT + repo,
            headers={
                "Accept": "application/vnd.github+json",
                "User-Agent": "profile-evidence-audit",
            },
        )
        if token:
            request.add_header("Authorization", f"Bearer {token}")
        try:
            with urllib.request.urlopen(request, timeout=12) as response:
                payload = json.load(response)
                results[repo] = response.status == 200 and payload.get("private") is False
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError):
            results[repo] = False
    return results


def audit() -> dict:
    text = README.read_text(encoding="utf-8")
    readme_bytes = len(text.encode("utf-8"))
    hero_bytes = HERO.stat().st_size if HERO.is_file() else 0

    images = [ATTR_SRC.search(tag).group(1) for tag in IMG_TAG.findall(text) if ATTR_SRC.search(tag)]
    images += MD_IMAGE.findall(text)
    external_images = [src for src in images if _is_external(src)]
    local_images = [src for src in images if not _is_external(src)]

    links = MD_LINK.findall(text)
    relative_links = [link for link in links if _local_target(link)]
    missing_links = sorted(
        link
        for link in relative_links
        if not (ROOT / (_local_target(link) or "")).exists()
        and os.path.normpath(_local_target(link) or "") not in GENERATED
    )

    selected = text.split("## Selected systems", 1)[1].split("\n## ", 1)[0] if "## Selected systems" in text else ""
    system_count = len(SYSTEM_HEADING.findall(selected))
    github_links = sorted(set(re.findall(r"https://github\.com/belentani7/([\w.\-]+)", selected)))
    visibility = _public_visibility(github_links)

    checks = {
        "readme_under_12k": readme_bytes < 12_000,
        "hero_is_local_and_small": 0 < hero_bytes < 30_000,
        "no_external_images": not external_images,
        "at_least_one_local_image": bool(local_images),
        "no_missing_relative_links": not missing_links,
        "at_least_three_systems": system_count >= 3,
        "at_least_three_distinct_repos": len(github_links) >= 3,
        "featured_repositories_public": bool(visibility) and all(visibility.values()),
        "proof_document_exists": PROOF.is_file(),
    }

    return {
        "generated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "readme_bytes": readme_bytes,
        "readme_words": len(text.split()),
        "hero_bytes": hero_bytes,
        "images": {"total": len(images), "external": len(external_images), "local": len(local_images)},
        "external_images": external_images,
        "relative_links": len(relative_links),
        "missing_relative_links": missing_links,
        "selected_systems": system_count,
        "featured_repositories": github_links,
        "featured_visibility": visibility,
        "presentation_tests": len(TEST_DEF.findall(PRESENTATION_TESTS.read_text(encoding="utf-8")))
        if PRESENTATION_TESTS.is_file()
        else 0,
        "checks": checks,
        "ok": all(checks.values()),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit the public profile against its evidence contract.")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--json", action="store_true", help="print the evidence as JSON")
    group.add_argument("--write", action="store_true", help=f"write {OUTPUT.relative_to(ROOT)}")
    args = parser.parse_args()

    evidence = audit()

    if args.write:
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT.write_text(json.dumps(evidence, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"wrote {OUTPUT.relative_to(ROOT)}")
    elif args.json:
        print(json.dumps(evidence, indent=2, ensure_ascii=False))
    else:
        for name, passed in evidence["checks"].items():
            print(f"{'PASS' if passed else 'FAIL'}  {name}")
        print(f"readme={evidence['readme_bytes']}B systems={evidence['selected_systems']} "
              f"external_images={evidence['images']['external']} missing_links={len(evidence['missing_relative_links'])}")

    return 0 if evidence["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())

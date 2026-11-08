#!/usr/bin/env python3
"""Dependency-free release checks for the curated public profile landing.

This static gate complements browser and local HTML verification. It cannot
assert deployment availability, visual contrast, or runtime behavior.
"""
from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ALLOWED_EXTERNAL_HOSTS = {"github.com", "belentani.es", "www.belentani.es"}


class Document(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.tags: dict[str, int] = {}
        self.ids: set[str] = set()
        self.fragments: set[str] = set()
        self.refs: set[str] = set()
        self.errors: list[str] = []
        self.has_nav_name = False
        self.has_skip_link = False
        self.external_assets: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.tags[tag] = self.tags.get(tag, 0) + 1
        d = dict(attrs)
        if d.get("id"):
            if d["id"] in self.ids:
                self.errors.append(f"Duplicate id: {d['id']}")
            self.ids.add(d["id"])
        if d.get("aria-labelledby"):
            self.refs.update(d["aria-labelledby"].split())
        if tag == "nav" and d.get("aria-label"):
            self.has_nav_name = True
        if tag == "a" and d.get("href", "").startswith("#"):
            self.fragments.add(d["href"][1:])
            if d.get("class", "").split() and "skip" in d["class"].split():
                self.has_skip_link = True
        if tag == "img" and not d.get("alt"):
            self.errors.append("Image without alt text")
        if tag in {"script", "iframe", "img", "source", "video", "audio"} and d.get("src"):
            self.external_assets.append(d["src"])
        if tag == "link" and "stylesheet" in (d.get("rel") or "").split():
            self.errors.append("External stylesheet is not allowed")
        if tag == "a" and d.get("href") and not d["href"].startswith("#"):
            link = d["href"]
            url = urlsplit(link)
            if url.scheme != "https" or url.hostname not in ALLOWED_EXTERNAL_HOSTS:
                self.errors.append(f"Unapproved external navigation: {link}")
            if url.hostname == "github.com" and "/belentani7" not in url.path:
                self.errors.append(f"Unexpected GitHub destination: {link}")


def inspect(path: Path) -> dict:
    findings: list[str] = []
    source = path.read_text(encoding="utf-8")
    document = Document()
    document.feed(source)
    document.close()
    findings.extend(document.errors)
    for tag in ("html", "head", "body", "main", "h1", "nav", "footer"):
        if document.tags.get(tag) != 1:
            findings.append(f"Expected exactly one {tag}, got {document.tags.get(tag, 0)}")
    if not document.has_skip_link:
        findings.append("Missing keyboard skip link")
    if not document.has_nav_name:
        findings.append("Missing named main navigation")
    for ref in sorted(document.fragments | document.refs):
        if ref not in document.ids:
            findings.append(f"Broken anchor or accessible label: {ref}")
    if document.external_assets:
        findings.append(f"Assets must be inline: {document.external_assets}")
    if not re.search(r"prefers-reduced-motion\s*:\s*reduce", source):
        findings.append("Missing reduced-motion preference")
    if ":focus-visible" not in source:
        findings.append("Missing visible keyboard focus styling")
    if not re.search(r"--bg\s*:\s*#000(?:000)?\b", source):
        findings.append("Black design token must be pure #000000")
    if not re.search(r"<style\b", source) or not re.search(r"<svg\b", source):
        findings.append("CSS and editorial SVG must be inline")
    if re.search(r"\b(?:TODO|FIXME)\b|PLACEHOLDER|LOREM IPSUM", source):
        findings.append("Unfinished placeholder markers")
    if re.search(r"(?:mailto:|<script[^>]+src=|@import|fonts\.googleapis|fonts\.gstatic|cdnjs|unpkg|jsdelivr)", source, flags=re.I):
        findings.append("External dependency or personal email reference")
    if "Belentani —" not in source or "https://github.com/belentani7/belentani.es" not in source:
        findings.append("Verified project reference missing")
    for excluded in ("ivy-la-vie", "CARQUIDEC", "Belentani.cv-ai"):
        if excluded in source:
            findings.append(f"Excluded unfinished product in landing: {excluded}")
    return {"ok": not findings, "file": str(path), "checks": 16, "findings": findings}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("file", nargs="?", type=Path, default=Path(__file__).resolve().parent.parent / "index.html")
    arguments = parser.parse_args()
    result = inspect(arguments.file)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

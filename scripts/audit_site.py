#!/usr/bin/env python3
"""Static audit of the shipped site: accessibility, SEO, hygiene and weight.

The public product of this repository is a build-free static site. Nothing in
CI lints its HTML/CSS, so this tool turns the repository's editorial rules
(`AGENTS.md`: contrast, semantic markup, touch targets, states, no third-party
widgets) into executable checks that run offline and with no dependencies.

Usage
-----
    python3 scripts/audit_site.py                    # audit docs/ (the deployed root)
    python3 scripts/audit_site.py --include-root     # also audit the root *.html mirrors
    python3 scripts/audit_site.py --json             # machine-readable report
    python3 scripts/audit_site.py --write report.json --strict
    python3 scripts/audit_site.py --help

Exit codes
----------
0  No errors found (and no warnings either, with --strict).
1  Errors found (or warnings, with --strict).
2  Bad arguments or empty document root.

Rules
-----
Every finding carries a slug and a severity. Errors are objective defects that
break the document or a guarantee (missing `lang`, duplicate `id`, dead link,
unlabelled image). Warnings are quality signals worth a human decision (title
length, inlined byte budget, missing `width`/`height`). Severity levels can be
inspected with `--list-rules`.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_TARGET = ROOT / "docs"

# Byte budgets for one HTML document. The heaviest shipped page is around
# 70 kB, so 300 kB leaves room while catching accidental asset inlining.
DEFAULT_MAX_BYTES = 300_000
INLINE_BUDGET_BYTES = 80_000
TITLE_RANGE = (15, 70)
DESCRIPTION_RANGE = (50, 170)

VOID_ELEMENTS = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}

HEADING_TAGS = {"h1", "h2", "h3", "h4", "h5", "h6"}
LANDMARKS = {"main", "nav", "header", "footer", "aside"}
TEXT_INPUTS = {"text", "search", "email", "url", "tel", "password", "number"}

# Directories assembled in CI from pinned external commits by
# `scripts/publish_project_sites.py`; they do not exist in the checkout.
GENERATED_PATHS = ("docs/projects/secure-t", "docs/projects/music-os")

RULES = {
    "doctype-missing": ("error", "Document does not start with <!doctype html>."),
    "lang-missing": ("error", "Root <html> element has no lang attribute."),
    "charset-missing": ("error", "No <meta charset> declared in <head>."),
    "viewport-missing": ("error", "No responsive <meta name=viewport> declared."),
    "title-missing": ("error", "Document has no non-empty <title>."),
    "meta-description-missing": ("error", "Document has no meta description."),
    "h1-count": ("error", "Document must contain exactly one <h1>."),
    "heading-order": ("warning", "Heading levels jump by more than one."),
    "img-alt-missing": ("error", "<img> without an alt attribute."),
    "img-dimensions": ("warning", "Raster <img> without intrinsic width/height."),
    "id-duplicate": ("error", "The same id is used more than once."),
    "aria-ref-missing": ("error", "aria-labelledby/aria-describedby points to a missing id."),
    "anchor-target-missing": ("error", "In-page #fragment link has no matching id."),
    "link-target-missing": ("error", "Relative link points to a file that does not exist."),
    "link-text-empty": ("error", "<a> element has no accessible text."),
    "target-blank-rel": ("error", 'target="_blank" without rel="noopener".'),
    "inline-handler": ("warning", "Inline on* event handler attribute."),
    "input-unlabelled": ("error", "Form control without a label, aria-label or aria-labelledby."),
    "button-unlabelled": ("error", "<button> without accessible text."),
    "page-too-heavy": ("error", "Document exceeds the byte budget."),
    "inline-budget": ("warning", "Inlined CSS+JS exceeds the inline budget."),
    "external-resource": ("warning", "Page requests a third-party resource."),
    "main-missing": ("warning", "Page has no <main> landmark."),
    "tabindex-positive": ("error", "Positive tabindex breaks the natural focus order."),
    "title-length": ("warning", "Title length outside the recommended range."),
    "description-length": ("warning", "Meta description length outside the recommended range."),
    "duplicate-title": ("warning", "The same <title> is reused by another page."),
    "duplicate-description": ("warning", "The same meta description is reused by another page."),
    "deprecated-element": ("warning", "Obsolete HTML element."),
    "skip-link-missing": ("warning", "Page with a <nav> has no skip link to #main."),
}


@dataclass
class Finding:
    page: str
    line: int
    rule: str
    message: str

    @property
    def severity(self) -> str:
        return RULES[self.rule][0]

    def as_dict(self) -> dict[str, object]:
        return {
            "page": self.page,
            "line": self.line,
            "rule": self.rule,
            "severity": self.severity,
            "message": self.message,
        }


@dataclass
class PageReport:
    path: Path
    relative: str
    bytes: int = 0
    inline_bytes: int = 0
    external_resources: list[str] = field(default_factory=list)
    title: str = ""
    description: str = ""
    findings: list[Finding] = field(default_factory=list)

    def add(self, line: int, rule: str, message: str) -> None:
        self.findings.append(Finding(self.relative, line, rule, message))

    def as_dict(self) -> dict[str, object]:
        return {
            "page": self.relative,
            "bytes": self.bytes,
            "inline_bytes": self.inline_bytes,
            "external_resources": self.external_resources,
            "title": self.title,
            "description": self.description,
            "findings": [f.as_dict() for f in self.findings],
        }


class DocumentParser(HTMLParser):
    """Collects the structural facts the rules need."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.tags: list[tuple[str, dict[str, str], int, bool]] = []
        self.ids: dict[str, list[int]] = {}
        self.anchors: list[dict[str, object]] = []
        self.images: list[tuple[dict[str, str], int]] = []
        self.inputs: list[tuple[dict[str, str], int]] = []
        self.buttons: list[dict[str, object]] = []
        self.html_attrs: dict[str, str] | None = None
        self.metas: list[tuple[dict[str, str], int]] = []
        self.title_parts: list[str] = []
        self._in_title = False
        self.inline_bytes = 0
        self.external_resources: list[str] = []
        self._open_anchor: dict[str, object] | None = None
        self._open_button: dict[str, object] | None = None
        self.has_main = False
        self.nav_count = 0
        self._stack: list[str] = []

    # -- helpers ---------------------------------------------------------
    def _text_target(self, attrs: dict[str, str], line: int) -> dict[str, object]:
        return {
            "attrs": attrs,
            "line": line,
            "text": "",
            "label": "",
            "aria": bool(attrs.get("aria-label") or attrs.get("aria-labelledby")),
        }

    def handle_starttag(self, tag: str, attrs_raw: list[tuple[str, str | None]]) -> None:
        attrs = {name.lower(): (value or "") for name, value in attrs_raw}
        line, _ = self.getpos()
        self.tags.append((tag, attrs, line, False))

        if tag == "html":
            self.html_attrs = attrs
        elif tag == "main":
            self.has_main = True
        elif tag == "nav":
            self.nav_count += 1
        elif tag == "meta":
            self.metas.append((attrs, line))
        elif tag == "title":
            self._in_title = True
        elif tag == "img":
            self.images.append((attrs, line))
            if self._open_anchor is not None and attrs.get("alt", "").strip():
                self._open_anchor["has_img_alt"] = True
        elif tag == "input":
            self.inputs.append((attrs, line))
        elif tag in {"font", "center", "marquee", "blink", "big", "strike"}:
            pass  # reported by the caller through the tag list

        if "id" in attrs:
            self.ids.setdefault(attrs["id"], []).append(line)

        if tag == "a":
            node = self._text_target(attrs, line)
            self._open_anchor = node
            self.anchors.append(node)
        elif tag == "button":
            node = self._text_target(attrs, line)
            self._open_button = node
            self.buttons.append(node)

        if tag == "script" and not attrs.get("src"):
            self._stack.append("script")
        elif tag == "style":
            self._stack.append("style")

        # Only fetching attributes are network requests; <a href> is navigation.
        if tag in {"img", "script", "iframe", "source", "video", "audio", "embed", "track"}:
            value = attrs.get("src", "")
            if value.startswith(("http://", "https://", "//")):
                self.external_resources.append(value)
        if tag == "link" and set(attrs.get("rel", "").lower().split()) & {
            "stylesheet",
            "preload",
            "preconnect",
            "dns-prefetch",
            "icon",
            "manifest",
        }:
            value = attrs.get("href", "")
            if value.startswith(("http://", "https://", "//")):
                self.external_resources.append(value)

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
        elif tag == "a":
            self._open_anchor = None
        elif tag == "button":
            self._open_button = None
        if tag in {"script", "style"} and self._stack and self._stack[-1] == tag:
            self._stack.pop()

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title_parts.append(data)
        if self._open_anchor is not None:
            self._open_anchor["text"] = str(self._open_anchor["text"]) + data
        if self._open_button is not None:
            self._open_button["text"] = str(self._open_button["text"]) + data
        if self._stack and self._stack[-1] in {"script", "style"}:
            self.inline_bytes += len(data.encode("utf-8"))


def _attr_text_length(node: dict[str, object]) -> int:
    text = str(node.get("text", "")).strip()
    if text:
        return len(re.sub(r"\s+", " ", text))
    for key in ("aria-label", "title"):
        value = str((node.get("attrs") or {}).get(key, "")).strip()  # type: ignore[index]
        if value:
            return len(value)
    # An image inside a link still provides an accessible name.
    return 0


SKIP_TARGETS = {"main", "content", "contenido", "workspace", "main-content", "conteudo"}


def _has_skip_link(parser: DocumentParser) -> bool:
    for tag, attrs, _line, _self_closing in parser.tags:
        if tag != "a":
            continue
        href = attrs.get("href", "")
        if not href.startswith("#"):
            continue
        if "skip" in attrs.get("class", "").lower() or href[1:] in SKIP_TARGETS:
            return True
    return False


def _is_generated(resolved: Path) -> bool:
    """True when the path is produced at deploy time, not committed."""
    try:
        relative = resolved.relative_to(ROOT).as_posix()
    except ValueError:
        return False
    return any(relative == generated or relative.startswith(generated + "/") for generated in GENERATED_PATHS)


def _labels_for(parser: DocumentParser) -> set[str]:
    labels: set[str] = set()
    for tag, attrs, _line, _self_closing in parser.tags:
        if tag == "label" and attrs.get("for"):
            labels.add(attrs["for"])
    return labels


def audit_page(path: Path, root: Path, max_bytes: int) -> PageReport:
    relative = path.relative_to(root.parent if root.parent in path.parents else root).as_posix()
    report = PageReport(path=path, relative=relative)
    raw = path.read_bytes()
    report.bytes = len(raw)
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        report.add(1, "doctype-missing", "File is not valid UTF-8; cannot be audited.")
        return report

    head = text.lstrip()[:400]
    if not re.match(r"<!doctype html", head, re.IGNORECASE):
        report.add(1, "doctype-missing", "Missing <!doctype html> at the top of the file.")

    parser = DocumentParser()
    parser.feed(text)
    parser.close()
    report.inline_bytes = parser.inline_bytes
    report.external_resources = sorted(set(parser.external_resources))

    # -- head metadata ---------------------------------------------------
    html_attrs = parser.html_attrs or {}
    if not html_attrs.get("lang", "").strip():
        report.add(1, "lang-missing", "Add a BCP-47 lang attribute to <html>.")
    charset_line = next(
        (line for attrs, line in parser.metas if attrs.get("charset")), 0
    )
    if not charset_line:
        report.add(1, "charset-missing", "Add <meta charset=\"utf-8\"> as the first head child.")

    viewport_attrs = next(
        (attrs for attrs, _line in parser.metas if attrs.get("name", "").lower() == "viewport"),
        None,
    )
    if viewport_attrs is None:
        report.add(1, "viewport-missing", "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">.")

    report.title = re.sub(r"\s+", " ", "".join(parser.title_parts)).strip()
    if not report.title:
        report.add(1, "title-missing", "Add a descriptive <title>.")
    elif not TITLE_RANGE[0] <= len(report.title) <= TITLE_RANGE[1]:
        report.add(
            1,
            "title-length",
            f"Title is {len(report.title)} chars; keep it between {TITLE_RANGE[0]} and {TITLE_RANGE[1]}.",
        )

    description_attrs = next(
        (attrs for attrs, _line in parser.metas if attrs.get("name", "").lower() == "description"),
        None,
    )
    report.description = (description_attrs or {}).get("content", "").strip()
    if description_attrs is None or not report.description:
        report.add(1, "meta-description-missing", "Add <meta name=\"description\" content=\"…\">.")
    elif not DESCRIPTION_RANGE[0] <= len(report.description) <= DESCRIPTION_RANGE[1]:
        report.add(
            1,
            "description-length",
            f"Description is {len(report.description)} chars; keep it between "
            f"{DESCRIPTION_RANGE[0]} and {DESCRIPTION_RANGE[1]}.",
        )

    # -- structure -------------------------------------------------------
    h1_lines = [line for tag, _attrs, line, _sc in parser.tags if tag == "h1"]
    if len(h1_lines) != 1:
        report.add(
            h1_lines[0] if h1_lines else 1,
            "h1-count",
            f"Found {len(h1_lines)} <h1> elements; exactly one is required.",
        )

    levels = [int(tag[1]) for tag, _attrs, _line, _sc in parser.tags if tag in HEADING_TAGS]
    previous = None
    for tag, _attrs, line, _sc in parser.tags:
        if tag not in HEADING_TAGS:
            continue
        level = int(tag[1])
        if previous is not None and level > previous + 1:
            report.add(line, "heading-order", f"<{tag}> follows <h{previous}>: level skipped.")
        previous = level
    if not levels:
        report.add(1, "heading-order", "Page has no headings at all.")

    for tag, attrs, line, _sc in parser.tags:
        if tag in {"font", "center", "marquee", "blink", "big", "strike"}:
            report.add(line, "deprecated-element", f"<{tag}> is obsolete; use CSS instead.")
        if attrs.get("tabindex", "").lstrip("+").isdigit() and int(attrs["tabindex"]) > 0:
            report.add(line, "tabindex-positive", f"tabindex=\"{attrs['tabindex']}\" forces a focus order.")
        for name in attrs:
            if name.startswith("on"):
                report.add(line, "inline-handler", f"Inline handler {name}=… blocks a strict CSP.")

    for id_value, lines in parser.ids.items():
        if len(lines) > 1:
            report.add(lines[1], "id-duplicate", f"id=\"{id_value}\" is used {len(lines)} times.")

    for tag, attrs, line, _sc in parser.tags:
        for attr in ("aria-labelledby", "aria-describedby", "aria-controls"):
            for ref in attrs.get(attr, "").split():
                if ref and ref not in parser.ids:
                    report.add(line, "aria-ref-missing", f"{attr}=\"{ref}\" targets a missing id.")

    if not parser.has_main:
        report.add(1, "main-missing", "Add a <main> landmark for screen-reader navigation.")
    if parser.nav_count and not _has_skip_link(parser):
        report.add(1, "skip-link-missing", "Add a skip link to the main content when the page has navigation.")

    # -- images ----------------------------------------------------------
    for attrs, line in parser.images:
        if "alt" not in attrs:
            report.add(line, "img-alt-missing", f"<img src=\"{attrs.get('src', '')[:60]}\"> has no alt.")
        src = attrs.get("src", "")
        if src.startswith("data:"):
            continue
        if not (attrs.get("width") and attrs.get("height")) and not attrs.get("srcset"):
            report.add(line, "img-dimensions", f"<img src=\"{src[:60]}\"> has no width/height; layout can shift.")

    # -- links -----------------------------------------------------------
    labels = _labels_for(parser)
    for node in parser.anchors:
        attrs = node["attrs"]
        assert isinstance(attrs, dict)
        line = int(node["line"])  # type: ignore[arg-type]
        href = attrs.get("href", "").strip()
        if attrs.get("target") == "_blank" and "noopener" not in attrs.get("rel", ""):
            report.add(line, "target-blank-rel", f"hrefless rel for {href[:60]}: add rel=\"noopener\".")
        if _attr_text_length(node) == 0 and not node.get("has_img_alt"):
            report.add(line, "link-text-empty", f"<a href=\"{href[:60]}\"> has no accessible text.")
        if not href or href.startswith(("mailto:", "tel:", "javascript:")):
            continue
        parsed = urlsplit(href)
        if parsed.scheme or parsed.netloc:
            continue
        target_path = unquote(parsed.path)
        if parsed.fragment and not target_path:
            if parsed.fragment not in parser.ids:
                report.add(line, "anchor-target-missing", f"#{parsed.fragment} does not exist in this page.")
            continue
        if not target_path:
            continue
        resolved = (path.parent / target_path).resolve()
        if not resolved.exists() and not _is_generated(resolved):
            report.add(line, "link-target-missing", f"{href[:80]} does not resolve to a file.")

    # -- form controls ---------------------------------------------------
    for attrs, line in parser.inputs:
        input_type = attrs.get("type", "text").lower()
        if input_type in {"hidden", "submit", "button", "reset", "image"}:
            continue
        if attrs.get("aria-label") or attrs.get("aria-labelledby"):
            continue
        input_id = attrs.get("id", "")
        if input_type in TEXT_INPUTS and input_id and input_id in labels:
            continue
        if input_type in {"checkbox", "radio"} and input_id and input_id in labels:
            continue
        if input_type == "file" and input_id and input_id in labels:
            continue
        report.add(line, "input-unlabelled", f"<input type=\"{input_type}\"> has no associated <label>.")

    for node in parser.buttons:
        if _attr_text_length(node) == 0:
            report.add(int(node["line"]), "button-unlabelled", "<button> has no accessible text.")  # type: ignore[arg-type]

    # -- weight and third parties ---------------------------------------
    if report.bytes > max_bytes:
        report.add(
            1,
            "page-too-heavy",
            f"{report.bytes} bytes exceeds the {max_bytes}-byte budget for one document.",
        )
    if report.inline_bytes > INLINE_BUDGET_BYTES:
        report.add(
            1,
            "inline-budget",
            f"{report.inline_bytes} bytes of inline CSS/JS exceeds the {INLINE_BUDGET_BYTES}-byte budget.",
        )
    for resource in report.external_resources:
        report.add(1, "external-resource", f"Third-party request: {resource[:100]}")

    return report


def discover(target: Path, include_root: bool) -> tuple[list[Path], list[Path]]:
    """Return (pages to audit, root mirrors skipped as duplicates).

    Several root pages are byte-identical mirrors of published `docs/` pages
    (repository convention: `tests/test_portal_links.py` enforces it for
    `index.html`). Auditing them twice would report every title and description
    as a duplicate, so mirrors are counted separately instead.
    """
    pages: list[Path] = sorted(p for p in target.rglob("*.html") if p.is_file())
    mirrors: list[Path] = []
    if include_root:
        published = {
            page.name: page.read_bytes() for page in pages if page.parent == target
        }
        for candidate in sorted(ROOT.glob("*.html")):
            if not candidate.is_file():
                continue
            if published.get(candidate.name) == candidate.read_bytes():
                mirrors.append(candidate)
            else:
                pages.append(candidate)
    return pages, mirrors


def run(target: Path, include_root: bool = False, max_bytes: int = DEFAULT_MAX_BYTES) -> dict[str, object]:
    pages, mirrors = discover(target, include_root)
    reports = [audit_page(page, target, max_bytes) for page in pages]

    # Cross-page duplicates: the same title/description on several pages hurts
    # search snippets and confuses screen-reader users comparing tabs.
    seen_titles: dict[str, list[str]] = {}
    seen_descriptions: dict[str, list[str]] = {}
    for report in reports:
        if report.title:
            seen_titles.setdefault(report.title, []).append(report.relative)
        if report.description:
            seen_descriptions.setdefault(report.description, []).append(report.relative)
    for report in reports:
        if len(seen_titles.get(report.title, [])) > 1:
            others = [p for p in seen_titles[report.title] if p != report.relative]
            report.add(1, "duplicate-title", f"Same title as {', '.join(others[:3])}.")
        if report.description and len(seen_descriptions.get(report.description, [])) > 1:
            others = [p for p in seen_descriptions[report.description] if p != report.relative]
            report.add(1, "duplicate-description", f"Same description as {', '.join(others[:3])}.")

    findings = [f for report in reports for f in report.findings]
    counters: dict[str, int] = {rule: 0 for rule in RULES}
    for finding in findings:
        counters[finding.rule] += 1
    errors = sum(1 for f in findings if f.severity == "error")
    warnings = len(findings) - errors

    return {
        "target": str(target.relative_to(ROOT)) if target.is_relative_to(ROOT) else str(target),
        "pages": len(reports),
        "mirrors": [m.relative_to(ROOT).as_posix() for m in mirrors],
        "bytes": sum(r.bytes for r in reports),
        "inline_bytes": sum(r.inline_bytes for r in reports),
        "errors": errors,
        "warnings": warnings,
        "rules": {rule: count for rule, count in counters.items() if count},
        "report": [r.as_dict() for r in reports],
        "ok": errors == 0,
    }


def print_human(result: dict[str, object], strict: bool) -> None:
    report = result["report"]
    assert isinstance(report, list)
    total_errors = int(result["errors"])
    total_warnings = int(result["warnings"])
    for page in report:
        assert isinstance(page, dict)
        findings = page["findings"]
        assert isinstance(findings, list)
        if not findings:
            continue
        print(f"\n{page['page']}  ({page['bytes']} B, inline {page['inline_bytes']} B)")
        for finding in sorted(findings, key=lambda f: (f["severity"] != "error", f["line"])):
            assert isinstance(finding, dict)
            print(
                f"  {finding['severity']:<7} line {finding['line']:>4}  "
                f"{finding['rule']}: {finding['message']}"
            )
    print(
        f"\n{result['pages']} pages · {result['bytes']} bytes · "
        f"{total_errors} errors · {total_warnings} warnings"
    )
    mirrors = result.get("mirrors") or []
    if mirrors:
        print(f"mirrors skipped (byte-identical to docs/): {', '.join(mirrors)}")
    counts = result["rules"]
    assert isinstance(counts, dict)
    if counts:
        summary = ", ".join(f"{rule}={count}" for rule, count in sorted(counts.items()))
        print(f"rules: {summary}")
    failing = total_errors > 0 or (strict and total_warnings > 0)
    print("RESULT:", "FAIL" if failing else "PASS")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="audit_site.py",
        description="Audit the shipped static site for accessibility, SEO, hygiene and weight.",
        epilog="Exit code 0 means the site met every error-level rule (and warning-level ones with --strict).",
    )
    parser.add_argument("target", nargs="?", type=Path, default=DEFAULT_TARGET, help="directory to audit (default: docs/)")
    parser.add_argument("--include-root", action="store_true", help="also audit the root *.html mirror pages")
    parser.add_argument("--max-bytes", type=int, default=DEFAULT_MAX_BYTES, help=f"per-document byte budget (default: {DEFAULT_MAX_BYTES})")
    parser.add_argument("--json", action="store_true", help="print the full report as JSON")
    parser.add_argument("--write", type=Path, help="write the JSON report to a file")
    parser.add_argument("--strict", action="store_true", help="treat warnings as failures")
    parser.add_argument("--list-rules", action="store_true", help="print every rule, its severity and meaning")
    args = parser.parse_args(argv)

    if args.list_rules:
        for rule, (severity, description) in sorted(RULES.items()):
            print(f"{rule:<28} {severity:<8} {description}")
        return 0

    target = args.target if args.target.is_absolute() else (Path.cwd() / args.target)
    if not target.is_dir():
        print(f"error: {target} is not a directory", file=sys.stderr)
        return 2
    if not discover(target, args.include_root)[0]:
        print(f"error: no HTML documents found under {target}", file=sys.stderr)
        return 2

    result = run(target, include_root=args.include_root, max_bytes=args.max_bytes)

    if args.write:
        args.write.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"wrote {args.write}")
    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print_human(result, args.strict)

    failed = not result["ok"] or (args.strict and int(result["warnings"]) > 0)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())

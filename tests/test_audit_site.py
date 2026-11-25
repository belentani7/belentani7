"""Contract tests for `scripts/audit_site.py`.

The auditor is the repository's only executable definition of "a good page":
semantic HTML, one heading, labelled controls, resolvable links and a byte
budget. These tests pin each rule with a minimal fixture so a future refactor
cannot silence a check, and they assert that the shipped `docs/` tree passes.

Run: python -m unittest discover -s tests -p 'test_audit_site.py' -v
No network, no third-party package, no generated artefacts required.
"""

from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
import tempfile
import textwrap
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "audit_site.py"

_spec = importlib.util.spec_from_file_location("audit_site", SCRIPT)
assert _spec and _spec.loader
audit_site = importlib.util.module_from_spec(_spec)
sys.modules[_spec.name] = audit_site  # dataclasses resolve annotations through sys.modules
_spec.loader.exec_module(audit_site)

CLEAN_DESCRIPTION = (
    "A description long enough to pass the recommended range for search snippets."
)


def page(
    *,
    lang: str = "en",
    charset: bool = True,
    viewport: bool = True,
    title: str = "A page title of useful length",
    description: str | None = CLEAN_DESCRIPTION,
    body: str = "<main><h1>Title</h1><p>Body.</p></main>",
) -> str:
    head = ["<title>%s</title>" % title] if title != "" else []
    if charset:
        head.insert(0, '<meta charset="utf-8">')
    if viewport:
        head.insert(1, '<meta name="viewport" content="width=device-width, initial-scale=1">')
    if description is not None:
        head.insert(2, '<meta name="description" content="%s">' % description)
    lang_attr = f' lang="{lang}"' if lang else ""
    return (
        "<!doctype html>\n<html%s>\n<head>\n%s\n</head>\n<body>\n%s\n</body>\n</html>\n"
        % (lang_attr, "\n".join(head), textwrap.dedent(body))
    )


class FixtureCase(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)

    def tearDown(self) -> None:
        self._tmp.cleanup()

    def write(self, name: str, content: str) -> Path:
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def audit(self, name: str = "index.html", **kwargs: object) -> tuple[object, set[str]]:
        path = self.root / name
        report = audit_site.audit_page(path, self.root, int(kwargs.get("max_bytes", 300_000)))
        return report, {finding.rule for finding in report.findings}


class CleanDocumentTests(FixtureCase):
    def test_a_complete_document_produces_no_findings(self) -> None:
        self.write("other.html", page(title="Another page title here"))
        self.write(
            "index.html",
            page(
                body="""
                <a class="skip" href="#main">Skip</a>
                <nav aria-label="Main"><a href="other.html">Other</a></nav>
                <main id="main">
                  <h1>Title</h1>
                  <h2>Sub</h2>
                  <img src="pixel.png" alt="A described image" width="10" height="10">
                  <a href="https://example.com" target="_blank" rel="noopener">External</a>
                </main>
                """,
            ),
        )
        self.write("pixel.png", "x")
        report, rules = self.audit()
        self.assertEqual(rules, set(), [f.as_dict() for f in report.findings])  # type: ignore[attr-defined]


class HeadAndLandmarkRules(FixtureCase):
    def test_missing_head_metadata_is_reported(self) -> None:
        self.write(
            "index.html",
            "<html><head><title>x</title></head><body><p>No main, no heading.</p></body></html>",
        )
        _report, rules = self.audit()
        self.assertTrue(
            {
                "doctype-missing",
                "lang-missing",
                "charset-missing",
                "viewport-missing",
                "meta-description-missing",
                "h1-count",
                "title-length",
                "main-missing",
            }
            <= rules,
            rules,
        )

    def test_two_h1_elements_are_an_error(self) -> None:
        self.write("index.html", page(body="<main><h1>One</h1><h1>Two</h1></main>"))
        _report, rules = self.audit()
        self.assertIn("h1-count", rules)

    def test_heading_level_jump_is_a_warning(self) -> None:
        self.write("index.html", page(body="<main><h1>One</h1><h3>Three</h3></main>"))
        report, rules = self.audit()
        self.assertIn("heading-order", rules)
        self.assertEqual(report.findings[0].severity, "warning")  # type: ignore[attr-defined]

    def test_positive_tabindex_is_an_error(self) -> None:
        self.write("index.html", page(body='<main><h1>T</h1><button tabindex="3">x</button></main>'))
        _report, rules = self.audit()
        self.assertIn("tabindex-positive", rules)

    def test_skip_link_satisfies_navigation_rule(self) -> None:
        self.write(
            "index.html",
            page(body='<nav aria-label="N"><a href="#main">Skip</a></nav><main id="main"><h1>T</h1></main>'),
        )
        _report, rules = self.audit()
        self.assertNotIn("skip-link-missing", rules)


class LinkAndIdRules(FixtureCase):
    def test_duplicate_ids_and_broken_fragments(self) -> None:
        self.write(
            "index.html",
            page(body='<main><h1>T</h1><p id="dup">a</p><p id="dup">b</p><a href="#nope">x</a></main>'),
        )
        _report, rules = self.audit()
        self.assertIn("id-duplicate", rules)
        self.assertIn("anchor-target-missing", rules)

    def test_missing_relative_file_is_an_error(self) -> None:
        self.write("index.html", page(body='<main><h1>T</h1><a href="missing.html">Broken</a></main>'))
        report, rules = self.audit()
        self.assertIn("link-target-missing", rules)
        self.assertIn("missing.html", report.findings[0].message)  # type: ignore[attr-defined]

    def test_existing_relative_file_is_accepted(self) -> None:
        self.write("other.html", page(title="Another page title passed"))
        self.write("index.html", page(body='<main><h1>T</h1><a href="other.html">Fine</a></main>'))
        _report, rules = self.audit()
        self.assertNotIn("link-target-missing", rules)

    def test_empty_link_and_unsafe_blank_target(self) -> None:
        self.write(
            "index.html",
            page(body='<main><h1>T</h1><a href="#main" target="_blank"></a></main>'),
        )
        _report, rules = self.audit()
        self.assertIn("link-text-empty", rules)
        self.assertIn("target-blank-rel", rules)

    def test_aria_reference_must_exist(self) -> None:
        self.write(
            "index.html",
            page(body='<main><h1>T</h1><section aria-labelledby="ghost">x</section></main>'),
        )
        _report, rules = self.audit()
        self.assertIn("aria-ref-missing", rules)


class MediaAndFormRules(FixtureCase):
    def test_image_without_alt_is_an_error(self) -> None:
        self.write("index.html", page(body='<main><h1>T</h1><img src="picture.png"></main>'))
        self.write("picture.png", "x")
        _report, rules = self.audit()
        self.assertIn("img-alt-missing", rules)
        self.assertIn("img-dimensions", rules)

    def test_unlabelled_search_input_is_an_error(self) -> None:
        self.write("index.html", page(body='<main><h1>T</h1><input type="search"></main>'))
        _report, rules = self.audit()
        self.assertIn("input-unlabelled", rules)

    def test_labelled_input_passes(self) -> None:
        self.write(
            "index.html",
            page(body='<main><h1>T</h1><label for="q">Search</label><input id="q" type="search"></main>'),
        )
        _report, rules = self.audit()
        self.assertNotIn("input-unlabelled", rules)

    def test_aria_label_is_an_accessible_name(self) -> None:
        self.write(
            "index.html",
            page(body='<main><h1>T</h1><input type="search" aria-label="Search"><button aria-label="Menu"></button></main>'),
        )
        _report, rules = self.audit()
        self.assertNotIn("input-unlabelled", rules)
        self.assertNotIn("button-unlabelled", rules)


class WeightAndThirdPartyRules(FixtureCase):
    def test_byte_budget_is_enforced(self) -> None:
        self.write("index.html", page(body="<main><h1>T</h1><p>%s</p></main>" % ("x" * 4000)))
        _report, rules = self.audit(max_bytes=1000)
        self.assertIn("page-too-heavy", rules)

    def test_external_links_are_not_requests_but_external_scripts_are(self) -> None:
        self.write(
            "index.html",
            page(
                body=(
                    '<main><h1>T</h1><a href="https://example.com">Link</a>'
                    '<script src="https://cdn.example.com/app.js"></script></main>'
                )
            ),
        )
        report, rules = self.audit()
        self.assertIn("external-resource", rules)
        messages = " ".join(f.message for f in report.findings)  # type: ignore[attr-defined]
        self.assertIn("cdn.example.com", messages)
        self.assertNotIn("https://example.com", messages)

    def test_generated_project_directories_are_not_dead_links(self) -> None:
        self.assertTrue(audit_site._is_generated(ROOT / "docs" / "projects" / "secure-t" / "index.html"))
        self.assertFalse(audit_site._is_generated(ROOT / "docs" / "living-machine" / "index.html"))


class RepositorySiteTests(unittest.TestCase):
    def test_shipped_site_passes_every_rule(self) -> None:
        result = audit_site.run(ROOT / "docs")
        self.assertTrue(result["ok"], [r for r in result["report"] if r["findings"]])
        self.assertEqual(result["errors"], 0)

    def test_root_tree_passes_and_mirrors_are_skipped(self) -> None:
        result = audit_site.run(ROOT / "docs", include_root=True)
        self.assertTrue(result["ok"], [r for r in result["report"] if r["findings"]])
        self.assertIn("index.html", result["mirrors"])
        self.assertIn("privacidad.html", result["mirrors"])

    def test_every_rule_is_documented(self) -> None:
        for rule, (severity, description) in audit_site.RULES.items():
            self.assertIn(severity, {"error", "warning"}, rule)
            self.assertGreater(len(description), 15, rule)


class CommandLineTests(unittest.TestCase):
    def run_cli(self, *args: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(SCRIPT), *args],
            capture_output=True,
            text=True,
            encoding="utf-8",
            cwd=ROOT,
        )

    def test_help_and_rule_listing_exit_zero(self) -> None:
        self.assertEqual(self.run_cli("--help").returncode, 0)
        listing = self.run_cli("--list-rules")
        self.assertEqual(listing.returncode, 0)
        self.assertIn("doctype-missing", listing.stdout)

    def test_json_report_is_machine_readable(self) -> None:
        result = self.run_cli("--json")
        self.assertEqual(result.returncode, 0, result.stderr)
        payload = json.loads(result.stdout)
        self.assertTrue(payload["ok"])
        self.assertGreaterEqual(payload["pages"], 5)

    def test_missing_target_exits_two(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            result = self.run_cli(tmp)
        self.assertEqual(result.returncode, 2)

    def test_strict_mode_fails_on_warnings(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "index.html").write_text(
                page(body="<main><h1>T</h1><h3>Skipped</h3></main>"), encoding="utf-8"
            )
            lenient = self.run_cli(tmp)
            strict = self.run_cli(tmp, "--strict", "--write", str(root / "report.json"))
            self.assertEqual(lenient.returncode, 0, lenient.stdout)
            self.assertEqual(strict.returncode, 1, strict.stdout)
            self.assertTrue((root / "report.json").is_file())


if __name__ == "__main__":
    unittest.main()

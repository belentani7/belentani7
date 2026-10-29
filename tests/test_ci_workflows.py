"""Policy regressions for GitHub Actions, checked without PyYAML or network."""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / ".github" / "workflows"


def workflow(name):
    return (ROOT / name).read_text(encoding="utf-8")


class WorkflowPolicyTests(unittest.TestCase):
    def test_setup_node_v5_explicitly_disables_implicit_pnpm_cache(self):
        for name in ("ci.yml", "cd.yml"):
            text = workflow(name)
            with self.subTest(workflow=name):
                count = len(re.findall(r"uses:\s*actions/setup-node@v5\b", text))
                self.assertGreaterEqual(count, 1)
                self.assertEqual(count, len(re.findall(r"package-manager-cache:\s*false\b", text)))
                self.assertIsNone(re.search(r"^\s*cache:\s*['\"]?pnpm['\"]?\s*$", text, re.M))

    def test_manual_deployment_requires_reviewed_main(self):
        text = workflow("cd.yml")
        self.assertIn("workflow_dispatch:", text)
        self.assertIn("if: github.ref == 'refs/heads/main'", text)
        self.assertIn("--skip-domain", text)
        self.assertNotIn("pull_request_target", text)

    def test_read_only_observability_and_scoped_retry(self):
        observe = workflow("ci-observability.yml")
        retry = workflow("ci-transient-recovery.yml")
        self.assertIn("actions: read", observe)
        self.assertIn("contents: read", observe)
        self.assertNotIn("actions: write", observe)
        self.assertIn("actions: write", retry)
        self.assertIn("contents: read", retry)
        self.assertNotIn("contents: write", retry)
        for text in (observe, retry):
            self.assertIn("ref: main", text)
            self.assertIn("persist-credentials: false", text)
            self.assertIn("head_repository.full_name == github.repository", text)

    def test_pages_never_attempts_unauthorized_bootstrap(self):
        text = workflow("deploy-pages.yml")
        self.assertIn('gh api "/repos/$GITHUB_REPOSITORY/pages"', text)
        self.assertNotIn("enablement: true", text)
        self.assertIn("GitHub Pages configuration required", text)
        self.assertIn("workflow_dispatch:", text)
        self.assertIn("if: github.ref == 'refs/heads/main'", text)
        self.assertIsNone(re.search(r"^\s*push:\s*$", text, re.M))
        self.assertIn("persist-credentials: false", text)

    def test_secret_scanner_uses_supported_node24_actions_and_read_only_token(self):
        text = workflow("repo-security.yml")
        self.assertIn("uses: actions/checkout@v6", text)
        self.assertIn("uses: gitleaks/gitleaks-action@v3", text)
        self.assertIn("fetch-depth: 0", text)
        self.assertIn("persist-credentials: false", text)
        self.assertIn("contents: read", text)
        self.assertNotIn("contents: write", text)
        self.assertNotIn("pull_request_target", text)

    def test_codeql_covers_python_without_duplicate_js_typescript_scans(self):
        text = workflow("codeql.yml")
        self.assertIn("language: [javascript-typescript, python]", text)
        self.assertIn("github/codeql-action/init@v4", text)
        self.assertIn("github/codeql-action/analyze@v4", text)


if __name__ == "__main__":
    unittest.main()

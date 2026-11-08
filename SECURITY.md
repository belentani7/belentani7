# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| Older   | :x:                |

## Reporting a Vulnerability

Please report security vulnerabilities by opening a private security advisory on GitHub: https://github.com/belentani7/belentani7/security/advisories/new. Do not open a public issue.

We will acknowledge receipt within 48 hours and provide a timeline for resolution within 5 business days.

## Security Measures

- All dependencies are scanned weekly via Dependabot
- CodeQL analysis runs on every push and pull request
- Gitleaks secret scanning runs on every push
- Branch protection requires passing CI and code review
- All secrets are managed via environment variables, never committed

## Disclosure Policy

We follow responsible disclosure. Please give us time to address the issue before making it public.

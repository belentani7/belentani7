#!/usr/bin/env python3
"""Read-only, dependency-free checks for a GitHub profile README."""
import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit
from urllib.request import Request, urlopen

MD_LINK = re.compile(r'!?\[[^\]]*\]\((<?[^)]+>?)\)')
HTML_LINK = re.compile(r'\b(?:href|src)\s*=\s*["\']([^"\']+)["\']', re.I)
MD_IMAGE_MISSING_ALT = re.compile(r'!\[\s*\]\([^)]+\)')
HTML_IMG = re.compile(r'<img\b[^>]*>', re.I | re.S)
HTML_ALT = re.compile(r'\balt\s*=\s*["\']([^"\']*)["\']', re.I)
ALLOWED_EXTERNAL_HOSTS = {'github.com', 'belentani.es', 'www.belentani.es'}


def inspect(readme: Path, root: Path) -> dict:
    findings = []
    if not readme.is_file():
        return {'ok': False, 'links_checked': 0, 'findings': [{'severity': 'error', 'message': 'README.md missing'}]}
    text = readme.read_text(encoding='utf-8')
    if not text.strip():
        findings.append({'severity': 'error', 'message': 'README is empty'})
    if not re.search(r'^#\s+\S', text, re.M):
        findings.append({'severity': 'warning', 'message': 'No top-level Markdown heading'})
    if MD_IMAGE_MISSING_ALT.search(text):
        findings.append({'severity': 'error', 'message': 'Markdown image has empty alt text'})
    for image in HTML_IMG.findall(text):
        match = HTML_ALT.search(image)
        if match is None or not match.group(1).strip():
            findings.append({'severity': 'error', 'message': 'HTML image has missing or empty alt text'})
    links = {m.group(1).strip('<> ').split(' "')[0] for m in MD_LINK.finditer(text)}
    links |= {m.group(1) for m in HTML_LINK.finditer(text)}
    external = set()
    root = root.resolve()
    for link in sorted(links):
        parsed = urlsplit(link)
        if parsed.scheme in ('mailto', 'tel') or (not parsed.path and parsed.fragment):
            continue
        if parsed.scheme in ('http', 'https'):
            external.add(link)
            continue
        if parsed.scheme or parsed.netloc or link.startswith('//'):
            findings.append({'severity': 'error', 'message': f'Unsupported link scheme: {link[:120]}'})
            continue
        path = unquote(parsed.path)
        if not path:
            continue
        target = (root / path).resolve() if path.startswith('/') else (readme.parent / path).resolve()
        if not target.is_relative_to(root):
            findings.append({'severity': 'error', 'message': f'Link escapes repository root: {link[:120]}'})
        elif not target.exists():
            findings.append({'severity': 'error', 'message': f'Missing local path: {link[:120]}'})
    return {
        'ok': not any(x['severity'] == 'error' for x in findings),
        'links_checked': len(links), 'external_links_unchecked': sorted(external),
        'findings': findings,
    }


def check_external(report: dict, max_urls: int = 12) -> None:
    """Optional manual-only availability hints; network failures are warnings."""
    checked = []
    for link in report.get('external_links_unchecked', []):
        url = urlsplit(link)
        if url.scheme != 'https' or url.hostname not in ALLOWED_EXTERNAL_HOSTS:
            continue
        if len(checked) >= max_urls:
            break
        try:
            req = Request(link, method='HEAD', headers={'User-Agent': 'BelentaniProfileHealth/1.0'})
            with urlopen(req, timeout=6) as response:
                code = response.status
            if code >= 400:
                report['findings'].append({'severity': 'warning', 'message': f'HTTP {code}: {link[:120]}'})
            checked.append({'url': link, 'status': code})
        except Exception as exc:
            report['findings'].append({'severity': 'warning', 'message': f'Network check inconclusive: {link[:100]} ({type(exc).__name__})'})
            checked.append({'url': link, 'status': 'inconclusive'})
    report['network_checks'] = checked


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--readme', type=Path)
    parser.add_argument('--json', type=Path, help='Write a machine-readable report')
    parser.add_argument('--links', action='store_true', help='Manually check a bounded set of allowlisted HTTPS links')
    args = parser.parse_args()
    root = args.root.resolve()
    report = inspect(args.readme or root / 'README.md', root)
    if args.links:
        check_external(report)
    print(json.dumps(report, indent=2, ensure_ascii=False))
    if args.json:
        args.json.parent.mkdir(parents=True, exist_ok=True)
        args.json.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    return 0 if report['ok'] else 1


if __name__ == '__main__':
    sys.exit(main())

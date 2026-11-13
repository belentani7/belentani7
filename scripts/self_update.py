#!/usr/bin/env python3
"""Read-only, sourced GitHub public metric snapshot; never edits a profile."""
import argparse
import json
import re
import sys
from datetime import UTC, datetime
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

SAFE_USERNAME = re.compile(r'^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$')


def assert_public_http(url: str) -> str:
    """Rechaza esquemas no HTTP(S) y hosts internos (anti-SSRF)."""
    import ipaddress
    parsed = urlparse(url)
    if parsed.scheme not in {'http', 'https'}:
        raise ValueError('Solo se permiten URLs HTTP(S)')
    host = (parsed.hostname or '').lower()
    if not host or host in {'localhost', 'metadata.google.internal'}:
        raise ValueError('Host interno o vacio no permitido')
    try:
        addr = ipaddress.ip_address(host.strip('[]'))
    except ValueError:
        return url
    if addr.is_private or addr.is_loopback or addr.is_link_local or addr.is_reserved or addr.is_multicast:
        raise ValueError('IP interna no permitida')
    return url


def snapshot(username: str = 'belentani7') -> dict:
    if not SAFE_USERNAME.fullmatch(username):
        raise ValueError('Expected a safe GitHub username (alphanumeric and hyphens)')
    endpoint = assert_public_http(f'https://api.github.com/users/{username}')
    parsed = urlparse(endpoint)
    if parsed.scheme != 'https' or parsed.hostname != 'api.github.com':
        raise ValueError('Endpoint inesperado; solo se permite api.github.com')
    req = Request(endpoint, headers={'Accept': 'application/vnd.github+json', 'User-Agent': 'Belentani-Profile-Maintenance/1.0'})
    with urlopen(req, timeout=10) as response:
        raw = json.load(response)
    return {
        'source': endpoint,
        'fetched_at_utc': datetime.now(UTC).isoformat(),
        'login': raw['login'], 'bio': raw.get('bio'),
        'public_repos': raw['public_repos'], 'followers': raw['followers'],
        'following': raw['following'],
        'scope': 'Public GitHub API fields only. Private repos are excluded.',
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--username', default='belentani7')
    parser.add_argument('--output', type=Path, default=Path('profile-metrics.json'))
    args = parser.parse_args()
    try:
        data = snapshot(args.username)
    except Exception as exc:
        print(f'Public GitHub API snapshot unavailable: {type(exc).__name__}', file=sys.stderr)
        return 2
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'Saved sourced, timestamped public metrics to {args.output}')
    return 0


if __name__ == '__main__':
    sys.exit(main())

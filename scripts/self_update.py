#!/usr/bin/env python3
"""Read-only, sourced GitHub public metric snapshot; never edits a profile."""
import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen


def snapshot(username: str = 'belentani7') -> dict:
    endpoint = f'https://api.github.com/users/{username}'
    req = Request(endpoint, headers={'Accept': 'application/vnd.github+json', 'User-Agent': 'Belentani-Profile-Maintenance/1.0'})
    with urlopen(req, timeout=10) as response:
        raw = json.load(response)
    return {
        'source': endpoint,
        'fetched_at_utc': datetime.now(timezone.utc).isoformat(),
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

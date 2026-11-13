#!/usr/bin/env python3
"""Non-destructive remediation candidates from a healthcheck JSON report."""
import argparse
import json
from pathlib import Path


def suggestions(report: dict) -> dict:
    items = []
    for finding in report.get('findings', []):
        message = finding.get('message', '')
        if message.startswith('Missing local path:'):
            action = 'Restore the referenced file or correct its link after reviewing history.'
        elif 'alt text' in message:
            action = 'Write a concise, truthful text alternative for the image.'
        elif 'escapes repository root' in message:
            action = 'Replace the reference with a verified in-repository relative path.'
        else:
            action = 'Investigate manually; do not alter historical links without evidence.'
        items.append({'evidence': message, 'recommended_action': action, 'automatically_applied': False})
    return {'mode': 'review-only', 'suggestions': items}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', type=Path, default=Path('profile-health.json'))
    parser.add_argument('--output', type=Path, default=Path('profile-repair-plan.json'))
    args = parser.parse_args()
    result = suggestions(json.loads(args.input.read_text(encoding='utf-8')))
    args.output.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'Review-only suggestions: {len(result["suggestions"])}')


if __name__ == '__main__':
    main()

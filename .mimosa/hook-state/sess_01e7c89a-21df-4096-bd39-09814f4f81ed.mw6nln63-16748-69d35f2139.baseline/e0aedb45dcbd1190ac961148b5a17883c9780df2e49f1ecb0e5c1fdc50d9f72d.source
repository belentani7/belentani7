#!/usr/bin/env python3
"""Evidence-driven improvement suggestions, no unattended GitHub writes."""
import argparse
import json
from pathlib import Path


def recommendations(audit: dict, metrics: dict | None) -> dict:
    proposals = []
    if not audit.get('ok'):
        proposals.append('Resolve verified local README errors before visual changes.')
    if audit.get('external_links_unchecked'):
        proposals.append('Manually verify selected external project demos and contact links.')
    if metrics is None:
        proposals.append('Collect public API metrics when rate limits permit; do not invent numbers.')
    else:
        proposals.append('Compare timestamped public metrics over time; do not infer revenue from followers.')
    return {'mode': 'human-review', 'proposals': proposals, 'metrics_source': metrics.get('source') if metrics else None}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--health', type=Path, default=Path('profile-health.json'))
    parser.add_argument('--metrics', type=Path, default=Path('profile-metrics.json'))
    parser.add_argument('--output', type=Path, default=Path('profile-improvement-plan.json'))
    args = parser.parse_args()
    audit = json.loads(args.health.read_text(encoding='utf-8'))
    metrics = json.loads(args.metrics.read_text(encoding='utf-8')) if args.metrics.exists() else None
    result = recommendations(audit, metrics)
    args.output.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'Human-review proposals: {len(result["proposals"])}')


if __name__ == '__main__':
    main()

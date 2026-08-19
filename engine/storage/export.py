from __future__ import annotations

import csv
import json
from pathlib import Path


def export_json(result: dict, path: str | Path):
    target = Path(path); target.parent.mkdir(parents=True, exist_ok=True); target.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8'); return str(target)


def export_jsonl(result: dict, path: str | Path):
    target = Path(path); target.parent.mkdir(parents=True, exist_ok=True)
    with target.open('w', encoding='utf8') as f:
        for task in result.get('results', []):
            for page in (task.get('result') or {}).get('pages', []): f.write(json.dumps(page, ensure_ascii=False) + '\n')
    return str(target)


def export_csv(result: dict, path: str | Path):
    target = Path(path); target.parent.mkdir(parents=True, exist_ok=True)
    rows = []
    for task in result.get('results', []):
        for page in (task.get('result') or {}).get('pages', []):
            score = page.get('score', {})
            rows.append({'task_url': task.get('url'), 'url': page.get('url'), 'title': page.get('title'), 'description': page.get('description'), 'technologies': ','.join(page.get('technologies', [])), 'word_count': page.get('word_count'), 'overall_score': score.get('overall'), 'evidence_hash': (page.get('evidence') or [{}])[0].get('content_hash')})
    fields = list(rows[0]) if rows else ['task_url', 'url', 'title', 'description', 'technologies', 'word_count', 'overall_score', 'evidence_hash']
    with target.open('w', newline='', encoding='utf8') as f:
        writer = csv.DictWriter(f, fieldnames=fields); writer.writeheader(); writer.writerows(rows)
    return str(target)

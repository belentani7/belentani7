from __future__ import annotations

import concurrent.futures
import json
import time
from pathlib import Path
from urllib.parse import urlparse

from engine.browser.navigation import Navigator
from engine.scraper.extraction import extract
from engine.intelligence.scoring import score_page
from engine.core.natural import parse_mission


class MissionEngine:
    def __init__(self, db, artifacts: str | Path, max_workers: int = 3):
        self.db = db
        self.artifacts = Path(artifacts); self.artifacts.mkdir(parents=True, exist_ok=True)
        self.max_workers = max_workers

    def normalize_spec(self, raw: dict | str) -> dict:
        if isinstance(raw, str):
            return parse_mission(raw)
        spec = dict(raw); spec.setdefault('name', 'mission'); spec.setdefault('objective', 'Extract and validate public web information'); spec.setdefault('urls', []); spec.setdefault('max_pages', 3); spec.setdefault('retries', 2); spec.setdefault('rate_limit', 0.8)
        spec['urls'] = list(dict.fromkeys(spec.get('urls') or spec.get('seeds') or []))
        return spec

    def plan(self, spec: dict) -> list[dict]:
        urls = [u for u in spec['urls'] if urlparse(u).scheme in {'http', 'https'}]
        return [{'url': u, 'kind': 'crawl', 'max_pages': int(spec.get('max_pages', 3))} for u in urls]

    def run(self, raw_spec: dict | str, mission_id: str | None = None) -> str:
        spec = self.normalize_spec(raw_spec)
        mission_id = mission_id or self.db.create_mission(spec)
        self.db.event(mission_id, 'mission.created', {'spec': spec})
        plan = self.plan(spec)
        if not plan:
            self.db.update_mission(mission_id, 'failed', 'La misión necesita al menos una URL HTTP(S)')
            return mission_id
        self.db.update_mission(mission_id, 'running')
        for item in plan: self.db.create_task(mission_id, item['url'], item['kind'])
        tasks = self.db.get_tasks(mission_id)
        with concurrent.futures.ThreadPoolExecutor(max_workers=min(self.max_workers, len(tasks))) as pool:
            futures = {pool.submit(self._execute_task, mission_id, task, spec): task for task in tasks}
            for future in concurrent.futures.as_completed(futures):
                task = futures[future]
                try: future.result()
                except Exception as exc: self.db.event(mission_id, 'task.unhandled_error', {'error': str(exc)}, task['id'])
        statuses = [x['status'] for x in self.db.get_tasks(mission_id)]
        self.db.update_mission(mission_id, 'completed' if statuses and all(s == 'completed' for s in statuses) else 'completed_with_errors')
        self.db.event(mission_id, 'mission.completed', {'statuses': statuses})
        return mission_id

    def _execute_task(self, mission_id: str, task: dict, spec: dict):
        retries = int(spec.get('retries', 2)); last_error = None
        for attempt in range(1, retries + 2):
            self.db.update_task(task['id'], 'running', attempts=attempt)
            self.db.event(mission_id, 'task.started', {'attempt': attempt, 'url': task['url']}, task['id'])
            try:
                nav = Navigator(timeout=float(spec.get('timeout', 20)), rate_limit=float(spec.get('rate_limit', 0.8)), cache_dir=str(self.artifacts.parent / 'cache'), respect_robots=bool(spec.get('respect_robots', True)))
                shot_dir = self.artifacts / mission_id / task['id']; shot_dir.mkdir(parents=True, exist_ok=True)
                pages = nav.crawl(task['url'], max_pages=int(task['kind'] == 'crawl' and spec.get('max_pages', 3)), screenshot_dir=str(shot_dir))
                records = []
                for page in pages:
                    data = extract(page)
                    records.append(dict(data, score=score_page(data, spec.get('objective', ''))))
                self.db.add_cost(mission_id, 'http_pages', len(records), 0.0, {'strategy': 'deterministic-extraction', 'task_id': task['id']})
                if not records: raise RuntimeError('No se obtuvieron páginas reales')
                result = {'seed': task['url'], 'pages': records, 'page_count': len(records), 'validated': all(r.get('status', 0) < 400 for r in records), 'completed_at': time.time()}
                self.db.update_task(task['id'], 'completed', result=result, attempts=attempt)
                self.db.event(mission_id, 'task.completed', {'page_count': len(records)}, task['id'])
                self.db.set_memory(f'success:{urlparse(task["url"]).netloc}', {'strategy': 'crawl', 'pages': len(records), 'at': time.time()})
                return
            except Exception as exc:
                last_error = str(exc); self.db.event(mission_id, 'task.retry', {'attempt': attempt, 'error': last_error}, task['id'])
                time.sleep(min(2 ** (attempt - 1), 8))
        self.db.update_task(task['id'], 'failed', error=last_error, attempts=retries + 1)
        self.db.set_memory(f'failure:{urlparse(task["url"]).netloc}', {'error': last_error, 'at': time.time()})

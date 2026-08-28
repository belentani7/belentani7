from __future__ import annotations

import hashlib
import json
import time
from pathlib import Path

class CacheStore:
    def __init__(self, root: str | Path, ttl: float = 86400):
        self.root = Path(root); self.root.mkdir(parents=True, exist_ok=True); self.ttl = ttl
    def _path(self, key: str): return self.root / (hashlib.sha256(key.encode()).hexdigest() + '.json')
    def get(self, key: str):
        p = self._path(key)
        if not p.exists() or time.time() - p.stat().st_mtime > self.ttl: return None
        try: return json.loads(p.read_text(encoding='utf8'))
        except Exception: return None
    def set(self, key: str, value: dict):
        self._path(key).write_text(json.dumps(value, ensure_ascii=False), encoding='utf8')
    def clear(self):
        for p in self.root.glob('*.json'): p.unlink(missing_ok=True)

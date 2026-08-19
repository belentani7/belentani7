from __future__ import annotations

import json
import sqlite3
import threading
import time
import uuid
from pathlib import Path
from typing import Any


class Database:
    def __init__(self, path: str | Path):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.RLock()
        self._init()

    def _conn(self):
        conn = sqlite3.connect(self.path, timeout=30)
        conn.row_factory = sqlite3.Row
        return conn

    def _init(self):
        with self._conn() as c:
            c.executescript('''
            CREATE TABLE IF NOT EXISTS missions (
              id TEXT PRIMARY KEY, status TEXT NOT NULL, spec_json TEXT NOT NULL,
              created_at REAL NOT NULL, updated_at REAL NOT NULL, error TEXT
            );
            CREATE TABLE IF NOT EXISTS tasks (
              id TEXT PRIMARY KEY, mission_id TEXT NOT NULL, url TEXT, kind TEXT NOT NULL,
              status TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, result_json TEXT,
              error TEXT, created_at REAL NOT NULL, updated_at REAL NOT NULL
            );
            CREATE TABLE IF NOT EXISTS events (
              id INTEGER PRIMARY KEY AUTOINCREMENT, mission_id TEXT NOT NULL, task_id TEXT,
              kind TEXT NOT NULL, payload_json TEXT NOT NULL, created_at REAL NOT NULL
            );
            CREATE TABLE IF NOT EXISTS memory (
              key TEXT PRIMARY KEY, value_json TEXT NOT NULL, updated_at REAL NOT NULL
            );
            CREATE TABLE IF NOT EXISTS costs (
              id INTEGER PRIMARY KEY AUTOINCREMENT, mission_id TEXT NOT NULL,
              category TEXT NOT NULL, units REAL NOT NULL, amount REAL NOT NULL,
              metadata_json TEXT NOT NULL, created_at REAL NOT NULL
            );
            ''')

    def create_mission(self, spec: dict[str, Any]) -> str:
        mid = str(uuid.uuid4()); now = time.time()
        with self._lock, self._conn() as c:
            c.execute('INSERT INTO missions VALUES (?, ?, ?, ?, ?, ?)', (mid, 'queued', json.dumps(spec), now, now, None))
        return mid

    def update_mission(self, mission_id: str, status: str, error: str | None = None):
        with self._lock, self._conn() as c:
            c.execute('UPDATE missions SET status=?, updated_at=?, error=? WHERE id=?', (status, time.time(), error, mission_id))

    def get_mission(self, mission_id: str):
        with self._conn() as c:
            row = c.execute('SELECT * FROM missions WHERE id=?', (mission_id,)).fetchone()
            return dict(row) if row else None

    def list_missions(self):
        with self._conn() as c:
            return [dict(r) for r in c.execute('SELECT * FROM missions ORDER BY created_at DESC')]

    def recover_orphans(self):
        with self._lock, self._conn() as c:
            c.execute("UPDATE missions SET status='interrupted', updated_at=?, error=COALESCE(error, 'Proceso reiniciado') WHERE status IN ('running', 'queued')", (time.time(),))
            c.execute("UPDATE tasks SET status='interrupted', updated_at=?, error=COALESCE(error, 'Proceso reiniciado') WHERE status='running'", (time.time(),))

    def create_task(self, mission_id: str, url: str | None, kind: str) -> str:
        tid = str(uuid.uuid4()); now = time.time()
        with self._lock, self._conn() as c:
            c.execute('INSERT INTO tasks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', (tid, mission_id, url, kind, 'queued', 0, None, None, now, now))
        return tid

    def update_task(self, task_id: str, status: str, result: dict | None = None, error: str | None = None, attempts: int | None = None):
        with self._lock, self._conn() as c:
            if attempts is None:
                c.execute('UPDATE tasks SET status=?, result_json=?, error=?, updated_at=? WHERE id=?', (status, json.dumps(result) if result is not None else None, error, time.time(), task_id))
            else:
                c.execute('UPDATE tasks SET status=?, result_json=?, error=?, attempts=?, updated_at=? WHERE id=?', (status, json.dumps(result) if result is not None else None, error, attempts, time.time(), task_id))

    def get_tasks(self, mission_id: str):
        with self._conn() as c:
            rows = c.execute('SELECT * FROM tasks WHERE mission_id=? ORDER BY created_at', (mission_id,)).fetchall()
            out = []
            for r in rows:
                item = dict(r)
                item['result'] = json.loads(item.pop('result_json')) if item.get('result_json') else None
                out.append(item)
            return out

    def event(self, mission_id: str, kind: str, payload: dict, task_id: str | None = None):
        with self._lock, self._conn() as c:
            c.execute('INSERT INTO events(mission_id, task_id, kind, payload_json, created_at) VALUES (?, ?, ?, ?, ?)', (mission_id, task_id, kind, json.dumps(payload, ensure_ascii=False), time.time()))

    def events(self, mission_id: str):
        with self._conn() as c:
            return [{**dict(r), 'payload': json.loads(r['payload_json'])} for r in c.execute('SELECT * FROM events WHERE mission_id=? ORDER BY id', (mission_id,))]

    def set_memory(self, key: str, value: Any):
        with self._lock, self._conn() as c:
            c.execute('INSERT INTO memory(key,value_json,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json, updated_at=excluded.updated_at', (key, json.dumps(value, ensure_ascii=False), time.time()))

    def get_memory(self, key: str, default=None):
        with self._conn() as c:
            row = c.execute('SELECT value_json FROM memory WHERE key=?', (key,)).fetchone()
            return json.loads(row['value_json']) if row else default

    def add_cost(self, mission_id: str, category: str, units: float, amount: float, metadata: dict):
        with self._lock, self._conn() as c:
            c.execute('INSERT INTO costs(mission_id,category,units,amount,metadata_json,created_at) VALUES(?,?,?,?,?,?)', (mission_id, category, units, amount, json.dumps(metadata), time.time()))

    def costs(self, mission_id: str):
        with self._conn() as c:
            return [{**dict(r), 'metadata': json.loads(r['metadata_json'])} for r in c.execute('SELECT * FROM costs WHERE mission_id=? ORDER BY id', (mission_id,))]

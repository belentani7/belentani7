from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

from engine.core.mission import MissionEngine
from engine.storage.database import Database
from engine.storage.export import export_json, export_jsonl, export_csv

ROOT = Path(__file__).resolve().parent
DB = Database(os.getenv('BELLENTANI_DB', str(ROOT / 'data' / 'bellentani.db')))
DB.recover_orphans()
ENGINE = MissionEngine(DB, os.getenv('BELLENTANI_ARTIFACTS', str(ROOT / 'data' / 'artifacts')), int(os.getenv('BELLENTANI_WORKERS', '3')))


def main():
    parser = argparse.ArgumentParser(prog='bellentani')
    sub = parser.add_subparsers(dest='group', required=True)
    mission = sub.add_parser('mission'); action = mission.add_subparsers(dest='action', required=True)
    run = action.add_parser('run'); run.add_argument('spec'); run.add_argument('--natural', action='store_true')
    status = action.add_parser('status'); status.add_argument('id')
    results = action.add_parser('results'); results.add_argument('id')
    export = action.add_parser('export'); export.add_argument('id'); export.add_argument('format', choices=['json', 'jsonl', 'csv']); export.add_argument('path')
    ls = action.add_parser('list')
    args = parser.parse_args()
    if args.group == 'mission' and args.action == 'run':
        path = Path(args.spec)
        raw = path.read_text(encoding='utf8') if path.exists() else args.spec
        if args.natural: spec = raw
        else:
            try: spec = json.loads(raw)
            except json.JSONDecodeError: raise SystemExit('La misión debe ser JSON o usar --natural')
        print(json.dumps({'mission_id': ENGINE.run(spec)}, ensure_ascii=False))
    elif args.action == 'status':
        print(json.dumps({'mission': DB.get_mission(args.id), 'tasks': DB.get_tasks(args.id), 'events': DB.events(args.id)}, ensure_ascii=False))
    elif args.action == 'results':
        print(json.dumps({'mission': DB.get_mission(args.id), 'results': DB.get_tasks(args.id), 'events': DB.events(args.id), 'costs': DB.costs(args.id)}, ensure_ascii=False))
    elif args.action == 'export':
        payload = {'mission': DB.get_mission(args.id), 'results': DB.get_tasks(args.id), 'events': DB.events(args.id), 'costs': DB.costs(args.id)}
        fn = {'json': export_json, 'jsonl': export_jsonl, 'csv': export_csv}[args.format]
        print(fn(payload, args.path))
    elif args.action == 'list': print(json.dumps(DB.list_missions(), ensure_ascii=False))

if __name__ == '__main__': main()

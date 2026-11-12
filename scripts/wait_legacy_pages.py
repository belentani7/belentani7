"""Wait for the built-in branch publisher before promoting the complete artifact."""
from __future__ import annotations
import argparse
import json
import subprocess
import time

LEGACY_NAME = 'pages build and deployment'


def pending_legacy_runs(payload: dict, head: str) -> list[int]:
    return [run['id'] for run in payload.get('workflow_runs', [])
            if run.get('name') == LEGACY_NAME
            and run.get('head_sha') == head
            and run.get('status') != 'completed']


def wait(repository: str, head: str, timeout: float = 300) -> None:
    deadline = time.monotonic() + timeout
    while True:
        payload = json.loads(subprocess.check_output([
            'gh', 'api', f'/repos/{repository}/actions/runs?head_sha={head}&per_page=100'
        ], text=True))
        pending = pending_legacy_runs(payload, head)
        if not pending:
            print('No active branch-based Pages run remains for this commit.')
            return
        if time.monotonic() >= deadline:
            raise TimeoutError(f'Branch-based Pages runs still active: {pending}')
        print(f'Waiting for branch-based Pages runs: {pending}', flush=True)
        time.sleep(5)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', required=True)
    parser.add_argument('--head', required=True)
    args = parser.parse_args()
    wait(args.repository, args.head)

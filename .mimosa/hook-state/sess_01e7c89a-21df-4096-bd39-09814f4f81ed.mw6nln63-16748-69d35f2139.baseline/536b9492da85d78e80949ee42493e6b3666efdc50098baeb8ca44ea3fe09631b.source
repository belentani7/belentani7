from __future__ import annotations

import json
import logging
import time
from pathlib import Path


def configure(path: str | Path):
    target = Path(path); target.parent.mkdir(parents=True, exist_ok=True)
    logger = logging.getLogger('bellentani')
    logger.setLevel(logging.INFO)
    if not logger.handlers:
        handler = logging.FileHandler(target, encoding='utf8'); handler.setFormatter(logging.Formatter('%(message)s')); logger.addHandler(handler)
    return logger


def event(logger, kind: str, **payload):
    logger.info(json.dumps({'ts': time.time(), 'kind': kind, **payload}, ensure_ascii=False))

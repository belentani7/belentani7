from __future__ import annotations

import re
from urllib.parse import urlparse

URL_RE = re.compile(r'https?://[^\s,;]+', re.I)


def parse_mission(text: str) -> dict:
    urls = []
    for raw in URL_RE.findall(text):
        value = raw.rstrip(').]')
        if urlparse(value).scheme in {'http', 'https'}: urls.append(value)
    numbers = [int(x) for x in re.findall(r'\b(\d{1,5})\b', text)]
    max_pages = min(max(numbers[0], 1), 50) if numbers else 3
    return {
        'name': 'natural-language-mission',
        'objective': text.strip(),
        'urls': list(dict.fromkeys(urls)),
        'max_pages': max_pages,
        'retries': 2,
        'rate_limit': 1.0,
        'timeout': 20,
        'source': 'deterministic-natural-parser',
        'needs_discovery': not bool(urls)
    }

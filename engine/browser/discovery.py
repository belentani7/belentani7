from __future__ import annotations

from urllib.parse import quote, urlparse, parse_qs
import requests
from bs4 import BeautifulSoup


def discover(query: str, limit: int = 10, timeout: float = 20) -> list[str]:
    url = 'https://html.duckduckgo.com/html/?q=' + quote(query)
    response = requests.get(url, timeout=timeout, headers={'User-Agent': 'BellentaniEngine/0.1'})
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    urls = []
    for anchor in soup.select('a.result__a'):
        href = anchor.get('href')
        if not href: continue
        parsed = urlparse(href)
        if parsed.netloc.endswith('duckduckgo.com') and parse_qs(parsed.query).get('uddg'):
            href = parse_qs(parsed.query)['uddg'][0]
            parsed = urlparse(href)
        if parsed.scheme in {'http', 'https'} and parsed.netloc not in {'html.duckduckgo.com', 'duckduckgo.com'}:
            urls.append(href)
        if len(urls) >= limit: break
    return list(dict.fromkeys(urls))

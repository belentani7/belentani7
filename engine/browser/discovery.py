from __future__ import annotations

import ipaddress
from urllib.parse import parse_qs, quote, urlparse

import requests
from bs4 import BeautifulSoup


def _assert_public(url: str) -> str:
    """Rechaza esquemas no HTTP(S) y hosts internos (anti-SSRF)."""
    parsed = urlparse(url)
    if parsed.scheme not in {'http', 'https'}:
        raise ValueError('Solo se permiten URLs HTTP(S)')
    host = (parsed.hostname or '').lower()
    if not host or host in {'localhost', 'metadata.google.internal'}:
        raise ValueError('Host interno o vacio no permitido')
    try:
        addr = ipaddress.ip_address(host.strip('[]'))
    except ValueError:
        return url
    if addr.is_private or addr.is_loopback or addr.is_link_local or addr.is_reserved or addr.is_multicast:
        raise ValueError('IP interna no permitida')
    return url


def discover(query: str, limit: int = 10, timeout: float = 20) -> list[str]:
    url = _assert_public('https://html.duckduckgo.com/html/?q=' + quote(query))
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

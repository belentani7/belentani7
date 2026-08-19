from __future__ import annotations

import json
import re
from bs4 import BeautifulSoup
from urllib.parse import urlparse


def extract(snapshot):
    soup = BeautifulSoup(snapshot.html, 'html.parser')
    for tag in soup(['script', 'style', 'noscript']): tag.extract()
    text = ' '.join(soup.get_text(' ', strip=True).split())
    meta = {m.get('name', m.get('property', '')): m.get('content', '') for m in soup.find_all('meta') if m.get('content')}
    jsonld = []
    for node in BeautifulSoup(snapshot.html, 'html.parser').find_all('script', type='application/ld+json'):
        try: jsonld.append(json.loads(node.string or node.get_text()))
        except Exception: pass
    headers = snapshot.html[:200000].lower()
    tech = []
    signatures = {'WordPress': ['wp-content', 'wordpress'], 'Shopify': ['cdn.shopify.com', 'shopify'], 'React': ['react', '__next_data__'], 'Next.js': ['_next/static'], 'Vue': ['vue.js', 'data-v-'], 'Google Analytics': ['google-analytics.com', 'gtag(']}
    for name, needles in signatures.items():
        if any(x in headers for x in needles): tech.append(name)
    headings = [h.get_text(' ', strip=True) for h in BeautifulSoup(snapshot.html, 'html.parser').find_all(['h1','h2','h3'])][:50]
    links = [{'url': x, 'label': ''} for x in snapshot.links[:200]]
    return {
        'url': snapshot.final_url, 'title': snapshot.title or (soup.title.get_text(strip=True) if soup.title else ''),
        'description': meta.get('description', meta.get('og:description', '')), 'language': soup.html.get('lang') if soup.html else None,
        'text': text[:100000], 'headings': headings, 'technologies': tech, 'meta': meta, 'json_ld': jsonld, 'links': links,
        'word_count': len(text.split()), 'status': snapshot.status, 'mode': snapshot.mode,
        'evidence': [{'kind': 'page', 'url': snapshot.final_url, 'content_hash': snapshot.content_hash, 'fetched_at': snapshot.fetched_at}]
    }

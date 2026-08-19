from __future__ import annotations

import asyncio
import hashlib
import time
from dataclasses import dataclass, asdict
from urllib.parse import urljoin, urlparse

import requests
from engine.browser.policy import CrawlPolicy
from engine.storage.cache import CacheStore


@dataclass
class PageSnapshot:
    url: str
    final_url: str
    status: int
    title: str
    html: str
    links: list[str]
    fetched_at: float
    content_hash: str
    screenshot_path: str | None = None
    mode: str = 'http'

    def as_dict(self):
        return asdict(self)


class Navigator:
    def __init__(self, timeout: float = 20, rate_limit: float = 1.0, user_agent: str = 'BellentaniEngine/0.1', cache_dir: str | None = None, respect_robots: bool = True):
        self.timeout = timeout
        self.interval = rate_limit
        self.user_agent = user_agent
        self._last: dict[str, float] = {}
        self.policy = CrawlPolicy(user_agent) if respect_robots else None
        self.cache = CacheStore(cache_dir) if cache_dir else None

    def _wait(self, host: str):
        delay = self.interval - (time.monotonic() - self._last.get(host, 0))
        if delay > 0: time.sleep(delay)
        self._last[host] = time.monotonic()

    def fetch(self, url: str, screenshot_path: str | None = None) -> PageSnapshot:
        parsed = urlparse(url)
        if parsed.scheme not in {'http', 'https'}: raise ValueError('Solo se permiten URLs HTTP(S)')
        if self.policy and not self.policy.allowed(url): raise PermissionError(f'robots.txt no permite {url}')
        if self.cache:
            cached = self.cache.get(url)
            if cached:
                return PageSnapshot(**cached)
        self._wait(parsed.netloc)
        try:
            return self._fetch_playwright(url, screenshot_path)
        except Exception:
            self._wait(parsed.netloc)
            r = requests.get(url, timeout=self.timeout, headers={'User-Agent': self.user_agent}, allow_redirects=True)
            r.raise_for_status()
            snap = PageSnapshot(url, r.url, r.status_code, '', r.text, [], time.time(), hashlib.sha256(r.content).hexdigest(), None, 'http')
            if self.cache: self.cache.set(url, snap.as_dict())
            return snap

    def _fetch_playwright(self, url: str, screenshot_path: str | None):
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(user_agent=self.user_agent)
            response = page.goto(url, wait_until='domcontentloaded', timeout=int(self.timeout * 1000))
            page.wait_for_timeout(300)
            html = page.content(); title = page.title(); final = page.url
            links = page.eval_on_selector_all('a[href]', "els => els.map(e => e.href).filter(Boolean)")[:200]
            shot = None
            if screenshot_path:
                page.screenshot(path=screenshot_path, full_page=True); shot = screenshot_path
            browser.close()
            snap = PageSnapshot(url, final, response.status if response else 0, title, html, links, time.time(), hashlib.sha256(html.encode()).hexdigest(), shot, 'playwright')
            if self.cache: self.cache.set(url, snap.as_dict())
            return snap

    def crawl(self, seed: str, max_pages: int = 5, screenshot_dir: str | None = None):
        seen, queue, pages = set(), [seed], []
        root = urlparse(seed).netloc
        while queue and len(pages) < max_pages:
            current = queue.pop(0)
            if current in seen: continue
            seen.add(current)
            try:
                shot = f'{screenshot_dir}/{len(pages)+1}.png' if screenshot_dir else None
                snap = self.fetch(current, shot); pages.append(snap)
                for link in snap.links:
                    p = urlparse(urljoin(snap.final_url, link))
                    clean = f'{p.scheme}://{p.netloc}{p.path}'
                    if self.policy and not self.policy.allowed(clean, root): continue
                    if p.netloc == root and clean not in seen and clean not in queue: queue.append(clean)
            except Exception:
                continue
        return pages

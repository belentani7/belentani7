from __future__ import annotations

import urllib.robotparser
from urllib.parse import urlparse

class CrawlPolicy:
    def __init__(self, user_agent: str, allow_external: bool = False):
        self.user_agent = user_agent; self.allow_external = allow_external; self._robots = {}
    def allowed(self, url: str, root_host: str | None = None) -> bool:
        p = urlparse(url)
        if p.scheme not in {'http', 'https'}: return False
        if root_host and not self.allow_external and p.netloc != root_host: return False
        key = f'{p.scheme}://{p.netloc}'
        if key not in self._robots:
            rp = urllib.robotparser.RobotFileParser(); rp.set_url(key + '/robots.txt')
            try: rp.read()
            except Exception: self._robots[key] = None
            else: self._robots[key] = rp
        rp = self._robots[key]
        return True if rp is None else rp.can_fetch(self.user_agent, url)

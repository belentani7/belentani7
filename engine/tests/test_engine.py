# -*- coding: utf-8 -*-
from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
import requests

from engine.browser.navigation import Navigator

from engine.core.mission import MissionEngine
from engine.core.natural import parse_mission
from engine.storage.cache import CacheStore
from engine.storage.database import Database




class EngineTests(unittest.TestCase):
    def test_engine_with_controlled_http_transport(self):
        response = requests.Response()
        response.status_code = 200
        response.url = 'https://public.example.invalid/'
        response._content = b'<!doctype html><html lang="es"><head><title>Empresa Real</title><meta name="description" content="Sitio de prueba"></head><body><h1>Empresa Real</h1><script type="application/ld+json">{"@type":"Organization","name":"Empresa Real"}</script></body></html>'
        with tempfile.TemporaryDirectory() as tmp, \
             patch.object(Navigator, '_fetch_playwright', side_effect=RuntimeError('HTTP fixture mode')), \
             patch('engine.browser.navigation.requests.get', return_value=response) as fetch:
            db = Database(Path(tmp) / 'db.sqlite')
            engine = MissionEngine(db, Path(tmp) / 'artifacts')
            mid = engine.run({'objective': 'extrae información', 'urls': [response.url], 'max_pages': 1, 'rate_limit': 0, 'respect_robots': False})
            mission = db.get_mission(mid)
            tasks = db.get_tasks(mid)
            self.assertEqual(mission['status'], 'completed')
            self.assertEqual(tasks[0]['result']['pages'][0]['title'], 'Empresa Real')
            self.assertEqual(tasks[0]['result']['pages'][0]['json_ld'][0]['name'], 'Empresa Real')
            self.assertTrue(tasks[0]['result']['pages'][0]['evidence'])
            fetch.assert_called_once()
            self.assertEqual(fetch.call_args.args[0], response.url)

    def test_internal_targets_are_rejected_before_any_transport(self):
        navigator = Navigator(respect_robots=False)
        with patch('engine.browser.navigation.requests.get') as fetch, \
             patch.object(navigator, '_fetch_playwright') as browser:
            for url in ('http://127.0.0.1/', 'http://localhost/', 'http://10.0.0.1/', 'http://169.254.169.254/', 'file:///etc/passwd'):
                with self.subTest(url=url), self.assertRaises(ValueError):
                    navigator.fetch(url)
            fetch.assert_not_called()
            browser.assert_not_called()

    def test_natural_parser_and_cache(self):
        spec = parse_mission('Analiza 500 empresas en https://example.com y devuelve SEO')
        self.assertEqual(spec['urls'], ['https://example.com'])
        self.assertEqual(spec['max_pages'], 50)
        with tempfile.TemporaryDirectory() as tmp:
            cache = CacheStore(Path(tmp), ttl=60)
            cache.set('url', {'url': 'https://example.com'})
            self.assertEqual(cache.get('url')['url'], 'https://example.com')

    def test_recover_orphans(self):
        with tempfile.TemporaryDirectory() as tmp:
            db = Database(Path(tmp) / 'db.sqlite')
            mid = db.create_mission({'urls': ['https://example.com']})
            db.update_mission(mid, 'running')
            db.recover_orphans()
            self.assertEqual(db.get_mission(mid)['status'], 'interrupted')

    def test_invalid_url_is_validated(self):
        with tempfile.TemporaryDirectory() as tmp:
            db = Database(Path(tmp) / 'db.sqlite'); engine = MissionEngine(db, Path(tmp) / 'artifacts')
            mid = engine.run({'objective': 'invalid', 'urls': ['file:///etc/passwd']})
            self.assertEqual(db.get_mission(mid)['status'], 'failed')


if __name__ == '__main__': unittest.main(verbosity=2)

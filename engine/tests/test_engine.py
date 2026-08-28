from __future__ import annotations

import threading
import tempfile
import unittest
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

from engine.core.mission import MissionEngine
from engine.core.natural import parse_mission
from engine.storage.cache import CacheStore
from engine.storage.database import Database


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        body = b'<!doctype html><html lang="es"><head><title>Empresa Real</title><meta name="description" content="Sitio de prueba real"></head><body><h1>Empresa Real</h1><p>Servicios de tecnologia y consultoria.</p><a href="/about">Sobre nosotros</a><script type="application/ld+json">{"@type":"Organization","name":"Empresa Real"}</script></body></html>'
        self.send_response(200); self.send_header('Content-Type', 'text/html'); self.send_header('Content-Length', str(len(body))); self.end_headers(); self.wfile.write(body)
    def log_message(self, *_): pass


class EngineTests(unittest.TestCase):
    def test_real_engine(self):
        with tempfile.TemporaryDirectory() as tmp:
            server = HTTPServer(('127.0.0.1', 0), Handler); threading.Thread(target=server.serve_forever, daemon=True).start()
            db = Database(Path(tmp) / 'db.sqlite'); engine = MissionEngine(db, Path(tmp) / 'artifacts')
            mid = engine.run({'objective': 'extrae información real', 'urls': [f'http://127.0.0.1:{server.server_port}'], 'max_pages': 1, 'rate_limit': 0})
            mission = db.get_mission(mid); tasks = db.get_tasks(mid); server.shutdown()
            self.assertEqual(mission['status'], 'completed')
            self.assertEqual(tasks[0]['result']['pages'][0]['title'], 'Empresa Real')
            self.assertEqual(tasks[0]['result']['pages'][0]['json_ld'][0]['name'], 'Empresa Real')
            self.assertTrue(tasks[0]['result']['pages'][0]['evidence'])

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

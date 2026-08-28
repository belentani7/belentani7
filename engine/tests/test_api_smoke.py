import unittest

from fastapi.testclient import TestClient
from engine.api.server import app


class ApiSmokeTests(unittest.TestCase):
    def test_health_and_missing_mission(self):
        client = TestClient(app)
        health = client.get('/health')
        self.assertEqual(health.status_code, 200)
        self.assertTrue(health.json()['ok'])
        missing = client.get('/missions/missing/status')
        self.assertEqual(missing.status_code, 404)


if __name__ == '__main__':
    unittest.main()

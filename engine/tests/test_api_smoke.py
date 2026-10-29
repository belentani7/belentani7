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

    def test_request_validation_and_openapi_contract(self):
        client = TestClient(app)
        missing_objective = client.post('/missions', json={'objective': 'x', 'urls': []})
        self.assertEqual(missing_objective.status_code, 422)
        too_many_pages = client.post('/missions', json={'objective': 'Inspect', 'max_pages': 51})
        self.assertEqual(too_many_pages.status_code, 422)
        schema = client.get('/openapi.json')
        self.assertEqual(schema.status_code, 200)
        self.assertIn('/missions', schema.json()['paths'])
        self.assertIn('post', schema.json()['paths']['/missions'])


if __name__ == '__main__':
    unittest.main()

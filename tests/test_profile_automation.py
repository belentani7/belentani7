import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from self_repair import suggestions
from self_improve import recommendations
from self_update import snapshot


class ProfileAutomationTests(unittest.TestCase):
    def test_repair_plan_does_not_apply_changes(self):
        report = {'findings': [{'severity': 'error', 'message': 'Missing local path: ./missing.svg'}]}
        plan = suggestions(report)
        self.assertEqual(plan['mode'], 'review-only')
        self.assertFalse(plan['suggestions'][0]['automatically_applied'])

    def test_improve_plan_does_not_invent_metrics(self):
        report = {'ok': True, 'external_links_unchecked': ['https://github.com']}
        proposal = recommendations(report, None)
        self.assertIsNone(proposal['metrics_source'])
        self.assertTrue(any('do not invent' in p for p in proposal['proposals']))

    def test_snapshot_public_fields_and_source(self):
        from io import BytesIO
        from contextlib import contextmanager
        @contextmanager
        def fake_open(*args, **kwargs):
            yield BytesIO(b'{"login":"belentani7","public_repos":94,"followers":0,"following":0}')
        with patch('self_update.urlopen', fake_open):
            data = snapshot('belentani7')
        self.assertEqual(data['source'], 'https://api.github.com/users/belentani7')
        self.assertEqual(data['public_repos'], 94)
        self.assertIn('fetched_at_utc', data)


if __name__ == '__main__':
    unittest.main()

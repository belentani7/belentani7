import unittest
from scripts.wait_legacy_pages import pending_legacy_runs


class PagesPublicationOrder(unittest.TestCase):
    def test_queued_running_and_waiting_publishers_must_finish_first(self):
        runs = [{'id': i, 'name': 'pages build and deployment', 'head_sha': 'current', 'status': state}
                for i, state in enumerate(('queued', 'in_progress', 'waiting'), 1)]
        self.assertEqual(pending_legacy_runs({'workflow_runs': runs}, 'current'), [1, 2, 3])

    def test_completed_publishers_cannot_overwrite_the_next_deployment(self):
        for conclusion in ('success', 'failure', 'cancelled'):
            run = {'id': 1, 'name': 'pages build and deployment', 'head_sha': 'current', 'status': 'completed', 'conclusion': conclusion}
            self.assertEqual(pending_legacy_runs({'workflow_runs': [run]}, 'current'), [])

    def test_other_commits_and_unrelated_workflows_do_not_block(self):
        runs = [
            {'id': 1, 'name': 'pages build and deployment', 'head_sha': 'old', 'status': 'in_progress'},
            {'id': 2, 'name': 'Deploy project landing page', 'head_sha': 'current', 'status': 'in_progress'},
        ]
        self.assertEqual(pending_legacy_runs({'workflow_runs': runs}, 'current'), [])

    def test_absent_legacy_workflow_requires_no_wait(self):
        self.assertEqual(pending_legacy_runs({'workflow_runs': []}, 'current'), [])

import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from scripts.publish_project_sites import checked_source, copy_static_site, MANIFEST


class ProjectPublication(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.source = self.root / 'music-os'
        self.source.mkdir()
        (self.source / 'index.html').write_text('<!doctype html><html lang="es"></html>')

    def test_pinned_commit_is_required(self):
        with patch('scripts.publish_project_sites.subprocess.check_output', return_value='wrong\n'):
            with self.assertRaisesRegex(ValueError, 'Unexpected source commit'):
                checked_source(self.root, 'music-os', 'expected')

    def test_matching_source_commit_is_accepted(self):
        with patch('scripts.publish_project_sites.subprocess.check_output', return_value='expected\n'):
            self.assertEqual(checked_source(self.root, 'music-os', 'expected'), self.source)

    def test_static_artifact_contains_only_public_site_files(self):
        (self.source / 'style.css').write_text('body{color:white}')
        target = self.root / 'published'
        copy_static_site(self.source, target)
        self.assertEqual(sorted(x.name for x in target.iterdir()), ['index.html', 'style.css'])

    def test_private_history_or_source_files_are_rejected(self):
        for name in ('music_os_history.json', 'app.py', '.env'):
            path = self.source / name
            path.write_text('private test fixture')
            with self.subTest(name=name), self.assertRaises(ValueError):
                copy_static_site(self.source, self.root / 'published')
            path.unlink()
        self.assertFalse((self.root / 'published').exists())

    def test_symbolic_links_cannot_publish_files_outside_the_site(self):
        private = self.root / 'private.txt'
        private.write_text('private test fixture')
        (self.source / 'leak.css').symlink_to(private)
        with self.assertRaises(ValueError):
            copy_static_site(self.source, self.root / 'published')

    def test_workflow_and_manifest_reference_the_same_immutable_versions(self):
        manifest = json.loads(MANIFEST.read_text())
        workflow = (MANIFEST.parents[2] / '.github/workflows/deploy-pages.yml').read_text()
        for entry in manifest.values():
            self.assertRegex(entry['commit'], r'^[0-9a-f]{40}$')
            self.assertIn(entry['commit'], workflow)
            self.assertIn(entry['repository'], workflow)

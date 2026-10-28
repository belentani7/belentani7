import tempfile
import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from healthcheck import inspect


class HealthcheckTests(unittest.TestCase):
    def test_valid_readme_and_asset(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'asset.svg').write_text('<svg/>', encoding='utf-8')
            (root / 'README.md').write_text('# Profile\n![Description](asset.svg)\n[Site](https://github.com)', encoding='utf-8')
            result = inspect(root / 'README.md', root)
            self.assertTrue(result['ok'], result)
            self.assertEqual(result['links_checked'], 2)

    def test_missing_asset_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'README.md').write_text('# Profile\n![Description](missing.svg)', encoding='utf-8')
            self.assertFalse(inspect(root / 'README.md', root)['ok'])

    def test_empty_alt_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'README.md').write_text('# Profile\n<img src="https://github.com/logo.svg">', encoding='utf-8')
            self.assertFalse(inspect(root / 'README.md', root)['ok'])

    def test_path_escape_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'README.md').write_text('# Profile\n[bad](../../etc/passwd)', encoding='utf-8')
            self.assertFalse(inspect(root / 'README.md', root)['ok'])


if __name__ == '__main__':
    unittest.main()

"""Assemble public project artifacts from the immutable CI checkouts only."""
from __future__ import annotations
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'docs/projects/sources.json'


def checked_source(sources: Path, slug: str, expected_commit: str) -> Path:
    candidate = sources / slug
    source = candidate.resolve()
    if candidate.is_symlink() or not source.is_dir():
        raise ValueError(f'Missing source checkout: {slug}')
    actual = subprocess.check_output(['git', '-C', str(source), 'rev-parse', 'HEAD'], text=True).strip()
    if actual != expected_commit:
        raise ValueError(f'Unexpected source commit for {slug}')
    return source


def copy_static_site(source: Path, destination: Path) -> None:
    files = list(source.rglob('*'))
    if not (source / 'index.html').is_file():
        raise ValueError('Static source has no index.html')
    for path in files:
        if path.is_symlink() or not path.resolve().is_relative_to(source.resolve()):
            raise ValueError('Static source contains a symbolic link')
        if path.is_file() and path.suffix.lower() not in {'.html', '.css', '.js', '.svg', '.png', '.jpg', '.webp', '.ico', '.webmanifest'}:
            raise ValueError(f'Unexpected static file type: {path.suffix}')
    shutil.copytree(source, destination, dirs_exist_ok=True)


def build(sources: Path, destination: Path, site_url: str) -> None:
    manifest = json.loads(MANIFEST.read_text())
    secure = checked_source(sources, 'secure-t', manifest['secure-t']['commit'])
    music = checked_source(sources, 'music-os', manifest['music-os']['commit'])
    destination.mkdir(parents=True, exist_ok=True)
    env = dict(os.environ, SITE_URL=site_url.rstrip('/') + '/secure-t/')
    subprocess.run([sys.executable, str(secure / 'scripts/build_site.py'), '--destination', str((destination / 'secure-t').resolve())], cwd=secure, env=env, check=True)
    copy_static_site(music / 'site', destination / 'music-os')
    print('Published artifacts assembled from pinned public commits.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--sources-root', type=Path, required=True)
    parser.add_argument('--destination', type=Path, default=ROOT / 'docs/projects')
    parser.add_argument('--site-url', default='https://www.belentani.es/belentani7/projects')
    args = parser.parse_args()
    build(args.sources_root.resolve(), args.destination.resolve(), args.site_url)

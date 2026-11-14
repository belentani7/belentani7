#!/usr/bin/env python3
"""Genera assets/profile-stats.svg con datos REALES de la API de GitHub.

Uso:  python scripts/generar-stats-perfil.py
Salida: assets/profile-stats.svg  (fecha de generación dentro del SVG)

Sin dependencias: usa `gh api` si existe, si no api.github.com anónimo.
Ningún número se inventa: todo viene de la respuesta de la API.
"""
import json
import shutil
import subprocess
import sys
from datetime import datetime, timezone

USER = "belentani7"
OUT = "assets/profile-stats.svg"

LANG_COLORS = {
    "HTML": "#e34c26",
    "Python": "#3572A5",
    "TypeScript": "#3178c6",
    "JavaScript": "#f1e05a",
}


def gh_api(path):
    if shutil.which("gh"):
        out = subprocess.run(
            ["gh", "api", path], capture_output=True, text=True, check=True
        )
        return json.loads(out.stdout)
    import urllib.request

    with urllib.request.urlopen(f"https://api.github.com{path}", timeout=30) as r:
        return json.load(r)


def main():
    user = gh_api(f"/users/{USER}")
    repos = gh_api(f"/users/{USER}/repos?per_page=100&type=public")

    n_repos = user["public_repos"]
    stars = sum(r["stargazers_count"] for r in repos)
    forks = sum(r["forks_count"] for r in repos)
    size_mb = sum(r["size"] for r in repos) / 1024
    langs = {}
    for r in repos:
        if not r["fork"] and r["language"]:
            langs[r["language"]] = langs.get(r["language"], 0) + 1
    total_langs = sum(langs.values())
    last_push = max(r["updated_at"] for r in repos)[:10]
    since = user["created_at"][:10]
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    cells = [
        ("Repos públicos", str(n_repos)),
        ("Stars", str(stars)),
        ("Forks", str(forks)),
        ("Seguidores", str(user["followers"])),
        ("Siguiendo", str(user["following"])),
        ("Miembro desde", since),
    ]
    # parrilla 3x2
    cw, ch = 200, 74
    grid_w, grid_x, grid_y = 3 * cw, 24, 92
    cell_svg = []
    for i, (label, value) in enumerate(cells):
        cx, cy = grid_x + (i % 3) * cw, grid_y + (i // 3) * ch
        cell_svg.append(
            f'<rect x="{cx}" y="{cy}" width="{cw - 10}" height="{ch - 10}" rx="8" '
            f'fill="#161b22" stroke="#30363d"/>'
        )
        cell_svg.append(
            f'<text x="{cx + 14}" y="{cy + 30}" fill="#8b949e" font-size="12" '
            f'font-family="monospace">{label}</text>'
        )
        cell_svg.append(
            f'<text x="{cx + 14}" y="{cy + 56}" fill="#e6edf3" font-size="20" '
            f'font-weight="bold" font-family="monospace">{value}</text>'
        )

    # barras de lenguaje
    bar_x, bar_y, bar_max_w = 24, 252, 592
    lang_svg = [
        f'<text x="{bar_x}" y="{bar_y - 8}" fill="#8b949e" font-size="12" '
        f'font-family="monospace">Lenguajes detectados por GitHub '
        f'({total_langs} repos sin fork, {last_push})</text>'
    ]
    row_h = 24
    for i, (lang, n) in enumerate(sorted(langs.items(), key=lambda kv: -kv[1])):
        y = bar_y + 12 + i * row_h
        w = round(bar_max_w * n / total_langs)
        color = LANG_COLORS.get(lang, "#8b949e")
        pct = round(100 * n / total_langs)
        lang_svg.append(
            f'<text x="{bar_x}" y="{y + 12}" fill="#c9d1d9" font-size="12" '
            f'font-family="monospace">{lang}</text>'
            f'<rect x="{bar_x + 110}" y="{y}" width="{w}" height="12" rx="2" fill="{color}"/>'
            f'<text x="{bar_x + 118 + w}" y="{y + 11}" fill="#8b949e" font-size="12" '
            f'font-family="monospace">{n} · {pct}%</text>'
        )

    height = bar_y + 12 + len(langs) * row_h + 40
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="{height}" font-family="monospace">
<rect width="640" height="{height}" rx="12" fill="#0d1117"/>
<rect x="1" y="1" width="638" height="{height - 2}" rx="11" fill="none" stroke="#30363d"/>
<text x="24" y="38" fill="#e6edf3" font-size="16" font-weight="bold">@{USER} — datos reales del perfil</text>
<text x="24" y="60" fill="#8b949e" font-size="12">generado el {today} desde api.github.com · scripts/generar-stats-perfil.py</text>
{chr(10).join(cell_svg)}
{chr(10).join(lang_svg)}
<text x="24" y="{height - 14}" fill="#484f58" font-size="11">Los números son la respuesta de la API en el momento de generar; no son garantía de resultado.</text>
</svg>
'''
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(svg)
    print(f"OK {OUT}  repos={n_repos} stars={stars} langs={langs}")


if __name__ == "__main__":
    sys.exit(main())

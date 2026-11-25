# Contribuir a `belentani7`

Este repositorio es la vitrina pública del ecosistema **belentani7**: un sitio
estático sin build en `docs/`, el catálogo de productos, la auditoría unificada
y las herramientas de navegador de *Living Machine*.

La regla que gobierna todo lo demás: **lo que no se puede verificar, no se
afirma.** Un despliegue verde, un test y una medición en un README son tipos de
evidencia distintos y este repositorio los trata como tales.

## Requisitos

| Herramienta | Versión | Para qué |
|---|---|---|
| Node.js | ≥ 22.12 (`.nvmrc`) | tests de las herramientas de navegador, lint, build del playground |
| Python | ≥ 3.10 (`.python-version` fija 3.12) | auditoría del sitio, contratos de publicación, tests |
| Make | cualquiera | atajos de `make check` |

El sitio publicado **no tiene dependencias**: `docs/` se sirve tal cual (Vercel
usa `installCommand: ""` y `buildCommand: ""`). No añadas un paso de build para
publicar HTML/CSS/JS que ya funciona sin él.

## Puesta en marcha

```bash
git clone https://github.com/belentani7/belentani7.git
cd belentani7
npm ci            # solo para lint, tipado, tests de componentes y del playground
make check        # doctor + tests de Node + tests de Python + auditoría del sitio
```

## Comandos

| Comando | Efecto |
|---|---|
| `make check` | Puerta completa: `doctor`, tests Node y Python, auditoría del sitio |
| `make test` | Tests de Node (`docs/living-machine/*.test.cjs`) y de Python (`tests/`) |
| `npm test` | Igual que `make test`, sin necesitar `node_modules` |
| `npm run verify` | Lint + tipado + tests + auditoría + doctor |
| `python3 scripts/doctor.py` | Comprueba estructura y reglas del repositorio (solo lectura) |
| `python3 scripts/audit_site.py` | Auditoría de accesibilidad, SEO, higiene y peso de `docs/` |
| `python3 scripts/audit_site.py --include-root --strict` | Incluye las páginas raíz y falla ante cualquier aviso |
| `python3 scripts/serve_docs.py --port 4173` | Sirve `docs/` por HTTP sin dependencias |
| `python3 scripts/profile_evidence.py` | Auditoría reproducible de las afirmaciones del perfil |
| `npm run dev` / `npm run build` | Playground de componentes (React + Vite), **no** es el sitio publicado |
| `npm run test:e2e` | Playwright contra `docs/` servido por `scripts/serve_docs.py` (requiere `npx playwright install chromium`) |

Todos los comandos de este repositorio deben funcionar sin red salvo
`profile_evidence.py`, que consulta la API pública de GitHub para comprobar la
visibilidad de los repositorios citados.

## Mapa del repositorio

```
docs/                     ← artefacto publicado (HTML, CSS, JS, sitemap, robots)
index.html, …             ← espejo raíz de las páginas legales (byte a byte igual)
assets/                   ← CSS/JS/SVG del sitio
brand/                    ← tokens y material de marca
scripts/                  ← herramientas internas (Python y Node)
tests/                    ← contratos ejecutables (unittest, sin dependencias)
e2e/                      ← Playwright sobre el sitio real
src/                      ← playground de componentes (React + Vite + Vitest)
engine/                   ← motor de misiones (FastAPI, suite propia)
```

## Reglas de cambio

1. **Regresión cero.** Si un cambio rompe algo que funcionaba, se revierte. El
   contrato de publicación (`tests/test_published_mirrors.py`), los enlaces del
   portal (`tests/test_portal_links.py`) y la evidencia del perfil
   (`tests/test_profile_evidence.py`) no se relajan: se corrigen de raíz.
2. **Espejos byte a byte.** Si editas `index.html`, `docs.html`,
   `accesibilidad.html`, `privacidad.html` o `404.html`, copia el archivo a
   `docs/` en el mismo commit. `make check` falla si divergen.
3. **Sin secretos.** Nunca commitees tokens, claves ni credenciales. `gitleaks`
   y el workflow *Repository Security* lo comprueban; `.gitignore` bloquea
   `.env*`, `*.pem`, `*.key`.
4. **Sin rastreo ni terceros.** Nada de imágenes remotas, widgets de métricas,
   CDNs ni analítica. La auditoría del sitio marca cualquier petición externa.
5. **Accesibilidad como gate.** Un `h1` por página, `lang` declarado, controles
   con nombre accesible, enlaces con texto, foco visible y movimiento reducido.
6. **Peso acotado.** Cada documento HTML por debajo de 300 kB y cada bloque de
   CSS/JS en línea por debajo de 80 kB (`scripts/audit_site.py --max-bytes`).
7. **Palabra dada.** Toda cifra nueva debe ser reproducible con un comando de
   este repositorio. Si no se puede reproducir, va marcada como **labelled
   unverified** y no cuenta como evidencia de producto.

## Flujo de trabajo

1. Abre una rama: `feat/<tema>`, `fix/<tema>`, `docs/<tema>`, `chore/<tema>`.
2. Haz cambios atómicos y verificables.
3. Ejecuta `make check` **y** `npm run verify` si tocaste el playground o el
   tipado. Ambos deben quedar en verde.
4. Commit con el formato `type(scope): resumen`
   (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `style`).
5. Abre un pull request usando la plantilla y explica *qué evidencia* sostiene
   el cambio (comando ejecutado y salida). Un PR sin verificación no se revisa.

## Criterio de entrega

Un cambio está terminado cuando:

- `make check` pasa en verde, sin avisos nuevos en `scripts/audit_site.py`.
- Los espejos raíz/`docs/` y el `sitemap.xml` son coherentes.
- Las afirmaciones nuevas están respaldadas por un comando reproducible o
  marcadas como no verificadas.
- `CHANGELOG.md` registra el cambio si afecta al producto publicado.

## Seguridad

Consulta [`SECURITY.md`](./SECURITY.md) y
[`SECURITY_AUDIT_PROTOCOL.md`](./SECURITY_AUDIT_PROTOCOL.md). Para reportar una
vulnerabilidad, usa el canal privado indicado allí; no abras un issue público
con detalles explotables.

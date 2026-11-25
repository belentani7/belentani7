# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-11-25

### Añadido
- `scripts/audit_site.py`: auditor de accesibilidad, SEO, higiene y peso del
  sitio publicado, sin dependencias, con `--json`, `--write`, `--strict`,
  `--list-rules` y códigos de salida documentados.
- `scripts/serve_docs.py`: servidor estático local (`docs/`) con tipos MIME
  correctos, cabeceras de seguridad y `--check` para autodiagnóstico.
- `tests/test_audit_site.py`, `tests/test_served_site.py`,
  `tests/test_published_mirrors.py`: 34 tests nuevos de contrato (95 en total).
- `e2e/public-site.spec.ts`: pruebas Playwright sobre el sitio real servido por
  HTTP, en lugar de sobre una aplicación inexistente.
- `CONTRIBUTING.md` y `CODE_OF_CONDUCT.md`: la gobernanza que `scripts/doctor.py`
  exigía y `.gitignore` estaba ocultando.
- Toolchain reproducible: `npm ci`, ESLint 10 (flat config), TypeScript 5.9,
  Vitest 5, Vite 8 y `package-lock.json` real.

### Corregido
- `docs/auditoria.html`, `docs/catalogo.html`, `productos.html`,
  `escaparate-v1.html` y `ecosistema.html` publicaban cinco copias anidadas del
  mismo documento (cinco `<header>`, cinco `<main id="contenido">`, cinco
  `<footer>` y cinco scripts WebGL). Se reducen a un único documento válido.
- Enlaces muertos del portal: `docs.html`, `accesibilidad.html`,
  `privacidad.html` y `404.html` ahora se publican dentro de `docs/`.
- Accesibilidad: `<main>` y enlace de salto en `docs/living-machine/index.html`,
  nombre accesible en los buscadores de herramientas y en el selector de
  archivos del estudio.
- `sitemap.xml` listaba páginas que ningún workflow publica; ahora describe el
  artefacto real y se publica junto a `robots.txt`.
- Contrato del perfil: `README.md` vuelve a declarar `## Selected systems` y la
  condición **labelled unverified**; `scripts/profile_evidence.py` pasa en verde
  con 9 sistemas y visibilidad pública verificada por API.
- `eslint.config.js` cargaba plugins con `await import()` dentro de un objeto
  `plugins` (nunca funcionó); `vite.config.mts` usaba `__dirname` en un módulo
  ESM y tomaba el `index.html` de la raíz como entrada del bundle.
- `tsconfig.node.json` era una referencia inexistente para `tsc -b`; se
  sustituye por un `tsconfig.json` único que cubre `src/`, `e2e/` y las configs.
- `scripts/doctor.py` inspeccionaba solo las 40 primeras páginas raíz.

### Cambiado
- Cabeceras de `vercel.json`: CSP, `Cross-Origin-Opener-Policy`,
  `X-DNS-Prefetch-Control` y políticas de caché para HTML, assets y SEO.
- CI: un job nuevo ejecuta lint, tipado, tests de componentes y build del
  playground; `quality.yml` valida además `doctor`, la suite de Python, la
  auditoría del sitio y el servidor HTTP.
- `.nvmrc` fija Node 22 (Node 20 está fuera de soporte) y los tests de Node se
  invocan con el glob `docs/living-machine/*.test.cjs`, que incluye
  `terminal.test.cjs` en todos los workflows.

### Eliminado
- `pnpm-lock.yaml` y `pnpm-workspace.yaml` vacíos (resolvían cero dependencias y
  contradecían el `npm ci` documentado) y `tsconfig.node.json` huérfano.

## [Unreleased]

### Added
- Initial project structure
- CI/CD pipeline with GitHub Actions
- Security scanning with CodeQL and Gitleaks
- Dependabot configuration for automated dependency updates
- Governance files (CODEOWNERS, SECURITY.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md)

### Changed
- Updated GitHub Actions to v5
- Removed `--if-present` from CI scripts
- Added explicit `continue-on-error: false` to security jobs

## [1.0.0] - 2026-10-25

### Added
- Initial release
- Core application features
- Documentation

<!-- repo-forge:changelog:inicio -->
## [No publicado]

### Añadido

- Ficha de máximo potencial, marca, plataforma y fases de monetización (`plataforma/`).
- Banco de datos canónico (`data/`) y doctor de reglas (`scripts/doctor.py`).
- Gobernanza pública: contribución, conducta, seguridad y plantillas de GitHub.

<!-- repo-forge:changelog -->
<!-- repo-forge:changelog:fin -->

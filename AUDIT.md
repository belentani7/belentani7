# Informe de Auditoría: belentani7

- **Fecha:** 2026-08-28
- **Stack detectado:** TypeScript · React 19 · Vite 7 · Express 5 · Tailwind CSS 4 · shadcn/ui · pnpm · three.js (WebGL)
- **Commits analizados:** 1 (`419b48c`) — repo con historial de un solo commit (snapshot)
- **Veredicto:** Sano (mejorable)

## Lo mejor del repo

1. **Calidad de ingeniería muy sólida.** El proyecto compila limpio: `pnpm check` (tsc --noEmit) y `pnpm build` (vite + esbuild) pasan sin errores. 1600+ módulos transformados correctamente.
2. **Buenas prácticas de seguridad ya integradas.** `.gitignore` es completo (incluye `.env*`, claves, logs) y hay un workflow dedicado de seguridad con **gitleaks** (`repo-security.yml`) corriendo en cada push/PR. No se encontró ningún secreto versionado en el árbol de git.
3. **CI/CD bien montado.** Tres workflows: deploy a GitHub Pages, calidad (typecheck + format + build) y escaneo de secretos. Permisos mínimos (`contents: read`, Principio de Menor Privilegio) y `actions/checkout@v4`/`@v5` (versiones modernas, sin vulnerabilidades de inyección conocidas).
4. **Documentación rica y coherente.** README, SECURITY.md, docs/, `magic/` kit, OMNIVERSE.md, directorio de datos estructurado. El README expresa claramente una "regla de preservación" de proyectos (no borrar).

## Hallazgos CRÍTICOS

Ninguno.

- No se hallaron secretos reales (claves API, tokens, passwords) en el código versionado. El escaneo de patrones (`sk-`, `AKIA`, `AIza`, `ghp_`, claves privadas, etc.) dio cero coincidencias en los 132 ficheros trackeados.

## Hallazgos ALTOS

Ninguno. No hay RCE, inyección SQL, pérdida de datos ni build roto.

## Hallazgos MEDIOS

- **`magic/plugin.js` usa sintaxis TypeScript con extensión `.js` (CORREGIDO).** El fichero contiene `import type { Plugin } from "opencode"` y una anotación de tipo (`async ({ project, hooks }): Promise<...>`), que es sintaxis TS. Con extensión `.js`, Prettier fallaba con un *SyntaxError* al intentar parsearlo, lo que rompía el paso `pnpm format:check` del workflow de calidad CI. **Acción:** renombrado a `magic/plugin.ts` (git mv, historial preservado 100%) y actualizadas las 2 referencias en `magic/README.md` y `magic/skill.md`.
- **`pnpm format:check` sigue fallando en CI por estilo no normalizado (no tocado).** Tras corregir el parse error anterior, Prettier reporta ~127 ficheros con diferencias de formato (comillas, punto y coma, etc.). Esto implica que el gate `format:check` de `quality.yml` está en rojo desde antes de la auditoría. No se reformataron los 127 ficheros: es un cambio masivo, de alto riesgo y fuera de una corrección mínima. **Recomendado:** ejecutar `pnpm format --write` en un PR propio (o añadir a `.prettierignore` los ficheros no relacionados con la app, ej. `magic/`).
- **Ficheros de depuración de Manus en el respositorio (revisar).** `client/public/__manus__/debug-collector.js` (845 líneas) intercepta `fetch`/XHR, consola y eventos de UI. Está confinado al dev-server de Vite: se inyecta solo en desarrollo (`vite.config.ts:82`, `transformIndexHtml` devuelve el HTML intacto en producción) y el endpoint `/__manus__/logs` solo existe en el middleware del server de desarrollo. El código incluye enmascarado de campos sensibles (`password`, `token`, `secret`, etc.). No es malware ni se envía a producción, pero conviene confirmar que está ligado a `vite-plugin-manus-runtime`/entorno Manus y no se filtra al bundle de producción.

## Añadido por el auditor

- `magic/plugin.js` → `magic/plugin.ts` (renombrado con `git mv`; historial conservado).
- `magic/README.md` y `magic/skill.md`: referencia a `plugin.ts`.
- Este `AUDIT.md` (informe; no es parte del producto).

## Próximos pasos recomendados

1. Normalizar el formato del repo (`pnpm format --write`) en un PR dedicado para que el gate `format:check` de CI pase en verde. Alternativa: restringir `.prettierignore`.
2. Confirmar que `debug-collector.js` y `vite-plugin-manus-runtime` quedan excluidos del build de producción (verificar el bundle `dist/public` no incluya instrumentación Manus).
3. Revisar `BUILT_IN_FORGE_API_KEY` y `BUILT_IN_FORGE_API_URL`: son variables de entorno leídas en `vite.config.ts` y no están versionadas (bien). Asegurarse de que no se exportan al cliente (deben quedar solo en el server/dev).
4. Considerar ampliar el historial de commits (el repo es un snapshot de un único commit); no bloquea nada, pero dificulta el rastreo.

## No tocado (pero anotado)

- `docs/` y `magic/` son propiedades del autor (capa "magic" del ecosistema); solo se corrigió la extensión del plugin.
- No se modificaron `.github/workflows/` (no había hallazgo crítico que lo justificara).
- `server/index.ts` es un servidor Express mínimo que sirve el SPA; no expone APIs ni almacena datos, por lo que no hay superficie de ataque relevante.

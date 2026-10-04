<p align="center">
  <img src="assets/terminal-header.svg" alt="Pedro Belentani - Arquitecto de sistemas de IA" width="100%">
</p>

## Pedro Belentani

**Arquitecto de sistemas de IA** — full-stack TypeScript/Python. Barcelona.
Construyo [NOIACORE](https://github.com/belentani7/NOIACORE): agentes, educacion abierta
y herramientas para el artista comunitario.

[![Portfolio](https://img.shields.io/badge/portfolio-belentani.es-0f766e?style=flat-square)](https://belentani.es)
[![Design System](https://img.shields.io/badge/Design%20System-27_auditorias_de_componente-6c5ce7?style=flat-square)](https://github.com/belentani7/belentani-design-system)
[![IA](https://img.shields.io/badge/IA-agentes%20%C2%B7%20orquestacion%20%C2%B7%20RAG-blue?style=flat-square)](https://github.com/belentani7/noiacore-labs)

---

### Como leer este perfil

Las cifras de esta pagina se miden contra la API de GitHub y llevan fecha.
Cuando una cifra no es verificable, no esta escrita.

- **Fuente:** `api.github.com` + `gh repo list belentani7 --limit 1000`
- **Medido:** 2026-10-04
- **Cobertura:** 488 de 488 repos (160 publicos + 328 privados)

---

### Estado real de la cuenta

| Metrica | Valor | Nota |
|---|---|---|
| Repositorios | **488** | 160 publicos · 328 privados |
| Forks | **0** | Todo el trabajo es original |
| Archivados | 110 | 378 activos |
| Estrellas | 3 | Ver nota abajo, sin adornos |
| Contribuciones (12 meses) | **4.086** | 3.901 commits · 76 PRs · 8 issues |
| Repos con homepage | 138 | Homepage declarado, no verificado que sirva |
| Cuenta creada | 2025-09-07 | 13 meses de actividad |

**Sobre las 3 estrellas y 0 seguidores:** es el dato mas honesto del perfil. No he
comprado seguidores ni estrellas. Los numeros grandes en GitHub vienen de mantener
proyectos abiertos durante anos; esta cuenta tiene 13 meses. Prefiero que el perfil
diga la verdad y que las estrellas lleguen por el trabajo.

### Aportaciones a terceros: 3 PRs, 1 mergeado

Medido con `author:belentani7 type:pr`:

| Destino | Estado |
|---|---|
| `firstcontributions/first-contributions` #124189 | mergeado 2026-08-31 |
| `huggingface/transformers` | abierto, sin merge |
| `QwenLM/qwen-code` | abierto, sin merge |

El unico mergeado es un repositorio de tutorial, asi que **no cuenta como aportacion
real**. No tengo contribuciones aceptadas en proyectos de terceros. Los repos
publicos y las issues abiertas de este perfil son el punto de partida.

---

### Que construyo hoy

#### Consolidacion de 3 familias — verificado 2026-10-04

El 2026-10-04 integre tres familias de codigo en sus repos de destino, cada una en la
rama `consolidacion/2026-10-04`, y verifique por API lo que llego de verdad:

| Repo | Rama | Commit | Ficheros en la rama |
|---|---|---|---|
| [duck-ecosystem](https://github.com/belentani7/duck-ecosystem) | `consolidacion/2026-10-04` | `139a5d25` | 5.951 |
| [NOIACORE](https://github.com/belentani7/NOIACORE) | `consolidacion/2026-10-04` | `1649a408` | 2.479 |
| [open-school](https://github.com/belentani7/open-school) | `consolidacion/2026-10-04` | `d3035554` | 11.368 |

Como se hizo:

1. **Clasificar antes de inventariar.** Una carpeta no es un proyecto por estar en el
   escritorio. 12 familias, cada una con su regla de pertenencia.
2. **Allowlist de tipos de fichero.** Entra codigo, documentacion y config. Salen
   binarios, imagenes, bases de datos, `.env*`, `.npmrc` y todo fichero
   `*secret*`, `*credential*` o `*password*`.
3. **Clasificador determinista de secretos** (fichero, linea, regla, veredicto),
   distinguiendo **base64 embebido** de un token real. Los dos casos existen en este
   codigo y confundirlos es la causa tipica de falsos positivos.
4. **Publicacion verificable por API:** `git/trees?recursive=1`, no por el exito del push.

**El detalle que importa:** GitHub Push Protection bloqueo el primer push de NOIACORE
por un token OAuth de Google real (`ya29.` en `.gdrive-rclone.ini`) que el escaner local
no habia detectado. Se elimino del commit y se reintento. El valor de verificar por API
esta en que el control del servidor supplemental al local, y en que los dos coinciden.

#### Plataformas destacadas

| Proyecto | Que es | Stack |
|---|---|---|
| [**open-school**](https://github.com/belentani7/open-school) | Instituto educativo digital universal: cursos modulares, certificacion e itinerarios | Next.js, TS, WCAG |
| [**agent-skills**](https://github.com/belentani7/agent-skills) | **311 skills** para agentes CLI (Claude Code, OpenCode, Codex) | Python, estandar Skill |
| [agent-skills-registry](https://github.com/belentani7/agent-skills-registry) | Distribucion global de skills para agentes | TypeScript |
| [**ManosAbiertas**](https://github.com/belentani7/ManosAbiertas) | Formacion gratuita en IA y Office, creador de CV, guias para derechohabientes | Vite, React, TS, PWA |
| [**Cruzando el Charco**](https://github.com/belentani7/Cruzando-el-charco) | Portal de acceso y orgullo LGBTQ+ en Barcelona para personas migrantes | Next.js, multilingue |
| [**Belentani Omega**](https://github.com/belentani7/belentani_Omega) | Ecosistema artistico: Omega, Belentani Omega, Jupyter Experiments y DUCK STUDIO | Three.js, WebGL, WebGPU |
| [**Belentani Design System**](https://github.com/belentani7/belentani-design-system) | Tokens glass/aluminium, componentes CSS puros, 12 tokens en produccion | TypeScript, CSS |
| [**ai-command-center**](https://github.com/belentani7/ai-command-center) | Centro de mando y unico trabajo con agentes de IA | TypeScript |
| [**secure-t**](https://github.com/belentani7/secure-t) | Suite de produccion musical web | Vite, Lua, WASM |

---

### Stack

**Frontend** · TypeScript · `React 19` · `Vite` · `Next.js` · `Tailwind` · `CSS` · `Three.js` · `WebGPU` · `GSAP` · `shadcn/ui`
**Backend** · Node.js · Python · `FastAPI` · `PostgreSQL` · `Prisma` · `PWA` · `Docker` · `GitHub Actions` · `WCAG`

---

### Como trabajo

1. **Accesibilidad desde el primer commit,** no como fase final. WCAG, navegacion por
   teclado y diseno accesible van en el primer commit.
2. **Graficos para lo que sirve antes que para lucirse.** El performance de GPU es un
   argumento narrativo, no un adorno.
3. **Documentar el por que, no el que.** Si el README no explica la funcion, es codigo muerto.
4. **Verificar antes de afirmar.** Comando ejecutado, salida real, cero *"deberia funcionar"*.
5. **Codigo abierto y formacion accesible** como decision de producto, no como marketing.

---

### Contacto

Web · [belentani.es](https://belentani.es) · Email · belentani7pedro@gmail.com · Ubicacion · Barcelona

**Abierto a:** proyectos de IA aplicada, educacion abierta, accesibilidad y portfolio ↔ GitHub

<!--
Cifras: api.github.com + gh repo list belentani7 --limit 1000
Medido: 2026-10-04 | Cobertura: 488 de 488 repos | Metodo: API, no scraping
-->
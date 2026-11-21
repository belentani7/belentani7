# Pedro Belentani · `belentani7`

[Artist website](https://belentani.es)

**Education and community**  
[Open School (source)](https://github.com/belentani7/open-school) ? [Cruzando el charco](https://belentani7.github.io/Cruzando-el-charco/) ? [Manos Abiertas (source)](https://github.com/belentani7/ManosAbiertas) ? [Aprende Brasil (source)](https://github.com/belentani7/aprende-brasil)

Artist, composer and creative technologist · AI systems and Trust & Safety projects

I compose music and build the digital worlds around it. My artist practice joins voice, narrative,
motion and WebGL; my engineering work spans agent systems, evaluation gates, local LLMs and MCP
tools. São Paulo · Barcelona · TypeScript · Python.

<img src="./assets/hero-2026.svg" alt="Pedro Belentani editorial banner presenting auditable AI systems, evaluation gates, and creative engineering interfaces." width="1280" height="420">

![Profile metrics generated from the GitHub API](assets/profile-stats.svg)

## Artist universe

**[Belentani: The Experience](https://belentani.es)** is the front door to the music and JUDAS
narrative. Its interactive galaxy lets visitors enter the lore, listen to the work and discover the
artist. The same world has two complementary tools: the private Belentani Studio Motion project develops kinetic components, while the private Belentani Visual Engine project explores procedural Three.js scenes from lore and code. Its source is not publicly accessible.

Not every project here stands alone. [ECOSISTEMA.md](./ECOSISTEMA.md) groups the six clusters that
only make sense read together — the three entrances to Omega, the Judas canon, the router and the
registry that need each other, open education, Barcelona community work, and the inspection tools.

## Selected projects — public scope, not inflated production claims

These projects have different maturity levels. A public repository, a successful build, or a Vercel Ready deployment is **not** proof that an application is a finished, independently verified product. Numbers below describe repository contents or dated checks, not customers, impact, savings or certifications.

### 01 — belentani.es
Artist website and experimental interactive narrative. Active work in progress; experience and navigation are still being reviewed.
- Source: https://github.com/belentani7/belentani.es
- Site: https://belentani.es (availability and visual behaviour not independently validated here)

### 02 — meta-skill
Offline Python heuristic router for agent tasks. A small browser demo can classify text locally; it does not invoke a language model or guarantee savings.
- Source: https://github.com/belentani7/meta-skill
- Demo: https://meta-skill-theta.vercel.app (deployment reported Ready; external browser access not separately verified)

### 03 — secure-t
Cybersecurity and responsible-AI learning material with a static campus. This is educational software and content, not an accredited university.
- Source: https://github.com/belentani7/secure-t
- Publication evidence: https://github.com/belentani7/secure-t/actions/runs/44302696476
- Site configured for https://www.belentani.es/secure-t/ (DNS/browser delivery requires separate validation)

### 04 — gpu-cost-optimizer
Python and browser-based heuristic estimator for diffusion workflow runtime, VRAM and approximate GPU spend. Its bundled rate data are historical, not live quotes. No percentage of real-world savings is established.
- Source: https://github.com/belentani7/gpu-cost-optimizer
- Browser calculator restored in commit 715831b853aa; deployment reported Ready by Vercel.

### 05 — kepler
Self-contained WebGL2 particle-galaxy experiment. The README documents measurements on one Intel UHD 620 configuration; they are not universal performance benchmarks.
- Source: https://github.com/belentani7/kepler
- GitHub Pages is configured for https://www.belentani.es/kepler/; public rendering needs independent checking.

### 06 — profile-lint
Python command-line linter for GitHub README content and optionally external links. **CLI tool, not a published web application.**
- Source: https://github.com/belentani7/profile-lint
- Evidence: 16 local unit tests passed on 18 November 2026; no external impact claim is made.

### 07 — Cruzando el Charco
Static multilingual community resource guide for LGTBIQ+ migrants, visitors and residents in Barcelona and Sitges. Contains a news/feed feature, but is **not** presented as an operating newsroom.
- Source: https://github.com/belentani7/Cruzando-el-charco
- Publication evidence: https://github.com/belentani7/Cruzando-el-charco/actions/runs/44348736537
- GitHub Pages configured for https://www.belentani.es/Cruzando-el-charco/; public browser access requires separate checking.

### 08 — open-school
Static educational catalogue. On 18 November 2026, Git tracked 440 HTML files, with 420 educational pages linked from the searchable homepage; **not** the previously claimed 5,639 currently published pages. Not a university or a verified course accreditation.
- Source: https://github.com/belentani7/open-school
- Catalogue commit: https://github.com/belentani7/open-school/commit/b4277ab82ac5
- GitHub Pages reported built; visual delivery not independently checked.

Private experiments, prototypes, scripts and internal counts are not included as public-product evidence.

## Writing & evidence

Project descriptions are scoped to what the repositories and dated checks support. Deployment status, a unit test and a README measurement are different kinds of evidence.

- Engineering evidence: ./docs/engineering-evidence-2026-10-29.md — commit counts, review windows and
  the limits of what activity metrics measure.
- Profile archive: ./docs/profile-archive-2026-10-29.md — previous versions of this page.
- Product sheet: ./plataforma/FICHA.md — measured scope, stack and known gaps.
- Doctrine: ./BIBLIA.md — vision, mission, rules and design tokens.
- Living Machine: ./docs/living-machine/index.html — browser tools that run on repository files, with
  no upload; a local demo, not a verified live deployment.
- Proof: ./PROOF.md - what the page can prove, claim by claim, and what would falsify it.
- Ecosystem map: ./ECOSISTEMA.md — which projects only make sense connected, and the entry point of
  each, checked with curl.

Private and experimental work is labeled and does not count as independent public-product evidence.

Source and reproduction: `scripts/profile_evidence.py` runs nine machine checks and exits non-zero
on drift. The same checks run in CI on every push.

## Stack

`TypeScript` `Python` `React 19` `Next.js` `Vite` `Tailwind` `Three.js` `Node.js` `Express` `FastAPI`
`tRPC 11` `PostgreSQL` `MySQL` `Drizzle` `Docker` `GitHub Actions` `Vercel` `MCP`

No third-party stats widgets, no visitor counters, no external tracking images. One local SVG cover;
everything else is text and local links.

## Tools and experiments

Browser tools that run on the **repository files** of this repo, uploading nothing: image conversion,
subtitles, CV reading, palette extraction.

- [Living Machine — tool desktop](./docs/living-machine/index.html)
- [Studio — conversion and subtitles](./docs/living-machine/studio.html)
- [Environment diagnostics](./docs/living-machine/diagnostics.html)

This showcase is a local demo over repository files: **not a verified live deployment**. Some pieces
stay private, archived or experimental and are deliberately excluded from the public catalogue.

*Made in Barcelona · Built with AI agents · project licences vary · Updated: 2026-11-18*

## Verificacion

```bash
npm install
npm test
```

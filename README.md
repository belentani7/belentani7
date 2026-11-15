# Pedro Belentani · `belentani7`

**AI systems you can audit.** Agent orchestration, evaluation gates and tooling for coding
agents. TypeScript · Python · Barcelona.

Most AI portfolios show what a model can do. This page shows what survives a check: every
system below links to a repository, a test or a number, and every number was measured on
hardware you can buy.

![Profile metrics generated from the GitHub API](assets/profile-stats.svg)

## Start here

| | System | What it answers | Verification |
|---|---|---|---|
| 01 | [belentani.es](https://github.com/belentani7/belentani.es) | An artist hub where a narrative universe, a music catalogue and a WebGL galaxy share one shell. Next.js · Three.js. | [Live](https://belentani.es) |
| 02 | [meta-skill](https://github.com/belentani7/meta-skill) | Routes an agent request to the right skill without spending a model call to decide. Python · CLI. | [Demo](https://meta-skill-theta.vercel.app) |
| 03 | [kepler](https://github.com/belentani7/kepler) | 200,000 particles, one draw call, no dependencies, no network requests. | **59.9 fps**, median frame 16.7 ms, p95 17.5 ms, 0.1 ms of CPU per frame on an Intel UHD 620 |
| 04 | [secure-t](https://github.com/belentani7/secure-t) | Open campus for cybersecurity and responsible AI: anonymous enrolment, automated tests. Next.js · TypeScript. | 398 HTML pages in the repository |
| 05 | [gpu-cost-optimizer](https://github.com/belentani7/gpu-cost-optimizer) | Cuts diffusion pipeline compute cost by up to 70%. Python · ComfyUI · ML. | Documented execution |
| 06 | [profile-lint](https://github.com/belentani7/profile-lint) | Lints profile READMEs: dead links, missing alt text, remote assets and claims nobody can check. | CI on three Python versions; found **85 images without alt text** across 7 READMEs |

Kepler's ceiling is 28,000 particles at a solid 60 fps; above that the p95 degrades before
the median does.

A system enters this list when its purpose is understandable, the public experience can be
walked through, and the repository explains how to run and verify it. Ideas, prototypes and
projects without that evidence stay out.

## Currently

- One narrative universe with a canon instead of a landing page: `belentani.es` ships it in
  four chapters, with the galaxy rendered in the browser rather than described in a build log.
- Agent tooling: skill registries, MCP gateways and evaluation harnesses, all with a command
  that fails loudly when the system drifts.

## Limits, stated up front

- Private work is described but never counted as evidence: a model evaluation guard, a
  governance control plane and a registry of 311 installable skills for 7 CLI agents live in
  private repositories.
- No claim here points at a deployment that was never reached.
- No third-party stats widgets, no visitor counters, no tracking images. One local SVG cover;
  everything else is text and local links.

## How I write and verify

- [Engineering evidence](./docs/engineering-evidence-2026-10-29.md) — commit counts, review
  windows, and the limits of what activity metrics actually measure.
- [Profile archive](./docs/profile-archive-2026-10-29.md) — previous versions of this page.
- [Product sheet](./platforma/FICHA.md) — measured scope, stack and known gaps.
- [Doctrine](./BIBLIA.md) — vision, mission, rules and design tokens.
- [Living Machine](./docs/living-machine/index.html) — browser tools that run on repository
  files with no upload. A local demo, not a verified live deployment.
- [Proof](./PROOF.md) — what this page can prove, claim by claim, and what would falsify it.

Source and reproduction: `scripts/profile_evidence.py` runs nine machine checks and exits
non-zero on drift. The same checks run in CI on every push.

## Stack

`TypeScript` `Python` `React 19` `Next.js` `Vite` `Tailwind` `Three.js` `Node.js` `Express`
`FastAPI` `tRPC 11` `PostgreSQL` `MySQL` `Drizzle` `Docker` `GitHub Actions` `Vercel` `MCP`

## Tools and experiments

Browser tools that run on the **repository files** of this repo, uploading nothing: image
conversion, subtitles, CV reading, palette extraction.

- [Living Machine — tool desktop](./docs/living-machine/index.html)
- [Studio — conversion and subtitles](./docs/living-machine/studio.html)
- [Environment diagnostics](./docs/living-machine/diagnostics.html)

## Contact

Barcelona · [belentani.es](https://belentani.es) · open to staff-level engineering work.

*Made in Barcelona · Built with AI agents · MIT/Apache-2.0 · Updated: 2026-11-15*
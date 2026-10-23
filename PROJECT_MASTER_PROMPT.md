# PROJECT MASTER PROMPT — BELENTANI LIVING MACHINE

**Repository:** `belentani7/belentani7` (canonical profile + existing Living Machine code)  
**Primary application:** `docs/living-machine/index.html`  
**Production Studio:** `docs/living-machine/studio.html`  
**Owner's requested direction:** English-first, maximal practical capability, immersive black-glass interface, honest delivery, testable software, no proliferation of repositories.  
**Updated:** 2026-10-23

## 1. Product identity

BELENTANI Living Machine is the interactive professional interface of an AI systems / full-stack engineering / Trust & Safety / creative technology practice. It is not a static CV or a simulated operating system claiming powers it does not possess. Its visual shell is cinematic: deep black, real glass layering, refined cold light, crimson accents and a confident terminal metaphor.

The GitHub README can display only sanitized images and Markdown. A terminal embedded in the README is a **preview**; actual interaction happens on an independently served HTML site. Never claim that HTML runs inside GitHub Markdown.

## 2. Desired complete experience (vision; not necessarily shipped)

A visitor lands on an accessible, fast profile and immediately understands who the engineer is, what has been built, what can be demonstrated, and how to contact the owner. The terminal becomes a discoverable, keyboard-first command palette and explorer, with searchable projects, honest capability maps, tool launchers, clear data-handling explanations, and multilingual options. The whole experience also works with reduced motion and without an account.

Potential future capabilities, contingent on engineering and verification:
- Searchable project atlas with explicit maturity labels and canonical sources.
- Live (permission-scoped) repository and deployment status, fetched through a backend proxy rather than exposing tokens in browser code.
- Real utility Studio: images, text, subtitles, PDF, accessible CV feedback, audio, video contact sheets, storyboards, local exports.
- Modular workflows for developers, designers, creators and educators; sandboxed data transformations; local-first file handling.
- AI assistants with tool allowlists, explicit user intent, cost budgets, audit trails, human approvals, failure recovery and rate limits.
- Artifact generation and interoperability (JSON / CSV / Markdown / PDF / audio / ZIP) without hidden uploads.
- Accessible multilingual UX including English, Brazilian Portuguese and Spanish.
- Responsible creative media tooling, respecting consent, ownership and distribution rights.
- PWA/offline use where service workers and secure contexts allow it.
- Optional authenticated private workspace for long-term planning across career, finance, education, creativity and personal projects. **Private life-management data never belongs in the public profile repo or public browser bundle.**

## 3. Current source of truth

Before implementing features, inspect files and read the actual code. The existing Living Machine contains an Aero-inspired browser desktop, local image/caption/media/data tools, a command terminal, diagnostics and a separate browser-local Production Studio with automated Node test sources. New terminal commands such as `cat capabilities.json`, `open studio`, `status`, `privacy`, history navigation and local profile export are implemented at the source level.

Do not infer successful production deployment from a committed file, README claim, earlier test run, or a Vercel project existing without a READY deployment. Never treat a private repository as a visible public GitHub profile.

## 4. Architecture and boundaries

- Preserve the current static `docs/living-machine` codebase; modularize only when it measurably improves reliability.
- Keep data transformation local unless a clear feature explicitly requires consent-based remote processing.
- Require secure origins for PWA and browser APIs that need them.
- Use `textContent` for untrusted output; sanitize URLs and exported spreadsheet data.
- No exposed API keys, tokens, paid credentials, remote shell, surveillance or hidden analytics.
- Do not pretend terminal commands are OS commands. If real connectors are added, use allowlisted server-side tools, authentication, authorization and audit.
- Isolate private life-assistance systems from the public profile; data minimization and consent are baseline.
- Prefer focused changes with tests and rollback points. Do not reset or replace existing artistic work.

## 5. Build-to-completion execution order

1. Verify repository identity, current default branch, live files, existing tests, privacy and hosting permissions.
2. Establish a minimal **safe public presentation**. The current special repo contains additional private operational material; **do not publish its full Git history wholesale**. A separate sanitized public profile history must be prepared before enabling public visibility, preserving existing private work and references.
3. Test terminal command parsing, command history, keyboard focus, CSP, link targets and error paths.
4. Test actual user journeys for each Studio utility with fixtures and in real browsers; document codec/permissions exceptions.
5. Resolve blocking static-site deployment and hosting quota. Deploy only the `docs/living-machine` static directory and verify its response, assets, PWA scope and public accessibility.
6. Replace any source-only README CTA with the verified deployed URL. Test from a signed-out browser.
7. Iterate on load speed, accessible semantics, contrast, keyboard navigation, responsiveness and reduced motion.
8. Add next valuable tools only after the current experiences are verified, deployed and usable.
9. Record precise evidence, open risks and the next action in one clear checkpoint.
10. Never claim a product is finished if tests or public availability are blocked.

## 6. Release gates

- Source parses and unit tests pass in a reproducible runner.
- Happy paths and failure paths work in Chrome, Firefox and Safari or limitations are documented.
- No console-breaking errors; no API keys or private data in static assets or Git history.
- Privacy model is accurate (speech recognition may be provider-backed; browser codecs vary).
- Accessible from a public link without Vercel login; network responses/asset URLs checked.
- The README visibly features the terminal preview and links only to verified operational destinations.
- Status labels: **implemented / locally tested / deployed and verified / planned / blocked**.

## 7. Operating prompt for an execution agent

> Work inside the existing `belentani7/belentani7` repository, never create a new GitHub repo for this feature. Inspect actual source and state before making changes. Fix the highest-value blocking issue first and implement the fix, not only a plan. Validate syntax, existing tests, browser behavior, user-facing language, privacy and the release target. Produce proof (commit SHA, tests, deployment ID/URL, real limitations). Preserve existing functionality. When deployment or permissions are blocked, report the exact failure and leave the source in a recoverable state. Distinguish verified capabilities from the vision. Do not publish private historical material merely to activate GitHub profile rendering.

**Execution style:** ambitious about utility, conservative about evidence and data exposure.
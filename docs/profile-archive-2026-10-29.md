<!-- Historical public README snapshot preserved before the 2026-10-29 editorial refresh. Some claims, links and project states may be outdated. See the root README for current positioning. -->

<div align="center">

<a href="./docs/living-machine/index.html"><img src="./assets/profile-terminal.svg" width="100%" alt="BELENTANI living machine — English-first interactive terminal preview. Click to inspect the app source."></a>

# PEDRO BELENTANI
**AI-Augmented Product Engineering · Agentic Systems · Trust & Safety**

*Barcelona metro · Brazilian perspective · ES / PT-BR / EN*

[**Portfolio**](https://belentani.es) · [**Repository atlas**](https://github.com/belentani7/belentani-omg-portal) · [**Terminal source**](./docs/living-machine/index.html) · [**Studio source**](./docs/living-machine/studio.html) · [**Capabilities**](#technology--domains) · [**Selected work**](#selected-work) · [**Contact**](mailto:belentani7pedro@gmail.com)

</div>

---

## One index for all the code

The **[Belentani Software Atlas](https://github.com/belentani7/belentani-omg-portal)** is the single entry point: a curated atlas of the five mother repositories, the cloned engines and the working demos, plus a **[searchable repository index](https://github.com/belentani7/belentani-omg-portal)** with category, language, visibility, live-demo and archive filters.

Use it to find the code, the demo or the context without guessing repository names. Private and archived repositories are listed honestly; access and status are shown, not implied.

---

### Profile terminal — a working application, not a fake CLI

The preview above is a GitHub-compatible SVG; **the real browser terminal** runs in the Living Machine application. It supports command history, simulated read-only navigation (`help`, `whoami`, `ls`, `cat capabilities.json`, `status`, `privacy`, `roadmap`), local JSON export and safe links to working tools. It cannot execute arbitrary system commands.

**Run the full experience locally:**

```bash
python -m http.server 8000 --directory docs/living-machine
# Open http://localhost:8000/index.html
```

**Publication boundary:** This repository is already public. Never commit credentials, private project-management data or unreviewed personal materials here. GitHub renders profile Markdown and images, not executable HTML/JavaScript. A separate web deployment must be verified before any interactive terminal is described as publicly live.

---

## One-person, multi-discipline delivery · AI-augmented product engineering

**Positioning:** AI-Augmented Full-Stack Product Engineer · Agentic Systems Orchestrator · Trust & Safety.  
**Target role families:** Forward-Deployed Engineer (FDE), AI Solutions Engineer, AI Automation Engineer and Product Engineer. **Super IC** and **team-of-one** describe a working model, not a previously held corporate title or a claim that one human can replace every specialist.

I take ownership of the path from an ambiguous problem to a testable product: discovery, technical scope, workflow mapping, interface, API, AI-agent coordination, human review, operational guardrails and practical delivery. I can learn unfamiliar tools quickly and select technologies for the task rather than impose one stack on every product. My prior professional experience in multilingual customer operations and Trust & Safety adds context about policies, exceptions, user needs and risk.

| What I can cover in an AI-augmented engagement | Evidence & limits |
| --- | --- |
| Product discovery and scope | Independent planning, requirements and structured workflows; client-side FDE delivery outcomes must be demonstrated per engagement |
| Full-stack product implementation | [Belentani CV Studio](https://github.com/belentani7/Belentani.cv-ai), React/TypeScript and API work; distinguish repo features from tested live deployment |
| Agent and model orchestration | [Meta-Skill](https://github.com/belentani7/meta-skill), multi-model routing and cost-aware experimentation; no invented productivity ratios |
| Safety, verification and deployment discipline | [SAFE-EXEC](https://github.com/belentani7/safe-exec) is a documented Python execution-safety prototype, **not** a certified production sandbox |
| Multilingual education and product | [LinguaForge](https://github.com/belentani7/linguaforge) documents CEFR progression, SRS, source licensing and implementation limits |
| Experience design and creative engineering | [Judas Experience](https://github.com/belentani7/judas-experience) combines WebGL, narrative interaction and testable static resources |
| Human judgment, policy and escalations | Historical customer-service role at Sellbytel for Inditex; moderation and community work for TELUS/CCC (2018–2025) |

**Operating promise:** broad technical ownership with clear scope, measurements and accountability. I will not claim 'replaced a 10-person team', 'fully production-ready', 'certified C1' or guaranteed ROI without supporting evidence.

---

## A profile designed to be used, not only read

I build software and interactive experiences at the intersection of **engineering, applied artificial intelligence, human interpretation and artistic direction**.

My work spans full-stack product development, AI-agent workflows, automation, multilingual education, accessible interfaces and media-oriented tools. The common thread is not a framework: it is the ability to connect complex systems to the actual contexts of the people using them.

I approach a product through several complementary lenses.

- **Engineering:** architecture, interfaces, validation, tests, recovery paths and maintainability.
- **AI systems:** orchestration, tool use, guardrails, practical automation and human oversight.
- **Human analysis:** context, moderation, ambiguity, cultural interpretation and Trust & Safety.
- **Creative production:** visual concepts, sound, audiovisual workflows, motion and immersive interfaces.
- **Accessible communication:** clarity, language barriers, education and usable product behavior.

**My preferred outcome is a working product with honest limitations — not an impressive-looking promise that cannot be tested.**

## ◈ Living Machine / The interactive tool laboratory

<img src="./assets/terminal-header.svg" width="100%" alt="Code rain on a neon red command terminal">

The new companion experience is an **Aero-inspired browser desktop**, not a Microsoft Windows Vista installation or virtual machine. It includes multiple draggable glass windows, a taskbar, Start menu, safe narrative terminal, code rain and local-first utilities.

### Production Studio / eight working tools

**[Open the professional Studio source](./docs/living-machine/studio.html)** — a separate, responsive, modular utility workspace integrated with the original Living Machine. It uses no external runtime packages, analytics scripts, paid APIs or remote file processing.

| Studio | Implemented behavior | Limit |
|:--|:--|:--|
| **Batch image converter** | Convert up to 20 browser-readable images to JPEG, PNG or WebP and export a standards-compatible ZIP | Image decoding and encoding depend on the browser; 100 MB total input limit |
| **Subtitle time studio** | SRT/VTT time-shifting, format conversion, export to TXT and script-to-SRT drafting | Script-generated timing is an estimate that must be checked against the recording; not automatic transcription |
| **CV clarity inspector** | Local structural checks for professional communication, sections and verifiable evidence | Heuristic review, deliberately **no fictitious ATS score** |
| **Storyboard architect** | Plan editable camera shots, durations, movement, sound, export CSV or JSON | A planning utility, not a rendered video |
| **Image color sampler** | Extract approximate dominant swatches from a local image and export reusable CSS variables | Not calibrated colorimetry |
| **Image → PDF composer** | Compose A4 PDF pages from local images with JPEG metadata removal, page-fitting and margins | Requires a browser with Canvas JPEG encoding; not OCR |
| **Audio → WAV lab** | Decode compatible audio locally using Web Audio and generate 16-bit PCM WAV with waveform and gain controls | Browser codec compatibility and audio memory limits apply |
| **Video contact sheet** | Create a PNG contact sheet with 4, 9 or 16 timestamped frames from local video files | Decoding depends on browser codecs; does not fetch social media videos |

The Studio is separated into `studio.html`, `studio.css`, `studio.js`, reusable/testable `studio-core.js`, `pdf-core.js`, `audio-core.js`, `video-sheet.js`, `studio-i18n.js` and automated regression suites. The main navigation, tool explanations and core actions have hand-written **English, Spanish and Brazilian Portuguese** translations. Its page declares a strict **no-network Content Security Policy**. All image, CV, subtitle, color and export operations are executed locally within the browser.

An installable offline app shell (`manifest.webmanifest` + `sw.js`) caches only allowlisted static application files and refreshes them when connectivity returns; it does not cache files visitors select or generate. Installation requires HTTPS or a supported localhost environment. **An installable implementation is not a claim of an existing public deployment.**


If you own media to be transcribed or downloaded, use its original export or an authorized source. The studio does not claim to bypass copyright, DRM, login walls or social networks' download restrictions.

### Check your browser — local diagnostics

**[Run the diagnostic page from a local server](./docs/living-machine/diagnostics.html)** to verify the local ZIP, PDF, WAV and subtitle engines, available image encoders, Web Audio, Web Crypto and offline-app support. The page reports optional browser features separately, can export a JSON report, and sends no diagnostic data to an external service. It does not replace live end-to-end testing or a green GitHub Actions run.

### Real tools inside the machine

| Tool | Working functionality | Explicit boundary |
|:--|:--|:--|
| Image converter | PNG, JPEG, WebP and resizing through Canvas | Browser codec and memory support vary |
| Caption studio | Read and convert SRT / VTT subtitles and extract text | Not automatic transcription of uploaded video |
| Microphone dictation | Browser speech recognition where available | Speech service may process audio remotely |
| Media lab | Export video stills as PNG; record microphone audio | Local videos and supported Web APIs only |
| Data workbench | JSON formatting, CSV conversion, text slugification | Designed for conventional tabular text |
| File fingerprint | Local SHA-256 via Web Crypto | Requires supported secure browser context |
| Reel research | Export organized references and creative research notes | Not an unauthorized reel downloader |
| Private notebook | Browser-local notes and text exports | Clearing browser data also clears notes |
| Terminal | Safe read-only command simulation and Easter eggs | Does not run operating-system commands |
| Aero interface | Draggable, minimizable and maximizable windows | UI simulation, not a Windows emulator |

**[Explore the actual application code](./docs/living-machine/index.html)** — ~65 KB of HTML/CSS/JavaScript focused on usable local browser capabilities rather than fake download buttons.

### Run with local repository access

~~~bash
python -m http.server 8000 --directory docs/living-machine
~~~

Open http://localhost:8000 in a modern browser. The local utility functions do not require a paid API, login or server-side file upload.

**Run the included quality checks:**

~~~bash
node --test docs/living-machine/*.test.cjs
~~~

The targeted GitHub Actions workflow is in .github/workflows/living-machine-ci.yml. The suite covers JavaScript syntax, captions, CSV safety, ZIP structure/CRC-32, PDF cross-references, WAV PCM, video frame timing, three-language localization, static-only offline caching, interface markers and project references. The current Node.js suite passes **39 of 39 tests** (verified locally with `node --test docs/living-machine/*.test.cjs`, 2026-10-25). PDF images, WAV audio and ZIP archives have additionally been read using independent software. Browser-specific codecs and end-to-end UI behavior still require real browser testing.

> GitHub profiles render Markdown and images, not embedded JavaScript applications. The HTML must run on a website or a local server. SVG animation may vary by GitHub client; meaningful text also remains readable when motion is unavailable.

---

<a id="selected-work"></a>
## Selected work / evidence over repository volume

I am consolidating many experiments, backups and prototypes into a coherent set of canonical projects. Repository existence alone does not demonstrate a finished release, commercial adoption or audited compliance. Below are **real repositories** and what their documented scope demonstrates.

### Artificial intelligence, software engineering and safety

**[Belentani.cv-ai](https://github.com/belentani7/Belentani.cv-ai)** — A Next.js / React document studio focused on CVs and other professional outputs. Its README describes Zod input validation, rate limiting and privacy-aware flow design.

**[agentguard](https://github.com/belentani7/agentguard)** — A Trust & Safety-oriented architecture for AI agent policies, audit concepts, limits and observability. Architectural goals are deliberately distinguished from independently proven operational performance.

**[agent-skills](https://github.com/belentani7/agent-skills)** — Developer workflow skills and tooling intended to make reusable capabilities easier to discover and operate.

**[comfyui-json-compiler](https://github.com/belentani7/comfyui-json-compiler)** — Work connecting creative briefs with structured ComfyUI workflow generation and validation.

### Education, accessibility and international context

**[Open School](https://github.com/belentani7/open-school)** — An accessible educational frontend with locally stored progress, offline support and a documented optional backend. Its technical README separates working components from pending capabilities.

**[ManosAbiertas](https://github.com/belentani7/ManosAbiertas)** — Practical education: AI, office skills, CV resources and guidance for people overcoming language and digital-access barriers.

**[lingua-aberta](https://github.com/belentani7/lingua-aberta)** — Work around multilingual learning, progression and spaced repetition, informed by the difference between literal translation and real cultural interpretation.

### Creative technology and audiovisual experiences

**[The Judas Experience](https://github.com/belentani7/judas-experience-web)** — Immersive interface work with Three.js, shaders, creative direction and specification-driven development.

**[Belentani Omega](https://github.com/belentani7/belentani_Omega)** — An experimental umbrella for interactive concepts, visual systems and the artistic universe; not equivalent to a single finished commercial product.

**[Duck Studio Suite](https://github.com/belentani7/duck-studio-suite)** — Music-production related experimentation with tools and browser interfaces.

*Some repositories are private, archived or currently being consolidated. Links show source identifiers, not guaranteed public access.*

---

## Professional philosophy

### Understanding systems before building systems

My strength is often in the analytical layer before implementation: identifying the true requirement, distinguishing cause from symptom, seeing dependencies, and deciding how to keep a product understandable as its scope grows. That leads naturally to **recovery-oriented engineering, explicit state, smaller contracts and reversible changes**.

### Trust & Safety is a human-context problem

Experience in content moderation informs how I think about context, ambiguity, limits and review. AI assistance can accelerate operations, but accountability, meaningful consent, privacy and the ability to intervene remain design constraints.

### Language is a product capability

I work with **Spanish, Brazilian Portuguese and English**. Cross-cultural software needs more than translated labels. It requires attention to expectations, learning environments, trust, comprehension and different levels of digital literacy.

### Audiovisual literacy matters in engineering

Music, storytelling, motion and brand creation give me a different perspective on rhythm, attention, hierarchy and interaction. Creative tools work best when the system understands the intention of the creator and preserves meaningful control.

### Ten practical principles

1. Recover a project's original purpose before making architectural changes.
2. Do not create repositories automatically from ideas or conversations.
3. Distinguish canonical products, modules, experiments and backups.
4. Treat functioning user journeys as more important than visual promises.
5. Explain capability boundaries, external APIs and offline behavior.
6. Minimize personal-data collection and avoid hidden uploads.
7. Prefer inspectable, testable and reversible modifications.
8. Build accessible, multilingual interfaces deliberately.
9. Use automation and quality checks without eliminating human review.
10. Label implementations honestly: **working / prototype / planned / unverified**.

---

## Technology & domains

**Engineering:** TypeScript, JavaScript, React, Next.js, Node.js, Vite, Python, FastAPI, Docker, Git and CI workflows.

**AI & automation:** Agents and tool orchestration, input validation, human-in-the-loop controls, creative AI pipelines, local-model integrations and cost-conscious workflows.

**Visual computing:** Three.js, browser graphics, responsive systems, motion direction, interaction prototyping, media APIs, sound and creative-production workflows.

**Product thinking:** Accessibility, multilingual interfaces, Trust & Safety, educational technology, privacy-oriented design and practical documentation.

I also explore Go, Java and broader backend architecture. These areas are not presented as having identical levels of depth or professional production experience.

---

## En español

Soy Pedro Belentani, desarrollador de software y sistemas de IA con intereses y trabajo en análisis contextual, moderación de contenido, automatización, educación accesible y producción audiovisual.

Mi principal fortaleza es **conectar ámbitos que suelen tratarse por separado**: interpretar necesidades humanas, analizar su complejidad técnica, construir una arquitectura coherente y convertirla en una herramienta usable. Mi experiencia cultural y multilingüe influye en cómo diseño productos para personas con necesidades, contextos y conocimientos distintos.

Mi objetivo no es presentar cientos de repositorios como cientos de productos terminados, sino mostrar con claridad **qué está construido, qué funciona y qué está en investigación**.

## Em português brasileiro

Sou Pedro Belentani. Trabalho na interseção de desenvolvimento de software, sistemas de inteligência artificial, análise contextual e tecnologia criativa.

Minha abordagem combina **raciocínio técnico, sensibilidade cultural, atenção à experiência humana e direção audiovisual**. Tenho interesse especial em automação responsável, ferramentas práticas, educação acessível e experiências digitais que respeitem a intenção do usuário.

Procuro criar sistemas que possam ser compreendidos, testados e utilizados — sem confundir experimentos com produtos finalizados.

---

## Profile integrity and continuous checks

A lightweight, dependency-free [README health checker](./scripts/healthcheck.py) validates relative files and image alt text without pretending that external websites have been tested. Its [unit tests](./tests/test_healthcheck.py) and [weekly GitHub Actions workflow](./.github/workflows/profile-healthcheck.yml) publish a JSON artifact for review. External HTTPS probes are opt-in, bounded, allowlisted and reported as inconclusive rather than as broken when network access fails.

```bash
python -m unittest discover -s tests -p 'test_healthcheck.py' -v
python scripts/healthcheck.py --json profile-health.json
# Optional limited external availability hints:
python scripts/healthcheck.py --links
```

**Review-only maintenance:** [Public metrics snapshot](./scripts/self_update.py), [repair recommendations](./scripts/self_repair.py) and [improvement proposals](./scripts/self_improve.py) run through the same read-only workflow. They produce dated JSON evidence, never fabricate metrics, never replace historical links automatically and never create GitHub issues without review. The public API snapshot excludes private repositories and may be unavailable during GitHub rate limiting.

Metrics and repository counts are not frozen into this profile. The [Software Atlas](https://github.com/belentani7/belentani-omg-portal) is the place to inspect the evolving inventory; access to private source is not implied.

---

## Contact & collaboration

For work involving AI systems, product architecture, multilingual accessibility, useful developer tools and ambitious creative technology:

**[belentani.es](https://belentani.es)** · **[Email](mailto:belentani7pedro@gmail.com)** · **[GitHub](https://github.com/belentani7)**

<div align="center"><sub>© 2026 Pedro Belentani · Context before code. Human purpose before automation. Design that earns its complexity.</sub></div>

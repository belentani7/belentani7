<!-- BELENTANI NEURAL OS — Profile README v3.0 -->
<!-- All SVG animations are inline and work on GitHub -->

<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 280" width="800">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f78166">
        <animate attributeName="stop-color" values="#f78166;#58a6ff;#d2a8ff;#7ee787;#f78166" dur="8s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" style="stop-color:#d2a8ff">
        <animate attributeName="stop-color" values="#d2a8ff;#7ee787;#f78166;#58a6ff;#d2a8ff" dur="8s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glitch">
      <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="0">
        <animate attributeName="seed" values="0;100" dur="0.4s" repeatCount="indefinite"/>
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G">
        <animate attributeName="scale" values="0;0;0;0;8;0;0;0;0;0;0;0;0;0;0;12;0" dur="6s" repeatCount="indefinite"/>
      </feDisplacementMap>
    </filter>
  </defs>
  <rect width="800" height="280" fill="#0d1117" rx="12"/>
  <rect x="1" y="1" width="798" height="278" fill="none" stroke="url(#g1)" stroke-width="1" rx="12" opacity="0.6">
    <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite"/>
  </rect>
  <!-- Neural network nodes -->
  <g filter="url(#glow)" opacity="0.3">
    <circle cx="50" cy="60" r="3" fill="#58a6ff"><animate attributeName="opacity" values="0;1;0" dur="3s" begin="0s" repeatCount="indefinite"/></circle>
    <circle cx="120" cy="40" r="2" fill="#f78166"><animate attributeName="opacity" values="0;1;0" dur="2.5s" begin="0.5s" repeatCount="indefinite"/></circle>
    <circle cx="680" cy="50" r="3" fill="#d2a8ff"><animate attributeName="opacity" values="0;1;0" dur="3.2s" begin="0.3s" repeatCount="indefinite"/></circle>
    <circle cx="750" cy="80" r="2" fill="#7ee787"><animate attributeName="opacity" values="0;1;0" dur="2.8s" begin="1s" repeatCount="indefinite"/></circle>
    <circle cx="60" cy="220" r="2" fill="#58a6ff"><animate attributeName="opacity" values="0;1;0" dur="3.5s" begin="0.7s" repeatCount="indefinite"/></circle>
    <circle cx="740" cy="240" r="3" fill="#f78166"><animate attributeName="opacity" values="0;1;0" dur="2.7s" begin="1.2s" repeatCount="indefinite"/></circle>
    <circle cx="200" cy="250" r="2" fill="#d2a8ff"><animate attributeName="opacity" values="0;1;0" dur="3.1s" begin="0.2s" repeatCount="indefinite"/></circle>
    <circle cx="600" cy="230" r="2" fill="#7ee787"><animate attributeName="opacity" values="0;1;0" dur="2.9s" begin="0.9s" repeatCount="indefinite"/></circle>
    <!-- Connection lines -->
    <line x1="50" y1="60" x2="120" y2="40" stroke="#58a6ff" stroke-width="0.5" opacity="0.3"><animate attributeName="opacity" values="0;0.3;0" dur="4s" repeatCount="indefinite"/></line>
    <line x1="680" y1="50" x2="750" y2="80" stroke="#d2a8ff" stroke-width="0.5" opacity="0.3"><animate attributeName="opacity" values="0;0.3;0" dur="3.5s" begin="0.5s" repeatCount="indefinite"/></line>
    <line x1="60" y1="220" x2="200" y2="250" stroke="#58a6ff" stroke-width="0.5" opacity="0.3"><animate attributeName="opacity" values="0;0.3;0" dur="4.2s" begin="0.3s" repeatCount="indefinite"/></line>
    <line x1="600" y1="230" x2="740" y2="240" stroke="#7ee787" stroke-width="0.5" opacity="0.3"><animate attributeName="opacity" values="0;0.3;0" dur="3.8s" begin="0.8s" repeatCount="indefinite"/></line>
  </g>
  <!-- Terminal prompt -->
  <text x="40" y="45" font-family="monospace" font-size="13" fill="#8b949e">
    <tspan fill="#7ee787">belentani@neural-os</tspan><tspan fill="#8b949e">:</tspan><tspan fill="#58a6ff">~</tspan><tspan fill="#8b949e">$ whoami</tspan>
  </text>
  <!-- Main title with glitch -->
  <g filter="url(#glitch)">
    <text x="400" y="110" text-anchor="middle" font-family="monospace" font-size="42" font-weight="bold" fill="url(#g1)">BELENTANI</text>
  </g>
  <!-- Subtitle typewriter -->
  <text x="400" y="148" text-anchor="middle" font-family="monospace" font-size="15" fill="#8b949e">
    Neural Architect · Creative Engineer · Systems Thinker
    <animate attributeName="opacity" values="0;1" dur="2s" fill="freeze"/>
  </text>
  <!-- Status bar -->
  <rect x="40" y="175" width="720" height="1" fill="#21262d"/>
  <text x="40" y="200" font-family="monospace" font-size="11" fill="#484f58">
    <tspan fill="#7ee787">●</tspan> ONLINE
    <tspan dx="20" fill="#484f58">│</tspan>
    <tspan dx="10">São Paulo → Barcelona</tspan>
    <tspan dx="20" fill="#484f58">│</tspan>
    <tspan dx="10">PT · ES · EN · CA</tspan>
    <tspan dx="20" fill="#484f58">│</tspan>
    <tspan dx="10" fill="#f78166">88 repos</tspan>
    <tspan dx="20" fill="#484f58">│</tspan>
    <tspan dx="10">account.age = </tspan>
  </text>
  <text x="400" y="200" text-anchor="middle" font-family="monospace" font-size="11" fill="#484f58">
    <tspan dx="145">365d+</tspan>
  </text>
  <!-- Process list -->
  <text x="40" y="228" font-family="monospace" font-size="11" fill="#484f58">
    <tspan fill="#8b949e">processes:</tspan>
    <tspan fill="#58a6ff"> ai-systems</tspan><tspan fill="#484f58"> ·</tspan>
    <tspan fill="#d2a8ff"> creative-tech</tspan><tspan fill="#484f58"> ·</tspan>
    <tspan fill="#7ee787"> social-impact</tspan><tspan fill="#484f58"> ·</tspan>
    <tspan fill="#f78166"> music-production</tspan><tspan fill="#484f58"> ·</tspan>
    <tspan fill="#e3b341"> trust-safety</tspan>
  </text>
  <!-- Cursor blink -->
  <rect x="40" y="248" width="8" height="16" fill="#58a6ff">
    <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
  </rect>
</svg>

<br/>

<a href="https://belentani.vercel.app"><img src="https://img.shields.io/badge/⟁_belentani.vercel.app-0d1117?style=flat-square&color=f78166" alt="portal"/></a>
<a href="https://belentani7.github.io/hack-visual/"><img src="https://img.shields.io/badge/⟩_hack.visual-0d1117?style=flat-square&color=58a6ff" alt="hack"/></a>
<a href="https://belentani7.github.io/duck-apps-web/"><img src="https://img.shields.io/badge/♫_duck.apps-0d1117?style=flat-square&color=d2a8ff" alt="duck"/></a>
<img src="https://komarev.com/ghpvc/?username=belentani7&color=f78166&style=flat-square&label=◉" alt="views"/>

</div>

---

<details open>
<summary>

### `~/identity` — who am i

</summary>

```yaml
identity:
  name: Pedro Belentani
  alias: Belentani
  origin: São Paulo, Brasil
  base: L'Hospitalet de Llobregat, Barcelona
  languages: [Português, Español, English, Català]
  
  duality:
    engineer:
      title: Full-Stack Engineer & AI Systems Architect
      years_active: "2019 → ∞"
      origin_story: "TELUS International → Google Trust & Safety (2019-2025)"
      core: "6 years moderating the internet taught me what systems break and why"
    
    artist:
      title: Belentani — Neural Architect
      medium: "voice cloning · AI music pipelines · creative code"
      philosophy: "code is composition — every function is a verse, every deploy is a statement"
  
  cognition:
    type: "metacognitive monitor"
    style: "forensic — analysis transforms panic into data"
    superpower: "observes how it observes how it observes"
    
  operating_principle: >
    I don't build things that already exist.
    I don't explain things you can read.
    I don't automate things that need a human.
    I build the space where art and engineering stop being different things.
```

</details>

---

<details open>
<summary>

### `~/neural-stack` — the system

</summary>

<div align="center">

| ┌─ AI / ML ──────────────────────┐ | ┌─ FRONTEND ─────────────────────┐ | ┌─ BACKEND ──────────────────────┐ |
|:--|:--|:--|
| `multi-agent orchestration` | `React 19` · `Next.js 15` | `Node.js` · `Express` · `tRPC` |
| `zero-token task routing` | `TypeScript` · `Vite 7` | `FastAPI` · `Python` |
| `LLM cost optimization` | `Astro` · `Tailwind 4` | `Spring Boot` · `Java` |
| `voice cloning (RVC/Applio)` | `shadcn/ui` · `Radix` | `Drizzle ORM` · `PostgreSQL` |
| `ComfyUI workflow compilation` | `Framer Motion` · `GSAP` | `MySQL` · `Redis` |
| `VFX pipeline automation` | `Web Audio API` · `Tone.js` | `Docker` · `GitHub Actions` |

</div>

```
┌─────────────────────────────────────────────────────────────┐
│                    NEURAL ARCHITECTURE                       │
│                                                             │
│  ┌──────┐    ┌──────────┐    ┌───────────┐    ┌─────────┐ │
│  │INPUT │───→│ META     │───→│ EXECUTION │───→│ DEPLOY  │ │
│  │brief │    │ SKILL    │    │ ENGINE    │    │ pipeline│ │
│  └──────┘    │ (route)  │    │ (build)   │    │ (ship)  │ │
│              └──────────┘    └───────────┘    └─────────┘ │
│                  │ 0 tokens      │ real work      │ vercel │
│                  │ local class.  │ TS/Py/Java     │ github │
│                  │               │                 │ pages  │
│                  ▼               ▼                 ▼        │
│            ┌──────────────────────────────────────────┐    │
│            │         EVIDENCE LEDGER                  │    │
│            │   audit trail · proof mesh · receipts    │    │
│            └──────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

</details>

---

<details open>
<summary>

### `~/active-missions` — what's running

</summary>

<details>
<summary>

#### 🔴 `mission://voice-cloning` — cloning myself

</summary>

Training an RVC voice model of my own voice on free Kaggle GPUs. 47 vocal stems pre-separated, Applio pipeline, rmvpe pitch extraction. The goal: generate music at scale without depending on my vocal cords being available.

```python
# the pipeline
vocals = separate_stems("audios_judas/", method="demucs")  # 47 clean WAVs
pipeline.run(preprocess → extract_rmvepe → train_100_epochs → export_zip)
# output: Belentani.pth + Belentani.index
```

</details>

<details>
<summary>

#### 🔴 `mission://zero-token-routing` — the AI you don't call

</summary>

**MetaSkill** classifies 16 task archetypes without burning a single LLM token. Because most tasks don't need GPT-4. Sometimes the best AI is the AI you don't invoke.

→ [`MetaSkill`](https://github.com/belentani7/MetaSkill) · [`meta-skill`](https://github.com/belentani7/meta-skill) · [`skillforge`](https://github.com/belentani7/skillforge)

</details>

<details>
<summary>

#### 🟢 `mission://social-impact` — technology that serves

</summary>

| Project | Purpose | Tech |
|---------|---------|------|
| [Cruzando el Charco](https://github.com/belentani7/Cruzando-el-charco) | LGBT+ migrant support portal — housing, health, legal, community | Next.js, multilingual |
| [ManosAbiertas](https://github.com/belentani7/ManosAbiertas) | Free AI/Office courses, CV builder, rights guides for migrants | HTML, accessible |
| [tender-words-connect](https://github.com/belentani7/tender-words-connect) | BPD/Cluster B relationship understanding and emotional regulation | TypeScript |

Technology that doesn't serve communities is just a toy.

</details>

<details>
<summary>

#### 🟡 `mission://infrastructure` — systems that think

</summary>

| System | Function |
|--------|----------|
| [NOIACORE LAB](https://github.com/belentani7/Belentani) | Full-stack platform — 298 files, tRPC, LLM integration, admin panel |
| [AgentGuard](https://github.com/belentani7/agentguard) | Firewall for AI budgets — Go daemon, spending limits, auto-pause |
| [AgentBox](https://github.com/belentani7/agentbox) | Disposable VM sandboxes for AI agents — $4/mo, Terraform |
| [Evidence Ledger](https://github.com/belentani7/evidence-ledger) | Audit trail for AI decisions — local-first, cryptographic receipts |
| [ProofMesh](https://github.com/belentani7/proofmesh) | 6-criteria, 3-node, 3-level change intelligence gates |
| [Nexus OS](https://github.com/belentani7/nexus-os) | Browser OS — 38+ apps, cyberpunk aesthetics, zero dependencies |

</details>

<details>
<summary>

#### 🟣 `mission://creative-engine` — where code meets art

</summary>

| Project | What it does |
|---------|-------------|
| [DUCK Ecosystem](https://github.com/belentani7/duck-hub) | Complete music production toolkit — 6 web apps + Astro hub |
| [Belentani Judas](https://github.com/belentani7/belentani-judas) | Music project source material and vocal processing assets |
| [Cinematic Prompt Formatter](https://github.com/belentani7/cinematic-prompt-formatter) | Film language → Stable Diffusion/Flux/SDXL prompts |
| [LLM VFX Orchestrator](https://github.com/belentani7/llm-vfx-orchestrator) | Autonomous VFX pipeline — LLM → ComfyUI API |
| [ComfyUI JSON Compiler](https://github.com/belentani7/comfyui-json-compiler) | Natural language → valid ComfyUI workflows |
| [Hack Visual](https://github.com/belentani7/hack-visual) | Live demo → cinematic hacker takeover |

</details>

</details>

---

<details>
<summary>

### `~/commit-philosophy` — why i build

</summary>

```
I grew up invisible.

A kid in São Paulo who learned that the world doesn't look at you
unless you build something it can't ignore.

I moderated the internet for 6 years — 135,390 fraudulent activities
in a single day, content that would break most people.
That taught me what trust looks like when it's real,
and what systems look like when they fail.

Now I build:
  → Systems that think before they spend (zero-token routing)
  → Platforms that serve people who can't pay (migrant tools)
  → Art that uses code as its instrument (voice cloning, music)
  → Infrastructure that proves it did what it claims (evidence ledgers)

Not because I have all the answers.
Because the alternative is letting bad systems win by default.
```

> *"Every epoch is a morning I chose not to give up.*
> *Every commit is a scream I didn't have to scream.*
> *Every deploy is proof that I existed today."*
>
> **— Belentani**

</details>

---

<details>
<summary>

### `~/signal` — stats & telemetry

</summary>

<div align="center">

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=belentani7&show_icons=true&theme=radical&hide_border=true&include_all_commits=true&count_private=true&bg_color=0d1117&title_color=f78166&icon_color=58a6ff&text_color=8b949e&custom_title=NEURAL%20OUTPUT%20METRICS)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=belentani7&layout=compact&theme=radical&hide_border=true&langs_count=10&bg_color=0d1117&title_color=d2a8ff&text_color=8b949e&custom_title=LANGUAGE%20FREQUENCY%20MAP)

![Streak](https://github-readme-streak-stats.herokuapp.com/?user=belentani7&theme=radical&hide_border=true&background=0d1117&fire=f78166&currStreakLabel=f78166)

![Activity](https://github-readme-activity-graph.vercel.app/graph?username=belentani7&theme=react-dark&hide_border=true&bg_color=0d1117&color=8b949e&line=58a6ff&point=f78166&area=true&area_color=58a6ff)

</div>

</details>

---

<details>
<summary>

### `~/connect` — open channels

</summary>

<div align="center">

**I'm available for:**
Full-stack engineering · AI systems architecture · Creative technology · Social impact projects

<br/>

<a href="https://github.com/belentani7"><img src="https://img.shields.io/badge/github-belentani7-0d1117?style=for-the-badge&logo=github&logoColor=white&color=21262d" alt="GitHub"/></a>
<a href="https://belentani.vercel.app"><img src="https://img.shields.io/badge/⟁_portal-belentani.vercel.app-0d1117?style=for-the-badge&color=f78166" alt="Portal"/></a>

<br/><br/>

<sub>`session.ended` — the neural operating system is always listening.</sub>

</div>

</details>

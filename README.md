<div align="center">

<img src="./assets/profile-senior-systems-2026.svg" alt="Pedro Belentani — Senior Full-Stack AI Engineer and Systems Architect. Trust &amp; Safety, explainable AI and creative systems." width="100%" />

<br/>

### Senior Full-Stack AI Engineer & Systems Architect

**Agentic Systems · Explainable AI · Trust & Safety · Creative Technology**

*Engineering with evidence. Intelligence with human context. Creativity with purpose.*

**Barcelona, Spain** · English / Español / Português (BR) / Català

[**Professional Portfolio**](https://pedro-belentani-portfolio.honeybrook4.chatgpt.site) · [**LinkedIn**](https://linkedin.com/in/pedro-b-09473598) · [**Creative Universe**](https://belentani.es) · [**Technical Evidence**](./docs/engineering-evidence-2026-10-29.md) · [**Contact**](#connect)

</div>

---

## The intersection I work in

I build **AI infrastructure, explainable agent workflows, security-conscious developer tools, accessible digital products and immersive creative experiences**.

My background includes **multilingual Trust & Safety operations (2018–2025)**, where policy interpretation, ambiguity, escalation, risk and human judgment are everyday realities. I bring that context to applied AI engineering: define the boundary, test the edge case, make failure visible and keep a human in control.

**I work across the full chain:** product discovery → architecture → implementation → evaluation → delivery → improvement.

<div align="center">
<img src="./assets/engineering-capabilities-2026.svg" alt="Engineering capability atlas: SAFE-EXEC, Meta-Skill, KEYROTOR, Belentani Forge, CARQUIDEC and LLM VFX Orchestrator." width="100%" />
</div>

## Selected systems

The following are **public source repositories** selected for inspectable engineering depth, not repository count. A passing build, deployment record or polished interface is **not** by itself proof of production readiness.

<table>
<tr>
<td width="50%" valign="top">

### 01 — [SAFE-EXEC](https://github.com/belentani7/safe-exec)

**Agent safety · Signed pre-execution decisions**

A research prototype for inspecting exact file bytes before a proposed isolated execution: policy checks, independent signed evaluations, replay protection and a broker-issued one-use token.

**Evidence:** [Protocol tests](https://github.com/belentani7/safe-exec/blob/main/tests/test_protocol.py) · [Static policy](https://github.com/belentani7/safe-exec/blob/main/safeexec/policy.py)

**Boundary:** The full external sandbox / Docker integration is not validated end-to-end; its current CI does not yet run the test suite.

</td>
<td width="50%" valign="top">

### 02 — [META-SKILL](https://github.com/belentani7/meta-skill)

**Explainable AI · Routing & evaluation**

Offline heuristic task router with abstention, budget-aware model recommendations and an independent evaluation harness with coverage and calibration checks.

**Evidence:** [Evaluator source](https://github.com/belentani7/meta-skill/blob/main/evaluation-lab/evaluate.py) · [Routing tests](https://github.com/belentani7/meta-skill/blob/main/tests/test_router.py)

**Boundary:** Synthetic fixtures demonstrate evaluation mechanics; they do not establish accuracy or token savings on real traffic.

</td>
</tr>
<tr>
<td valign="top">

### 03 — [KEYROTOR](https://github.com/belentani7/keyrotor)

**LLM infrastructure · Reliability patterns**

A local-first, multi-provider API gateway with key rotation, retry/backoff, circuit breakers, TTL caching and secret redaction.

**Evidence:** [Router implementation](https://github.com/belentani7/keyrotor/blob/main/keyrotor/router.py) · [Transport tests](https://github.com/belentani7/keyrotor/blob/main/tests/test_router.py)

**Boundary:** Local development scope. An internet-facing gateway would require additional authentication, authorization and operational hardening.

</td>
<td valign="top">

### 04 — [BELENTANI FORGE](https://github.com/belentani7/belentani-forge)

**Developer automation · Quality operations**

A Python project engine for inventory, diagnosis, controlled repairs, dependency maps, verification and reporting across local repositories.

**Evidence:** [Safety controls](https://github.com/belentani7/belentani-forge/blob/main/forge/safety.py) · [Safety tests](https://github.com/belentani7/belentani-forge/blob/main/tests/test_safety.py) · [CI matrix](https://github.com/belentani7/belentani-forge/blob/main/.github/workflows/ci.yml)

**Boundary:** Read-only by default; potentially destructive actions require explicit authorization.

</td>
</tr>
<tr>
<td valign="top">

### 05 — [CARQUIDEC](https://github.com/belentani7/CARQUIDEC)

**Product engineering · Accessibility & performance**

A multilingual site with progressive enhancement, responsive media, self-hosted assets, automated quality checks and reproducible build rules.

**Evidence:** [Before / after audit](https://github.com/belentani7/CARQUIDEC/blob/main/AUDITORIA.md) · [CI quality gates](https://github.com/belentani7/CARQUIDEC/blob/main/.github/workflows/ci.yml)

**Project site:** [carquidec.vercel.app](https://carquidec.vercel.app)

**Boundary:** Metrics are documented in the repository; independent browser-based validation remains a separate step.

</td>
<td valign="top">

### 06 — [LLM VFX ORCHESTRATOR](https://github.com/belentani7/llm-vfx-orchestrator)

**Creative AI · Reproducible production workflows**

Two complementary layers: a local-first browser shot-planning workspace and a Python CLI for coordinating configurable LLM planning, ComfyUI rendering, QA and bounded retries.

**Evidence:** [Architecture and quickstart](https://github.com/belentani7/llm-vfx-orchestrator) · [Python + web CI](https://github.com/belentani7/llm-vfx-orchestrator/blob/main/.github/workflows/ci.yml)

**Boundary:** The browser planner works without model calls; full external rendering requires configured providers and ComfyUI.

</td>
</tr>
</table>

## Products built for people

Technical ambition matters most when it reaches a person, a team or a real workflow.

| Education & accessibility | Creative technology & audiovisual work |
|:---|:---|
| **[Manos Abiertas](https://github.com/belentani7/ManosAbiertas)** — free multilingual digital learning, practical AI, office skills and CV resources. Its documented build generates **832 lesson pages** in four language editions. The latest referenced release is not confirmed publicly available. | **[HEYDUCK](https://github.com/belentani7/heyduck)** — interactive music-production portfolio with Web Audio utilities, animations and multilingual experience. [Project-listed deployment](https://heyduck.vercel.app/). |
| **Human context:** accessible pathways, progressive learning, transparent content provenance and privacy-aware design. | **[Belentani — The Experience](https://github.com/belentani7/belentani.es)** — a Three.js music and narrative universe that combines audiovisual authorship with interactive engineering. [Artist universe](https://belentani.es). |

## Engineering evidence — not just claims

| Practice | What you can inspect |
|:---|:---|
| **Evaluation & restraint** | [Meta-Skill's abstention tests](https://github.com/belentani7/meta-skill/blob/main/tests/test_router.py) and [metrics implementation](https://github.com/belentani7/meta-skill/blob/main/evaluation-lab/evaluate.py) |
| **Security by design** | [SAFE-EXEC's signed-protocol tests](https://github.com/belentani7/safe-exec/blob/main/tests/test_protocol.py) and [Forge's safety layer](https://github.com/belentani7/belentani-forge/blob/main/forge/safety.py) |
| **Repeatable delivery** | [CARQUIDEC's quality gates](https://github.com/belentani7/CARQUIDEC/blob/main/.github/workflows/ci.yml) and [VFX's dual-stack CI](https://github.com/belentani7/llm-vfx-orchestrator/blob/main/.github/workflows/ci.yml) |
| **Documented trade-offs** | [Engineering evidence — reviewed sample, 29 Oct 2026](./docs/engineering-evidence-2026-10-29.md) |

> **Operating principle:** A repository is not a product launch. A synthetic test is not a production benchmark. An automated commit is not a verified user outcome. Real engineering makes those distinctions legible.

<details>
<summary><strong>Technical breadth — explore my working domains</strong></summary>

<br/>

| Domain | Languages, frameworks and practices |
|:---|:---|
| **Systems & backend** | Python · TypeScript · Node.js · FastAPI · REST APIs · data modelling · CLI engineering |
| **AI infrastructure** | LLM provider integration · agent orchestration · offline heuristics · evaluation harnesses · model routing · retries · fallbacks · cost-aware workflows |
| **Trust, security & quality** | Trust & Safety operations · policy interpretation · threat-aware design · secret redaction · testing · CI/CD · failure-state analysis |
| **Web & experience** | React · Next.js · accessible interfaces · responsive design · internationalization · progressive enhancement |
| **Creative computing** | Three.js / WebGL · Web Audio · generative production workflows · ComfyUI integration · music and interactive storytelling |

**Tools are selected to fit the system.** A long technology list is not a substitute for a documented design decision.

</details>

## How I approach complex work

**01 / Understand.** Identify the user, failure modes, constraints and the real decision to support.

**02 / Architect.** Prefer transparent interfaces, isolated responsibilities and proportionate infrastructure.

**03 / Verify.** Write repeatable checks, make uncertainty visible and test abnormal conditions.

**04 / Deliver.** Document what works, what is experimental and what would be required to operate it reliably.

**05 / Create.** Bring artistic direction, human interpretation and accessibility into the engineering process.

---

## Connect

Open to **senior AI engineering, trustworthy agent systems, developer tooling, accessible product engineering and creative technology collaborations**.

[**Portfolio**](https://pedro-belentani-portfolio.honeybrook4.chatgpt.site) · [**GitHub**](https://github.com/belentani7) · [**LinkedIn**](https://linkedin.com/in/pedro-b-09473598) · [**Email**](mailto:belentani7pedro@gmail.com) · [**Music & creative universe**](https://belentani.es)

<div align="center">

**PEDRO BELENTANI — SYSTEMS WITH EVIDENCE. TECHNOLOGY WITH PURPOSE.**

<sub>Senior Full-Stack AI Engineer & Systems Architect · Barcelona</sub>

</div>

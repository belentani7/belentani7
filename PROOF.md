# PROOF

**What this profile claims, and how each claim is checked.**

Most profiles ask you to trust adjectives. This one publishes the rubric, the evidence and the failure conditions. If a claim here cannot be checked, it is marked **unverified** instead of being dressed up.

---

## The definition of “best” used here

“Best profile in the world” is not a measurable property. Followers and stars measure distribution and time on the platform, not engineering quality — a profile with 300k followers can still make claims nobody can check.

So this page uses a narrower, falsifiable definition:

> **Best = the profile that makes the fewest unverifiable claims, and proves the rest.**

On that axis, the rubric below is the whole argument. It is intentionally small enough to be checked by a stranger in a few minutes.

## The rubric

| # | Criterion | How it is checked | Result |
|---|---|---|---|
| 1 | One-sentence positioning | README opens with a single thesis, not a list of labels | **Pass** — “AI systems with the safety rails built in” |
| 2 | Public curation over volume | 3 featured systems, all public; private work is separated and never counted as evidence | **Pass** — public API check + `selected_systems` |
| 3 | Claim traceability | Every claim links to a repository, a test or a measurement — or says “unverified” | **Pass** — enforced by `tests/test_profile_presentation.py` |
| 4 | Presentation contract | Regression tests for cover, SVG safety, links, size and external widgets | **Pass** — 6/6 |
| 5 | Reproducible evidence | `scripts/profile_evidence.py` emits machine-readable evidence and exits non-zero on drift | **Pass** — 9/9 checks |
| 6 | No third-party trackers | Zero external images; one local SVG; no stats widgets or visitor counters | **Pass** — `images.external = 0` |
| 7 | Mobile-readable | System cards instead of a wide table; no horizontal scrolling in the main narrative | **Pass** — reviewed at 394 px |
| 8 | Continuous verification | Dedicated GitHub Actions workflow runs the audit and the tests on every push | **Pass** — `profile-evidence` workflow |

**Score: 8/8 on the stated axis.** That is the entire claim. It does not claim the most followers, the most stars or the most repositories.

## Claim → evidence → status

| Claim on the profile | Evidence | Status |
|---|---|---|
| The three featured repositories are public | `profile_evidence.py` → `featured_visibility` (GitHub API, `private: false`) | **Verified** (machine) |
| The page has one local cover and no external images | [`assets/hero-2026.svg`](./assets/hero-2026.svg) · `profile_evidence.py` | **Verified** (machine) |
| All relative links resolve | `profile_evidence.py` → `missing_relative_links` | **Verified** (machine) |
| The README stays under 12 KB | `profile_evidence.py` → `readme_bytes` | **Verified** (machine) |
| Three featured systems, three distinct repos | `profile_evidence.py` → `selected_systems`, `featured_repositories` | **Verified** (machine) |
| Presentation cannot silently regress | [`tests/test_profile_presentation.py`](./tests/test_profile_presentation.py) | **Verified** (6 tests) |
| Belentani.es is live | HTTP 200 at [belentani.es](https://belentani.es) | **Verified** (HTTP) |
| Meta-Skill demo is live | HTTP 200 at [meta-skill-theta.vercel.app](https://meta-skill-theta.vercel.app) | **Verified** (HTTP) |
| secure-t publishes 28 HTML pages | [repository](https://github.com/belentani7/secure-t) · measured 2026-11-10 | **Documented** by the repo, not re-run here |
| Language stats reflect TypeScript/Python, not demo HTML | commits on `belentani-portfolio`, `belentani-python-template`, `comfyui-json-compiler`, `neural-git-tui` | **Verified** (commit) |
| The profile repo no longer ships local hook state | commit `feat(profile): lead with auditable AI systems…` | **Verified** (diff) |

Status vocabulary:

- **Verified (machine)** — recomputed from this repository on every run.
- **Verified (HTTP/commit)** — checked against a live endpoint or an immutable commit.
- **Documented** — stated by the source repository; not independently re-executed here. It is labelled as such instead of being presented as an independent audit.
- **Unverified** — no evidence; must be removed or labelled.

## Private work is not evidence

NoiaCore Model Guard, FORJA and Agent Skills are private repositories. They are described on the profile because they show what I build, but they are deliberately excluded from the evidence table and from the `featured_repositories` check. A claim backed only by a private repo is a claim a stranger cannot verify — so it does not count.

## Reproduce it

```bash
python scripts/profile_evidence.py          # 9 checks, exit 1 on drift
python scripts/profile_evidence.py --json   # machine-readable evidence
python tests/test_profile_presentation.py   # presentation contract
python tests/test_profile_evidence.py       # evidence contract
node --test docs/living-machine/quality.test.cjs docs/living-machine/terminal.test.cjs
```

The same commands run in [`.github/workflows/profile-evidence.yml`](./.github/workflows/profile-evidence.yml) on every push.

A dated snapshot lives in [`docs/profile-evidence.json`](./docs/profile-evidence.json). It is generated, not hand-edited.

## What would falsify this page

This profile would fail its own contract if any of the following became true:

1. A featured repository turns private or its link 404s.
2. An external image, stats widget or visitor counter is added.
3. A claim loses its evidence link and is not labelled **unverified**.
4. The presentation tests or the evidence audit fail in CI.
5. The README grows past 12 KB or loses its single-sentence thesis.

## Limits

- Stars and followers are deliberately not used as quality evidence.
- The audit checks structure and traceability, not whether a third-party repository's internal claims are true.
- Public visibility is checked at audit time; a repository can change visibility later, which is exactly why the check runs on every push.
- “Best” is bounded by the rubric above. A different definition would require different evidence.
- The evidence snapshot is dated; freshness is visible, not assumed.

---

<sub>Generated and checked by [`scripts/profile_evidence.py`](./scripts/profile_evidence.py). Last manual review: 2026-11-14.</sub>

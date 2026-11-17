# PROOF — public profile evidence policy

**Positioning revision:** 17 November 2026. The professional profile leads with AI Systems, Full-Stack Development and Trust & Safety; the artist universe is a secondary creative-technology case study.

A public README is not a ranking. An author's claim, an executable test, a repository's own documentation, an HTTP result and independent verification are different kinds of evidence.

## What is checked

The versioned script [`scripts/profile_evidence.py`](./scripts/profile_evidence.py) checks README byte size, local assets, relative links, count and uniqueness of the **six featured repository links**, and (online) public repository visibility. The profile presentation contract separately checks headings, a local static SVG, known external-widget exclusions and the presence of evidence documentation.

**Current selected projects:** `meta-skill`, `profile-lint`, `secure-t`, `kepler`, `Cruzando-el-charco` and `belentani.es`.

These checks do **not** execute all downstream projects, establish security compliance, reproduce frame-time benchmarks, certify music audience claims, or prove that a deployment works end to end. The test suite's source should be inspected before interpreting any result.

The repository snapshot [`docs/profile-evidence.json`](./docs/profile-evidence.json) was generated for an earlier README revision. Its counts are historical, **not** a verified live inventory for this revision. Generate a new snapshot with `python scripts/profile_evidence.py --write` after the branch is reviewed and network checks pass; never relabel historical output as current by editing totals manually.

## Claim → evidence → status

| Statement | Evidence | Classification |
| --- | --- | --- |
| The profile features six distinct repositories | `scripts/profile_evidence.py --json` on the exact commit | Locally testable; online visibility check required |
| Meta-Skill offers heuristic routing and abstention | [Meta-Skill README](https://github.com/belentani7/meta-skill) and its source/tests | Author-documented implementation; no production accuracy guarantee |
| Profile-Lint tests README issues deterministically | [Profile-Lint README](https://github.com/belentani7/profile-lint) | Source documented; separate run required to confirm a specific version |
| Kepler reports 200k particles / 59.9 fps / 17.5 ms p95 on UHD 620 | [Kepler benchmark documentation](https://github.com/belentani7/kepler) | Author-reported hardware measurement; not independently reproduced here |
| Secure-T offers cybersecurity and responsible AI learning materials | [Secure-T](https://github.com/belentani7/secure-t) | Repository-documented scope; no verified learning outcomes |
| Cruzando el Charco exposes essential information without JavaScript | [Cruzando el Charco](https://github.com/belentani7/Cruzando-el-charco) | Author-documented design; resource freshness must be checked |
| belentani.es is a music-led interactive web project | [belentani.es repository](https://github.com/belentani7/belentani.es) | Source documented; live behavior not audited in this revision |

**Vocabulary:** *documented* means asserted or shown in a source; *tested on commit* means a particular command completed on a specified revision; *HTTP reachable* is only transport status; *independently reproduced* requires an additional reproducible run. Claims without adequate evidence stay **unverified**.

## What would falsify this page

1. A featured repository is private, missing or linked incorrectly.
2. A core project claim contradicts its own repository's limitations.
3. Public descriptions imply real savings or accuracy when only estimates or synthetic evaluation exist.
4. An artist or job title is presented as a documented employment fact without supporting records.
5. The README depends on a third-party stats widget or local paths that do not resolve.
6. The audit or presentation checks fail on the final commit.

## Reproduce the profile checks

```bash
python scripts/profile_evidence.py --json --offline
python tests/test_profile_presentation.py -v
python tests/test_profile_evidence.py -v
# online visibility check when an authorized network/API token is available
python scripts/profile_evidence.py --json
```

This report describes a reproducible credibility floor, not a ranking or an independent certification of the author's professional level. Historical records remain available in Git history.

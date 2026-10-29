# Engineering evidence — 29 October 2026

**Scope:** a bounded review of GitHub commit metadata across four public repositories belonging to `belentani7`, cross-referenced with professional CVs from October 2026. This is an editorial evidence note, **not** a performance audit, time sheet, comprehensive contribution count, or declaration of production readiness.

## Account-level contribution activity (GitHub GraphQL, 2026)

GitHub's authenticated `contributionsCollection` returned the following **point-in-time** account totals on **29 October 2026, around 07:51 UTC**, for the requested range `2026-01-01T00:00:00Z` to `2026-10-29T23:59:59Z` (query performed before the end of 29 October). Counts were obtained from GitHub itself and are **not estimates**.

| GitHub activity metric | Recorded total |
| --- | ---: |
| Calendar contributions (all recorded contribution categories) | **8,199** |
| Commit contributions attributed to the account | **7,034** |
| Pull request contributions attributed to the account | **1,033** |
| Issues opened and attributed to the account | **31** |
| Pull request reviews attributed to the account | **0** |
| Days with one or more recorded contributions during the requested period | **99** |

**Monthly calendar distribution:** June 6, July 141, August 811, September 2,700, October 4,541 (through the snapshot). January–May showed zero contributions for this particular GitHub account and query window. This is a distribution of *recorded activity*, not a distribution of hours or verified deliverables. The calendar total need not equal the sum of selected category fields because it can incorporate other activity categories and GitHub attribution rules.

**Interpretation and privacy:** These figures come from an authenticated account-level query; the visibility of private contributions on a public profile depends on the user's settings. Aggregates do not disclose private repository identities. They may include assisted workflows, automated maintenance, merges and batch operations, and they are not all necessarily manual independent engineering tasks. GitHub does not provide human-hours, quality scores, customer adoption, production uptime, or business impact from these counters. A day with hundreds of contributions is **not** evidence of hundreds of hours of work or individually engineered features. This section is dated rather than auto-updating because the figures change as the account evolves.

**Reproduction:** GitHub GraphQL `user(login: "belentani7") { contributionsCollection(from: ..., to: ...) { totalCommitContributions totalPullRequestContributions totalIssueContributions contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } } }`. Source semantics: [GitHub's official contribution criteria](https://docs.github.com/en/account-and-profile/reference/profile-contributions-reference) and [contribution visibility](https://docs.github.com/en/account-and-profile/how-tos/contribution-settings).

## Reviewed commit records

| Repository | Recent commit entries inspected | Time coverage represented | Engineering signals from commit messages |
| --- | ---: | --- | --- |
| [Profile / engineering studio](https://github.com/belentani7/belentani7) | 35 | 23–29 Oct 2026 | CI modernization, security, test gates, documentation and observability |
| [Belentani CV Studio](https://github.com/belentani7/Belentani.cv-ai) | 25 | 25–28 Oct 2026 | Privacy headers, input validation, accessible editing, tests and dependency patches |
| [Secure-T](https://github.com/belentani7/secure-t) | 25 | 28–29 Oct 2026 | Accessible course flows, editorial design, internationalization, release safety |
| [Manos Abiertas](https://github.com/belentani7/ManosAbiertas) | 25 | 29 Oct 2026 | Learning journeys, multilingual fallback, education quality, verified-link maintenance |

**Total reviewed: 110 commit entries** in this bounded sample. These entries include different commit types (feature, fix, test, dependency bump, merge, docs). They are **not** necessarily 110 independently authored features, and do not imply a count of human hours. Automated changes, parallel work, author/committer differences, and cherry-picks may affect interpretation.

## Selected publicly inspectable examples

- [Accessible and private pre-submission review (CV Studio, 28 Oct)](https://github.com/belentani7/Belentani.cv-ai/commit/258f0b3ff0ca40dcaf8f86bc537b48b6127b05e9): a product-facing experience improvement.
- [Private API response and security header regression coverage (CV Studio, 28 Oct)](https://github.com/belentani7/Belentani.cv-ai/commit/b1f67fdc7939dc26352bf75958da404a11aa5a61): tests targeted at operational privacy controls.
- [Institutional language and browser journeys (Secure-T, 29 Oct)](https://github.com/belentani7/secure-t/commit/45b07bf045e59f01efc931f2cf934110fdeb90e3): frontend, accessible navigation and communication.
- [Accessible learning workshops (Manos Abiertas, 29 Oct)](https://github.com/belentani7/ManosAbiertas/commit/8b97cd83223d494f13c87caed1b5e9ed0df1eede): education-oriented product functionality.
- [Browser CI for institutional journeys (Manos Abiertas, 29 Oct)](https://github.com/belentani7/ManosAbiertas/commit/b55ace590912cec8bc92f6e9e412283df48cfc32): automated verification work.
- [Profile observability and bounded recovery (profile repository, 28 Oct)](https://github.com/belentani7/belentani7/commit/c2c21b608bc57fe7070d99aad4f6f59f4d5ac59c): engineering operations.

## How to interpret time, amount and technical level

- **Time:** GitHub records dates and times, not productive human work hours. Multiple commits a minute may reflect scripts, automation, merges, or batched publication.
- **Quantity:** sampling is explicitly scoped. Repository quantity is not proof of output quality. Branch and private activity are not exhaustively covered here.
- **Technical breadth:** source history represents work in frontend, APIs, testing, accessibility, i18n, dependency security, CI, education and creative computing.
- **Technical depth:** shown through specific implementations, tests and change review, not a self-awarded seniority label or fictitious numeric score.
- **Production/impact:** a merged commit or passing test does not by itself prove a public service is live, adopted or commercially successful.

## Career context

The CV documented as professionally contrasted in October 2026 records multilingual customer support work in 2016–2018 and community/content moderation work in 2018–2025. Independent AI-augmented product building in 2026 complements that history. Employment dates and qualifications should be reconciled against underlying employment and education records for formal claims.

For the current portfolio, see the [profile README](../README.md), [project catalogue](https://github.com/belentani7/belentani-omg-portal) and the linked repositories themselves.

Last editorial review: 2026-10-29.

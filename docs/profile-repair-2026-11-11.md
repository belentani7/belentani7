# Profile repair — 11 November 2026

## PRD
Present Pedro Belentani's engineering and creative practice clearly to recruiters,
clients and collaborators. Preserve Senior and the existing artwork and product work.

## SRS
Keep all three current source-project links. Distinguish historical test counts
from a current verification. Keep root and docs entry points identical, with local
assets resolving in both. Remove duplicated generated README blocks and retain
links to the product specification, evidence and historical record.

## Design
Retain the existing editorial banner, typography and interactive work. Place the
professional identity before operational details. Use concise project descriptions.

## ADR
The current root entry point is canonical because it contains newer work than
docs/index.html. Synchronize its mirror rather than reverting those additions.
Tests must protect the current three source destinations without claiming their
builds or deployments are verified.

## Plan
1. Run doctor and Python tests before changes.
2. Simplify README; repair metadata, identity and verification wording.
3. Synchronize the docs mirror and required static assets.
4. Run doctor, Python, Living Machine and Desktop checks.

## Given / When / Then
Given the two public entry points, when read from either publication root,
then their content is identical and referenced local assets exist.
Given historical test counts, when displayed, then their historical status is explicit.
Given the README, when read, then Senior, selected systems and evidence are retained.

## Baseline
Commit: 3037fa834b89c3a4982bc2b754cd2a1f0f1402fc.
Doctor: 50/50. Python: 32 tests, one failure (root/docs divergence).
GitHub CI for this commit: failure; separate Pages build: success.
No push, merge or deployment is part of this local repair.

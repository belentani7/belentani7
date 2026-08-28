# Bellentani architecture

Bellentani is a Windows desktop application built with Electron. The main process owns file access, process execution, credentials, workspace snapshots, Git actions and PVC-U evidence. The preload bridge exposes a narrow allow-list of operations. The renderer is an HTML/JavaScript workbench using Monaco and never receives Node.js integration.

## Data flow

1. The renderer selects a workspace and requests context through the preload bridge.
2. The main process validates paths and operation inputs.
3. PVC-U classifies the requested action and records evidence for high-risk operations.
4. The agent provider receives only bounded project context and returns a plan or structured file proposals.
5. Proposed changes are shown as diffs and require human confirmation.
6. The main process creates a snapshot before writing and stores the snapshot ID for rollback.
7. Terminal and task processes run with timeouts, output caps, working-directory checks and destructive-pattern guards.

## Extension boundary

Built-in capabilities are stable core features. Workspace extensions are JSON manifests under `.bellentani/extensions`. A future extension runtime must use explicit schemas and the same PVC-U tool policy; arbitrary code must not be loaded without a separate sandbox.

## Future production hardening

A production-grade release should add real LSP/DAP servers, OS-level sandboxing, signed installers, an update channel, streaming provider APIs, multi-agent worktrees, a full Open VSX-compatible extension host, Windows-native integration tests and encrypted state migration for all existing installations.

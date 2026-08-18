# Contributing to Bellentani

## Development flow

Create a branch, install dependencies with `npm ci`, run `npm test`, and run the Windows packaging check before opening a pull request. Changes affecting IPC, command execution, workspace writes, provider credentials, or PVC-U must include regression tests.

## Quality gate

A change is ready only when syntax checks, unit tests, `npm audit`, workspace path tests, snapshot/rollback tests, and the relevant Windows packaging step pass. Any new agent tool must define input limits, a PVC-U policy decision, audit evidence, and a reversible failure path.

## Pull requests

Describe the user-facing behavior, security implications, test evidence, and known limitations. Do not commit API keys, generated `dist` files, user state, or local workspace snapshots.

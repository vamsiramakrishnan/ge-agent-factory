# @ge/agent-workspace

Pure workspace contract helpers for generated GE agents.

This package extracts the generated-agent workspace path contract, manifest shape,
and promotion-critical file inventory into a standalone module. It is intended for
generators, validators, release gates, and external tooling that need to inspect or
produce a workspace without importing the full `factory` app.

## Solves

- Stable workspace paths for generated agent files, artifacts, evals, and data plans.
- Manifest shape checks that can run in CI or a promotion gate.
- A reusable list of required files and commands for standalone workspace validation.

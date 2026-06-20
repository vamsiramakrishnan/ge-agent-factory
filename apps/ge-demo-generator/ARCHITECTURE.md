# GE Demo Generator Architecture

The generator has one supported architecture: a local/workspace pipeline driven
by `ge`, `scripts/ge-mock.mjs`, and the harness daemon. Factory batches and
one-off agents both produce the same workspace contract and promotion evidence.

## Control Plane

- `src/cli.js` exposes one-off workspace operations.
- `src/factory.js` runs catalog/batch work through the same stages.
- `src/workspace-validation.js` and `src/spec-code-trace.js` produce deterministic
  readiness evidence.
- `src/harness-runtime.js` sends Antigravity/Gemini/Codex/Claude the same
  handoff packet and spec-to-code quality gate.
- `src/promotion-packet.js` packages validation, preview, trace, graph, and
  promotion blockers for downstream deploy/publish planning.

## State Boundaries

Repository-level generated state is centralized under `.ge/`:

- `.ge/factory/workspaces/` — generated local agent workspaces.
- `.ge/factory/workspaces.json` — workspace registry.
- `.ge/factory/runs/` — local factory run records.
- `.ge/missions/` — scenario, mock data, Snowfakery, and simulator artifacts.
- `.ge/runtime/` — daemon tasks, event streams, and resume plans.
- `.ge/skills/manifest.json` — synced harness skill manifest.

Workspace-local `.ge-harness/` directories may exist inside generated workspaces
for harness execution scratch. They are not the repository control plane.

## Workspace Contract

```text
spec -> fixtures -> tools/agent -> evals -> spec-code trace -> validation
     -> harness review/refine -> promotion packet
```

The source of truth is `mock_systems/usecase-spec.json` plus
`fixtures/manifest.json`. Generated code is not considered ready until
`artifacts/spec-code-trace.json` and `artifacts/validation-report.json` pass.

## Harness Loop

Harnesses do not receive vague "make it better" instructions. They receive:

- owned/avoid paths,
- selected local skills,
- behavior-contract trace requirements,
- required completion packet,
- validation and trace artifacts to inspect.

That keeps Antigravity and other harnesses aligned with the same quality bar as
the deterministic pipeline.

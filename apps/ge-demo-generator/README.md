# GE Demo Generator

The GE Demo Generator is the local-first agent workspace factory used by the
unified `ge` operator pipeline. It turns a typed use-case spec into a runnable
ADK workspace with deterministic fixtures, source-system tools, eval assets,
spec-to-code trace evidence, harness review/refine artifacts, and a promotion
packet.

## Canonical Flow

```bash
ge agents build --ids <use-case-id> --local
ge mission run --scenario <use-case-id> --ids <use-case-id> --target-stage preview
ge runtime tasks
ge agents sync --ids <use-case-id> --local
```

Factory/batch generation uses the same workspace contract through:

```bash
ge agents build --canary
ge agents build --all
ge agents status
ge agents sync --ids <use-case-id> --local
ge agents sync --ids <use-case-id> --local --remote <git-url> --push
```

Local factory workspaces are stored in `.ge/factory/workspaces/` and indexed by
`.ge/factory/workspaces.json`. Mission/data/simulator artifacts live under
`.ge/missions/`; daemon task state lives under `.ge/runtime/`.

## Workspace Contract

Every generated agent should converge on the same files:

```text
mock_systems/usecase-spec.json
fixtures/manifest.json
app/agent.py
app/tools.py
evals/golden.json
tests/eval/evalsets/ge_behavior_contract.evalset.json
tests/test_smoke.py
artifacts/spec-code-trace.json
artifacts/validation-report.json
artifacts/generator-feedback.json
artifacts/promotion-packet.json
workspace.json
```

`artifacts/spec-code-trace.json` is the deterministic proof that the behavior
contract was implemented in code, registered tools, agent instructions, evals,
and validation gates.

## Active Surfaces

- `src/` — daemon, CLI, workspace validation, harness runtime, promotion packet.
- `scripts/ge-mock.mjs` — deterministic workspace/data/tool/test pipeline.
- `web/` — browser UI for the local daemon.
- `skills/` and `.ge/skills/manifest.json` — canonical harness instructions.
- `.ge-harness/skills` — per-workspace skill mirror used during harness runs.
- `mcp-service/` — custom MCP/tool-plane service.

Legacy alternate generator surfaces and wrapper scripts have been removed. Use
`ge` and the workspace artifacts above for all one-off and factory generation
paths.

---
title: Run evals
parent: Cookbooks
nav_order: 9
layout: default
---

# Run evals

## Goal

Run the per-agent behavior-contract eval set that the factory generates for every
agent, and understand how it's derived from the spec's OKF test mechanisms.

## Prerequisites

- A generated agent workspace (see [Generate an agent](generate-an-agent.html)).
  The agent must have `behaviorContract.goldenEvals` — otherwise no eval set is
  produced.
- `agents-cli` installed (via `mise run deps` / `mise run setup`).

## What gets generated

For each agent the factory writes (see `renderAgentsCliEvalSet` in
`apps/factory/scripts/factory.mjs`):

- `tests/eval/evalsets/ge_behavior_contract.evalset.json` — the ADK-format eval
  set (`eval_set_id: "ge_behavior_contract"`, `eval_cases[]`, one per golden
  eval).
- `tests/eval/eval_config.json`
- `tests/eval/optimization_config.json`

Each eval case has a single-turn `conversation` whose `user_content` is the eval
prompt, plus `intermediate_data.tool_uses[]` — the expected trajectory.

## How it's derived from OKF test mechanisms

`renderAgentsCliEvalSet` builds the trajectory from the OKF Eval-Scenario
**mechanisms** (`deriveTestMechanisms(contract)`, the same helper that emits the
OKF `tests/<id>.md` concepts), preferring those mechanisms over the raw
`expectedToolCalls`. Each tool name is canonicalized and kept only if it's an
actual generated tool (`list_systems`, `query_<table>`, contract action tools).
So the evalset is the runnable projection of the spec's test concepts.

## Steps

1. **Change into the generated agent workspace.**

   ```bash
   cd .ge/factory/workspaces/<workspace-id>     # or the synced generated-agents/<agent>/ dir
   ```

2. **Run the eval set.** The factory invokes:

   ```bash
   agents-cli eval run --all
   ```

   When the config exists it adds the config flag (this is what the factory's
   lifecycle runner does):

   ```bash
   agents-cli eval run --all --config tests/eval/eval_config.json
   ```

   A timeout can be passed through (`--timeout <seconds>`). Optimization uses:

   ```bash
   agents-cli eval optimize --config tests/eval/optimization_config.json
   ```

   > `--all` and the JSON config paths are what the factory invokes today
   > (verified in `factory.mjs`). `agents-cli` flags can change between
   > releases — confirm with `agents-cli eval run --help` before relying on them.
   > The pin is `google-agents-cli>=0.2,<0.3` (see `mise run deps`), which keeps
   > `eval run --all`.
   {: .warning }

## Verify

```bash
cat tests/eval/evalsets/ge_behavior_contract.evalset.json | head   # eval_cases present
agents-cli eval run --all                                          # cases pass
```

## Troubleshoot

- **No `evalset.json`** — the agent has no `behaviorContract.goldenEvals`; the
  factory returns `null` and writes nothing. Add golden evals to the spec (the
  [interview](author-a-spec-via-interview.html) emits them) and rebuild.
- **`agents-cli: command not found`** — run `mise run deps` (installs
  `google-agents-cli`).
- **`eval run --all` flag rejected** — your `agents-cli` is outside the
  `>=0.2,<0.3` pin (newer versions removed `--all`). Reinstall the pinned version
  or check `agents-cli eval run --help`.
- **Tool-use mismatch** — only canonical generated tools are kept in the
  trajectory; if a golden eval referenced a tool the agent doesn't expose, it's
  dropped from the case.

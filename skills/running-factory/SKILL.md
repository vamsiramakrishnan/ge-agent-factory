---
name: running-factory
description: Runs GE factory build stages through the harness and CLI surfaces. Use when handling factory plans, workspace generation, data generation, package data, harness refinement, structured output parsing, or next-stage selection.
---

# Running Factory

Use this skill when the harness needs to move the early factory stations forward.

In plain language: the harness should not directly reimplement the factory. It should drive the CLI, read the JSON/artifacts the CLI returns, and then decide the next station. Sometimes the CLI itself invokes a harness task, such as Antigravity review/refine. That is fine as long as the outer harness treats the CLI result as the state transition.

## Assembly-Line Slot

- **First step:** find the current plan/run/workspace state.
- **Plays a role in:** `plan`, `generate_workspace`, `generate_data`, `package_data`, and `harness_refine`.
- **Input:** mission, target stage, selected use cases, local/remote mode, and existing run artifacts.
- **Output:** factory plan/run JSON, generated workspace, data package, harness review/refine artifacts.
- **Next step:** pass generated workspaces to `checking-workspaces`.

## Workflow

1. Prefer mission graph output for target, selection, data dependencies, and resume.
2. Use `ge mission plan` for end-to-end work that includes data, simulators, factory, or Autopilot.
3. Use direct `factory plan` only for a narrow factory-only diagnosis.
4. Run factory commands with explicit target and continuation policy.
4. Parse JSON output and inspect generated artifacts.
5. If a harness refine stage ran, inspect its artifact before validation.
6. Move to workspace gates only when workspace/data/package artifacts exist.

## Commands

Mission plan for a normal factory run:

```bash
bun tools/ge.mjs mission plan --scenario <usecase_id> --ids <agent_ids> --target-stage preview --json
```

Mission run when the graph should own data, factory, and convergence:

```bash
bun tools/ge.mjs daemon start
bun tools/ge.mjs mission run --scenario <usecase_id> --ids <agent_ids> --target-stage preview --with-factory
```

Mission status and resume:

```bash
bun tools/ge.mjs mission status <mission_task_id> --json
bun tools/ge.mjs mission resume <mission_task_id>
```

Plan:

```bash
node apps/factory/src/cli.js factory plan --department all --limit all --target previewed
```

Run:

```bash
node apps/factory/src/cli.js factory run --target previewed --continue true
```

Harness task:

```bash
node apps/factory/src/cli.js agent run --workspace-dir <workspace-dir> --message "<task>" --agent antigravity-sdk
```

Summarize a factory run artifact:

```bash
node skills/running-factory/scripts/summarize-factory-run.mjs .ge/factory/factory-run.json
```

## References

- Read `references/cli-harness-loop.md` before automating CLI calls.
- Read `references/assembly-line-role.md` to understand where this skill fits in the line.

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

1. Prefer pipeline graph output for target, selection, data dependencies, and resume.
2. Use `ge pipeline plan` for end-to-end work that includes data, simulators, factory, or Autopilot.
3. Use direct `factory plan` only for a narrow factory-only diagnosis.
4. Run factory commands with explicit target and continuation policy.
5. Parse JSON output and inspect generated artifacts.
6. If a harness refine stage ran, inspect its artifact before validation.
7. Move to workspace gates only when workspace/data/package artifacts exist.

## Commands

Pipeline plan for a normal factory run (local, no daemon needed):

```bash
bun tools/ge.mjs pipeline plan --scenario <usecase_id> --ids <agent_ids> --target-stage preview --json
```

Pipeline run when the graph should own data, factory, and convergence (needs the daemon):

```bash
bun tools/ge.mjs daemon start
bun tools/ge.mjs pipeline run --scenario <usecase_id> --ids <agent_ids> --target-stage preview --with-factory
```

Pipeline status and resume:

```bash
bun tools/ge.mjs pipeline status <pipeline_task_id> --json
bun tools/ge.mjs pipeline resume <pipeline_task_id>
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

Summarize a factory run artifact (the run writes `factory-run-<stamp>.json` under `.ge/factory/`):

```bash
node skills/running-factory/scripts/summarize-factory-run.mjs .ge/factory/factory-run-<stamp>.json
```

## References

- Read `references/example-session.md` first if this is your first factory run — a worked session (orient → pipeline plan → factory plan → factory run → summarize → hand-off), with real output and a failed-work-item variant.
- Read `references/cli-harness-loop.md` before automating CLI calls.
- Read `references/assembly-line-role.md` to understand where this skill fits in the line.
- Use `assets/factory-run-example.json` as the reference shape of a `ge.agent_factory.run` artifact — what `factory run` writes and what scripts/summarize-factory-run.mjs parses (smoke it against this file).

---
name: planning-missions
description: Plans Factory and Autopilot ownership for a GE agent run. Use when deciding local vs remote behavior, target gates, build ownership, repair/observe ownership, handoff, and resumability.
---

# Planning Missions

Use this skill to decide who owns the next move before the factory line starts or resumes.

Core model:

```text
Factory = producer of workspaces, release artifacts, and cloud side effects
Autopilot = supervisor of existing workspace/run convergence
Mission graph = durable DAG connecting Antigravity, data, simulators, factory, gates, and repair
```

## Assembly-Line Slot

In plain language: this skill is the traffic controller before the factory line starts moving. It decides whether the factory should build something, whether Autopilot should inspect or repair something that already exists, and whether the run is local or remote. Use it before launching work so the system does not accidentally rebuild agents, repair the wrong surface, or resume with a different intent.

- **First step:** create or inspect the mission graph with `bun tools/ge.mjs pipeline plan --json` (the `ge pipeline` noun owns mission planning today).
- **Plays a role in:** intake/control-plane routing before any 14-station run starts, and again on Autopilot resume.
- **Input:** selected agents/use cases, target stage, local/remote mode, repair policy.
- **Output:** a durable mission graph with node ownership, dependencies, artifacts, and resume plans.
- **Next step:** Factory runs the required station target; Autopilot supervises the matching workspace gate.

Use this skill when the question is “who owns the next move?” If an agent is missing, Factory usually owns it. If a local workspace already exists and needs to pass a gate, Autopilot owns the supervision loop. If the work is remote, Autopilot observes unless there is a synced local workspace or a real cloud repair stage.

## Workflow

1. Plan the mission before changing behavior:

```bash
bun tools/ge.mjs pipeline plan --scenario <usecase_id> --ids <agent_ids> --target-stage preview --json
bun tools/ge.mjs pipeline graph --scenario <usecase_id> --ids <agent_ids> --target-stage preview   # the executable DAG behind the plan
```

2. Check the graph `input`, `nodes`, `edges`, and `counts` first:
   - `doctor.gate`: readiness gate.
   - `antigravity.spec-data-review`: harness review of spec, eval, mock-data, simulator, and ADK eval contracts.
   - `mock.generate`, `snowfakery.generate`, `simulator.seed`, `simulator.validate`: scenario data layer.
   - `agent.build`: factory build node.
   - `autopilot.run`: convergence/repair node.
3. Run the graph only when the plan matches the user intent:

```bash
bun tools/ge.mjs daemon start
bun tools/ge.mjs pipeline run --scenario <usecase_id> --ids <agent_ids> --target-stage preview
```

By default, mission planning includes the Antigravity review node before data generation. Use `--no-antigravity` only for deterministic debugging when the harness is unavailable. The factory build node is represented but not auto-run unless `--with-factory` is passed.

4. Use status/resume instead of recomputing intent:

```bash
bun tools/ge.mjs pipeline status <pipeline_run_id> --json
bun tools/ge.mjs pipeline resume <pipeline_run_id>
bun tools/ge.mjs runs events <pipeline_run_id> --follow
```

5. If using the older mission contract API, check `modeContract` first:
   - `local_doctor_repair`: Autopilot may run workspace doctor/repair.
   - `remote_observe_only`: Autopilot observes remote factory state and must not claim local repair.
6. Preserve mission graph input on resume. Do not recompute intent from current UI filters.
7. If changing stages or modes, update tests in `tools/lib/pipeline-plan.test.mjs`, `tools/lib/pipeline/pipeline-node-registry.test.mjs`, and `tools/lib/runtime-daemon.test.mjs`.

## Source Files

- Stage plan: `tools/lib/pipeline-plan.mjs`
- Orchestration DAG: `tools/lib/pipeline/pipeline-graph-plan.mjs`
- Data/graph nodes: `tools/lib/pipeline/pipeline-nodes.mjs`
- Node registry: `tools/lib/pipeline/pipeline-node-registry.mjs`
- Core wrapper: `tools/lib/factory-core.mjs` `pipelinePlan` / `pipelineGraphPlan`
- CLI: `tools/ge/pipeline.mjs`
- Console API: `apps/console/src/server/ge-api.mjs` `/api/ge/pipeline/plan` + `/api/ge/pipeline/graph`
- Autopilot runtime: `apps/console/src/server/transport.mjs`
- Console view: `apps/console/src/views/Pipeline.tsx`

## Scripts

Validate a mission contract JSON file or stdin:

```bash
node skills/planning-missions/scripts/validate-mission.mjs <mission.json>
```

## Local/Remote Rules

Local mode:

- Factory surface: local harness.
- Workspace source: `.ge/factory/projects`.
- Autopilot capability: local doctor/repair.
- Publish handoff: `ge agents ship`.

Remote mode:

- Factory surface: cloud factory.
- Artifact source: remote runs/GCS.
- Autopilot capability: observe only.
- Repairs require synced/prebuilt local workspace or a real cloud repair stage.

## Validation

Run:

```bash
bun test tools/lib/pipeline-plan.test.mjs tools/lib/pipeline/pipeline-node-registry.test.mjs tools/lib/runtime-daemon.test.mjs
```

## References

- Read `references/example-session.md` first if this is your first planning pass — a worked ownership decision (plan → graph → run → resume) with real `ge pipeline` output and the daemon-down failure variant.
- Copy `assets/mission-contract-example.json` when working the legacy mission-contract API — a complete contract that passes `scripts/validate-mission.mjs`, annotated with the mode/capability invariants.
- Read `references/assembly-line-role.md` to understand where this skill fits in the Agent Factory assembly line.
- Read `references/mission-contract.md` before changing mission shape or ownership fields.
- Read `references/mission-node-kinds.md` before adding or changing graph nodes.
- Read `references/local-remote-modes.md` before changing mode, handoff, or repair behavior.

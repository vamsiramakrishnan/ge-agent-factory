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

- **First step:** create or inspect the mission graph with `bun tools/ge.mjs mission plan --json`.
- **Plays a role in:** intake/control-plane routing before any 14-station run starts, and again on Autopilot resume.
- **Input:** selected agents/use cases, target stage, local/remote mode, repair policy.
- **Output:** a durable mission graph with node ownership, dependencies, artifacts, and resume plans.
- **Next step:** Factory runs the required station target; Autopilot supervises the matching workspace gate.

Use this skill when the question is “who owns the next move?” If an agent is missing, Factory usually owns it. If a local workspace already exists and needs to pass a gate, Autopilot owns the supervision loop. If the work is remote, Autopilot observes unless there is a synced local workspace or a real cloud repair stage.

## Workflow

1. Plan the mission before changing behavior:

```bash
bun tools/ge.mjs mission plan --scenario <usecase_id> --ids <agent_ids> --target-stage preview --json
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
bun tools/ge.mjs mission run --scenario <usecase_id> --ids <agent_ids> --target-stage preview
```

By default, mission planning includes the Antigravity review node before data generation. Use `--no-antigravity` only for deterministic debugging when the harness is unavailable.

4. Use status/resume instead of recomputing intent:

```bash
bun tools/ge.mjs mission status <mission_task_id> --json
bun tools/ge.mjs mission resume <mission_task_id>
bun tools/ge.mjs runtime events <mission_task_id> --follow
```

5. If using the older mission contract API, check `modeContract` first:
   - `local_doctor_repair`: Autopilot may run workspace doctor/repair.
   - `remote_observe_only`: Autopilot observes remote factory state and must not claim local repair.
6. Preserve mission graph input on resume. Do not recompute intent from current UI filters.
7. If changing stages or modes, update tests in `tools/lib/mission-plan.test.mjs` and `tools/lib/runtime-daemon.test.mjs`.

## Source Files

- Mission graph: `tools/lib/mission-plan.mjs`
- Mission data nodes: `tools/lib/mission-nodes.mjs`
- Mission node registry: `tools/lib/mission-node-registry.mjs`
- Older mission contract: `tools/lib/planning-missions.mjs`
- Core wrapper: `tools/lib/factory-core.mjs` `missionPlan`
- Console API: `apps/console/src/server/ge-api.mjs` `/api/ge/mission`
- Autopilot runtime: `apps/console/src/server/transport.mjs`
- Console view: `apps/console/src/views/Autopilot.tsx`

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
node --test tools/lib/mission-plan.test.mjs tools/lib/mission-node-registry.test.mjs tools/lib/runtime-daemon.test.mjs
```

## References

- Read `references/assembly-line-role.md` to understand where this skill fits in the Agent Factory assembly line.
- Read `references/mission-contract.md` before changing mission shape or ownership fields.
- Read `references/mission-node-kinds.md` before adding or changing graph nodes.
- Read `references/local-remote-modes.md` before changing mode, handoff, or repair behavior.

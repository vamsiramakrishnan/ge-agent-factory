# Mission Contract Reference

The mission graph is the primary shared intent object between Factory, Autopilot, Console, runtime daemon, and harnesses.

Use the older mission contract shape only when working with console compatibility paths that still expose `/api/ge/mission`.

## Mission Graph Shape

```json
{
  "kind": "ge.mission.graph",
  "version": 1,
  "input": {
    "mode": "local",
    "ids": ["ad-hoc-query-agent"],
    "scenario": "benefits-open-enrollment",
    "workspace": ".ge/missions/benefits-open-enrollment",
    "systems": ["workday"],
    "targetStage": "preview",
    "repair": true,
    "attempts": 3
  },
  "nodes": [],
  "edges": [],
  "counts": {
    "total": 0,
    "done": 0,
    "running": 0,
    "blocked": 0,
    "pending": 0,
    "skipped": 0
  }
}
```

Every node should expose:

- `id`, `kind`, `runtimeKind`, `status`, and `dependsOn`.
- deterministic `input`.
- expected `artifacts`.
- `resumePlan` with `nextAction`, `safeToRun`, `commands`, `reason`, and `blockers`.

## Mission Commands

```bash
bun tools/ge.mjs pipeline plan --scenario <usecase_id> --ids <agent_ids> --target-stage preview --json
bun tools/ge.mjs pipeline run --scenario <usecase_id> --ids <agent_ids> --target-stage preview
bun tools/ge.mjs pipeline status <pipeline_run_id> --json
bun tools/ge.mjs pipeline resume <pipeline_run_id>
```

## Legacy Contract Shape

```json
{
  "kind": "ge.factory_autopilot.mission",
  "version": 1,
  "mode": "local",
  "modeContract": {
    "factorySurface": "local_harness",
    "autopilotCapability": "local_doctor_repair",
    "effectiveFactoryTarget": "previewed"
  },
  "target": {
    "requested": "preview",
    "workspaceGate": "preview",
    "effectiveFactoryTarget": "previewed",
    "requiredArtifacts": []
  },
  "summary": {
    "selected": 0,
    "factory": 0,
    "autopilot": 0,
    "remoteObserve": 0,
    "autopilotAfterFactory": 0
  },
  "phases": [],
  "roster": []
}
```

## Ownership Fields

- `summary.factory`: immediate Factory work.
- `summary.autopilot`: immediate local doctor/repair work.
- `summary.remoteObserve`: immediate remote observation work.
- `summary.autopilotAfterFactory`: work that becomes Autopilot-owned only after Factory produces a workspace/run.

Do not merge these counts. The distinction prevents broad reruns and fake repairs.

## Roster Actions

- `build_local`: Factory should produce via local harness.
- `build_remote`: Factory should submit to cloud factory.
- `doctor_repair`: Autopilot may run local doctor/repair.
- `observe_remote_run`: Autopilot should inspect remote factory/run state.
- `after_factory_output`: item is waiting for Factory output.
- `remote_workspace_not_locally_repairable`: a remote/synced ambiguity; do not claim repair.

## Change Rule

Any change to stage names, mode semantics, ownership counts, or roster actions must update:

- `tools/lib/pipeline-plan.test.mjs`
- `apps/console/src/services/geClient.ts`
- `apps/console/src/views/Pipeline.tsx`

# Week 5: State Model Cleanup

## Goal

Establish one authoritative runtime state model and make all other files projections. The target is reliable job lifecycle behavior, recoverable console state, and clear stage transitions.

## Primary Risks Addressed

- Project and run state spread across JSON files, SQLite, workspace manifests, pipeline files, artifact reports, `.ge.json`, and GCS.
- Console jobs tracked only in process memory.
- Stage transitions inferred from artifacts and sometimes fabricated.
- UI marking work complete before process exit.

## Scope

### 1. Choose The Authoritative Store

Preferred local choice:

- SQLite for current snapshot tables.
- Append-only event log for audit and replay.

Implementation tasks:

- Define canonical entities:
  - project
  - agent
  - run
  - stage
  - artifact
  - job
  - activity event.
- Define stage lifecycle states:
  - `pending`
  - `running`
  - `succeeded`
  - `failed`
  - `cancelled`
  - `skipped`.
- Define allowed transitions.
- Add versioned schema migrations.

Acceptance criteria:

- There is one documented source of truth for local runtime state.
- Files like `workspace.json` and `pipeline.json` are explicitly projections.

### 2. Stop Fabricating Readiness

Target areas:

- `apps/ge-demo-generator/src/server.js`
- extracted workspace/stage service from Week 4.

Implementation tasks:

- Remove code paths that synthesize passing validation reports without real validation.
- Store validation status only when produced by a validation command or imported trusted result.
- Make readiness derived from canonical run/stage data.
- Add explicit `manual_override` only if needed, with actor, reason, and timestamp.

Acceptance criteria:

- A workspace cannot become `tested` without a validation event or trusted imported validation result.
- Tests cover invalid stage jumps.

### 3. Persist Console Jobs

Target areas:

- `apps/console/src/server/transport.mjs`
- `apps/console/src/server/ge-api.mjs`
- `apps/console/src/components/JobToast.tsx`

Implementation tasks:

- Replace process-local `Map` as the only source of job truth.
- Persist job metadata and terminal status.
- Persist log tails or references to log files.
- Add cancellation status.
- Rehydrate job status after console server restart.

Acceptance criteria:

- Restarting the console server does not lose known job terminal status.
- Cancelled jobs display as cancelled, not failed or unknown.

### 4. Fix Job And Stage Event Semantics

Target areas:

- console transport
- generator run service
- presentation factory provisioning UI.

Implementation tasks:

- Distinguish event types:
  - `stage_started`
  - `stage_done`
  - `stage_failed`
  - `job_started`
  - `job_done`
  - `job_failed`
  - `job_cancelled`.
- End SSE streams only on job-terminal events.
- Update UI to avoid marking a job successful on child stage completion.

Acceptance criteria:

- Multi-stage jobs remain active after intermediate `stage_done`.
- UI terminal state matches process exit or canonical job status.

### 5. Build Projection Writers

Target areas:

- workspace manifest writer
- pipeline writer
- artifact writer.

Implementation tasks:

- Create projection functions from canonical state:
  - `writeWorkspaceManifest(projectId)`
  - `writePipelineJson(projectId)`
  - `writePromotionPacket(projectId)`
- Make projection writes idempotent.
- Add a rebuild command for corrupted projection files.

Acceptance criteria:

- Deleting a projection can be repaired from canonical state.
- Projection rebuild does not mutate canonical events.

## Suggested PR Breakdown

1. State model design and migrations.
2. Stage transition service.
3. Console job persistence.
4. Event semantics cleanup.
5. Projection writers and rebuild command.

## Validation

- Unit tests for allowed transitions.
- Unit tests for projection rebuild.
- Console restart smoke test.
- Run/cancel/retry browser smoke test.

## Implementation Details

### Canonical SQLite Tables

Add a migration under the existing DB module, for example `apps/ge-demo-generator/src/db/migrations/00xx_runtime_state.sql`:

```sql
CREATE TABLE IF NOT EXISTS runtime_events (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  actor TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  type TEXT NOT NULL,
  payload_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  project_id TEXT,
  agent_id TEXT,
  command TEXT,
  args_json TEXT,
  started_at TEXT,
  finished_at TEXT,
  exit_code INTEGER,
  signal TEXT,
  log_path TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS run_stages (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  stage TEXT NOT NULL,
  status TEXT NOT NULL,
  attempt INTEGER NOT NULL DEFAULT 1,
  started_at TEXT,
  finished_at TEXT,
  artifact_refs_json TEXT NOT NULL DEFAULT '[]',
  error_json TEXT,
  UNIQUE(run_id, stage, attempt)
);
```

If the current DB file does not use SQL migrations, add a lightweight migration runner before adding feature logic.

### Event Types

Use these canonical event names:

- `project.created`
- `project.updated`
- `agent.created`
- `agent.stage_transitioned`
- `run.created`
- `run.stage_started`
- `run.stage_succeeded`
- `run.stage_failed`
- `run.cancelled`
- `job.created`
- `job.started`
- `job.output`
- `job.succeeded`
- `job.failed`
- `job.cancelled`
- `artifact.written`

Every event payload must include:

- `schemaVersion`
- `source`
- `correlationId` when part of a larger command
- minimal data needed to rebuild projections.

### Stage Transition Function

Create `apps/ge-demo-generator/src/services/stage-machine.js`:

```js
const ALLOWED = {
  briefed: ["generated"],
  generated: ["tested"],
  tested: ["serving", "deployed"],
  serving: ["deployed"],
  deployed: ["published"],
  published: []
};

export function transitionStage(current, next, evidence) {
  if (!ALLOWED[current]?.includes(next) && current !== next) {
    throw new Error(`invalid stage transition ${current} -> ${next}`);
  }
  if (next === "tested" && evidence?.validationOk !== true) {
    throw new Error("tested requires successful validation evidence");
  }
  return { previous: current, next, evidence };
}
```

Allow manual override only through:

```js
manualOverrideStage({ actor, reason, from, to })
```

and record it as a separate event.

### Projection Ownership

Projection writers:

- `workspace.json`: summary for generated workspace consumers.
- `mock_systems/pipeline.json`: human-readable pipeline projection.
- `artifacts/*.json`: immutable-ish evidence reports.

Rules:

- Projection writers read canonical DB state.
- Projection writers may be rerun.
- Projection writers must not infer new canonical state.
- Missing projection files are repaired by `ge state rebuild-projections`.

### Console Job Persistence

Replace in-memory-only `Map` with:

- DB row in `jobs`.
- log file path under `.harness/jobs/<job-id>.ndjson`.
- process handle map only for currently running jobs.

On server restart:

- jobs with `running` status and no process handle become `unknown` or `interrupted`.
- terminal jobs remain visible.

SSE endpoint behavior:

- historical log replay first.
- then live process events if process exists.
- close only on `job.succeeded`, `job.failed`, `job.cancelled`, or client disconnect.

### Migration Script

Add command:

```bash
bun apps/ge-demo-generator/src/cli.js state migrate
```

Migration reads:

- `projects.json`
- existing SQLite project/agent rows
- `workspace.json`
- `mock_systems/pipeline.json`
- validation and preview reports.

It writes:

- canonical project/agent/job/stage rows.
- `runtime_events`.

Dry run mode:

```bash
bun apps/ge-demo-generator/src/cli.js state migrate --dry-run
```

### API Changes

Do not break clients immediately. Keep response shape stable, but add fields:

- `sourceOfTruth: "sqlite"`
- `projectionStale: boolean`
- `lastEventId`
- `jobStatus`

### Tests To Add

- `apps/ge-demo-generator/src/services/stage-machine.test.js`
  - invalid transitions rejected.
  - tested without validation rejected.
  - manual override records reason.
- `apps/ge-demo-generator/src/services/projection-service.test.js`
  - rebuilds `workspace.json`.
  - rebuilds `pipeline.json`.
- `apps/console/src/server/transport.persistence.test.mjs`
  - job survives restart.
  - running job without process becomes interrupted.
  - SSE does not close on intermediate stage event.

### Rollout Steps

1. Add schema and migration runner.
2. Dual-write old files and canonical DB for one PR.
3. Read from canonical DB while still writing projections.
4. Add rebuild command.
5. Remove old state inference paths.

## Out Of Scope

- Full cloud Firestore state migration.
- Generated data migration.
- IAM changes.

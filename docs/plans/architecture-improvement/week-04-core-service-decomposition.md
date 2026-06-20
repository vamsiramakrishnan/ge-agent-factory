# Week 4: Core Service Decomposition

## Goal

Break oversized orchestration modules into testable services while preserving behavior. The target is lower coupling, fewer blocking request paths, and clear side-effect boundaries.

## Primary Risks Addressed

- `factory-core.mjs` mixing planning, persistence, Terraform, gcloud, git, and HTTP behavior.
- `server.js` combining routing, process management, static serving, secrets, DB writes, preview, and artifacts.
- Blocking subprocess calls inside request/console paths.
- Hard-to-test command and state transitions.

## Scope

### 1. Extract A Shared Executor Layer

Target areas:

- `tools/lib/factory-core.mjs`
- `tools/lib/exec-stream.mjs`
- `apps/ge-demo-generator/src/factory-worker.js`
- `apps/presentation/src/server/factory-bridge.js`

Implementation tasks:

- Create an executor abstraction:
  - `run(command, args, options)`
  - `stream(command, args, options)`
  - timeout support
  - structured stdout/stderr
  - cancellation support.
- Replace direct `execFileSync`, `spawn`, and ad hoc subprocess wrappers where practical.
- Keep sync wrappers only for CLI-only short operations if needed.
- Return structured errors with command metadata and safe stderr tails.

Acceptance criteria:

- Request handlers can use async execution.
- Tests can mock the executor.
- No new command path uses shell strings.

### 2. Split `factory-core.mjs`

Proposed modules:

- `tools/lib/config.mjs`
- `tools/lib/terraform-service.mjs`
- `tools/lib/cloud-run-service.mjs`
- `tools/lib/factory-client.mjs`
- `tools/lib/catalog-service.mjs`
- `tools/lib/state-store.mjs`
- `tools/lib/sync-service.mjs`
- `tools/lib/local-harness-service.mjs`
- `tools/lib/doctor-service.mjs`

Implementation tasks:

- Move pure planning logic first.
- Move file/state writes behind `state-store`.
- Move Terraform command construction into `terraform-service`.
- Move Cloud Run/gcloud calls into `cloud-run-service`.
- Move HTTP calls to gateway into `factory-client`.
- Keep `factory-core.mjs` as a compatibility facade until callers migrate.

Acceptance criteria:

- Existing CLI commands still work.
- New modules have focused unit tests.
- `factory-core.mjs` shrinks substantially and mostly delegates.

### 3. Split Generator Daemon Server

Target areas:

- `apps/ge-demo-generator/src/server.js`

Proposed modules:

- `routes/projects.js`
- `routes/runs.js`
- `routes/secrets.js`
- `routes/preview.js`
- `routes/factory.js`
- `services/project-service.js`
- `services/run-service.js`
- `services/secret-service.js`
- `services/preview-service.js`
- `services/artifact-store.js`
- `services/workspace-stage-service.js`
- `middleware/auth.js`
- `middleware/body.js`

Implementation tasks:

- Introduce a minimal router or route table.
- Move request parsing and response helpers into shared utilities.
- Move auth before route dispatch.
- Extract preview process management.
- Extract workspace stage mutation.
- Extract artifact writing.
- Avoid changing endpoint contracts during the first pass.

Acceptance criteria:

- Existing API tests still pass.
- Route files are small and endpoint-focused.
- Stage mutation logic is separately tested.

### 4. Separate Factory Stage Execution From Cloud APIs

Target areas:

- `apps/ge-demo-generator/src/factory-worker.js`
- `apps/ge-demo-generator/src/factory-orchestration.js`

Implementation tasks:

- Split stage graph definitions from execution.
- Represent stage commands as typed command specs.
- Move GCS artifact handling into `ArtifactStore`.
- Move Cloud Tasks enqueueing into `TaskQueue`.
- Move Cloud Build polling into `CloudBuildService`.

Acceptance criteria:

- Stage plans can be unit tested without GCP.
- Worker can run with mocked stores/queues/build services.

## Suggested PR Breakdown

1. Executor abstraction.
2. `factory-core` module extraction.
3. Server route extraction.
4. Worker service extraction.
5. Compatibility facade cleanup.

## Validation

- Run existing unit tests.
- Add unit tests for extracted modules.
- Run local daemon smoke test.
- Run `ge doctor --local`.
- Run one canary factory submission in local mode.

## Migration Strategy

- Keep exported function names stable during extraction.
- Move code first, then improve internals.
- Avoid mixing behavior fixes with mechanical movement unless the bug is directly exposed by tests.

## Implementation Details

### Extraction Order

Use this order to keep PRs reviewable:

1. Extract pure helpers with no behavior changes.
2. Extract subprocess execution behind an interface.
3. Extract state/file writes.
4. Extract cloud provider operations.
5. Extract route modules.
6. Remove the compatibility facade only after all callers move.

Do not split `server.js` and `factory-core.mjs` in the same PR.

### Executor Interface

Create `tools/lib/executor.mjs`:

```js
export class CommandError extends Error {
  constructor(message, { command, args, cwd, code, signal, stdout, stderr }) {
    super(message);
    Object.assign(this, { command, args, cwd, code, signal, stdout, stderr });
  }
}

export function createExecutor({ env = process.env, spawnImpl } = {}) {
  return {
    run(command, args, options) {},
    stream(command, args, options) {},
    runJson(command, args, options) {}
  };
}
```

Expected options:

- `cwd`
- `env`
- `timeoutMs`
- `stdin`
- `captureLimit`
- `signal`
- `redactArgs`.

All services should receive an executor instance rather than importing `child_process` directly.

### `factory-core` Target Module Boundaries

Move functions as follows:

| Current function | New module |
| --- | --- |
| `loadConfig`, `init`, `setMode` | `tools/lib/config-service.mjs` |
| `tfOutputs`, `tfVarArgs`, `infra`, `cutover` | `tools/lib/terraform-service.mjs` |
| `describeRun`, `deploy`, `build`, `mcpDeploy`, `mcpDoctor` | `tools/lib/cloud-run-service.mjs` |
| `withGateway`, `postJson`, `getJson`, `provision`, `status`, `ship` | `tools/lib/factory-client.mjs` |
| `loadCatalog`, `listUsecases`, `toAgent` | `tools/lib/catalog-service.mjs` |
| `readJson`, `writeJson`, `.ge-state.json` access | `tools/lib/state-store.mjs` |
| `sync`, `syncLocal`, `copyWorkspaces` | `tools/lib/sync-service.mjs` |
| `ensureLocalUv`, `provisionLocal`, `localPreflight` | `tools/lib/local-harness-service.mjs` |
| `doctor`, `dataDoctor`, `doctorAll`, `statusBoard` | `tools/lib/doctor-service.mjs` |

Keep `tools/lib/factory-core.mjs` as:

```js
export { loadConfig, init, setMode } from "./config-service.mjs";
export { infra, cutover } from "./terraform-service.mjs";
// ...
```

### Generator Server Route Table

Introduce route registration like:

```js
const routes = [
  ["GET", /^\/api\/projects$/, projectRoutes.list],
  ["POST", /^\/api\/projects$/, projectRoutes.create],
  ["POST", /^\/api\/runs$/, runRoutes.start],
  ["GET", /^\/api\/runs\/([^/]+)\/events$/, runRoutes.events],
  ["POST", /^\/api\/secrets$/, secretRoutes.upsert]
];
```

Each route receives:

```js
{
  req,
  res,
  params,
  body,
  services,
  auth
}
```

This avoids another framework dependency while removing the long `if` chain.

### Services To Extract From `server.js`

`ProjectService`:

- create/list/read/delete projects.
- bridge JSON store to canonical DB until Week 5 migration.

`RunService`:

- start/cancel/list/stream runs.
- owns SSE event emission.

`PreviewService`:

- start/stop ADK preview.
- owns child process lifecycle.

`WorkspaceStageService`:

- infer/persist stage.
- writes projection files until Week 5 replaces the model.

`SecretService`:

- list/read/upsert/delete secrets.
- never returns secret values unless explicitly requested by an authenticated privileged route.

`ArtifactStore`:

- write validation, preview, deploy, publish artifacts.
- centralizes file names and JSON formatting.

### Dependency Injection Shape

Create service factory:

```js
export function createServices({ dataRoot, repoRoot, executor, db }) {
  return {
    projects: createProjectService(...),
    runs: createRunService(...),
    previews: createPreviewService(...),
    secrets: createSecretService(...),
    artifacts: createArtifactStore(...)
  };
}
```

Tests can instantiate services with a temp directory and fake executor.

### Worker Service Extraction

Split `factory-worker.js` into:

- `worker/payload.js`
  - parse and validate worker payload.
- `worker/stage-plan.js`
  - maps stage to command specs.
- `worker/artifacts.js`
  - GCS/local artifact persistence.
- `worker/cloud-build.js`
  - submit and poll Cloud Build.
- `worker/task-queue.js`
  - enqueue next stage.
- `worker/stage-runner.js`
  - executes one stage and emits events.

### Tests To Add

- `tools/lib/terraform-service.test.mjs`
  - var args generated correctly.
  - no auto-approve on plan.
- `tools/lib/factory-client.test.mjs`
  - gateway URL/proxy behavior with mocked executor.
- `apps/ge-demo-generator/src/services/preview-service.test.js`
  - starts process with expected cwd/env.
  - terminates existing preview.
- `apps/ge-demo-generator/src/routes/run-routes.test.js`
  - validates payload and delegates to RunService.
- `apps/ge-demo-generator/src/worker/stage-runner.test.js`
  - command plan is executed in order.

### Definition Of Done

- `server.js` route entrypoint is under 400 lines.
- `factory-core.mjs` is a facade or under 250 lines.
- No service imports `child_process` except the executor.
- New code paths have tests with mocked side effects.

## Out Of Scope

- State store redesign.
- Generated catalog migration.
- Terraform/IAM changes.

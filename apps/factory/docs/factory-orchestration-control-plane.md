# GE Agent Factory Control Plane

The factory should not depend on a Cloud Workstation process staying alive. The workstation, web UI, CLI, or any future TUI should submit intent, stream status, and inspect artifacts. The durable control plane owns execution.

## Target Shape

Use one Google Cloud project with shared services:

- Firestore: durable run, stage, lock, approval, and UI state.
- Pub/Sub: event fanout for run updates, UI refreshes, and worker notifications.
- Cloud Tasks: per-stage work queue with retry, rate limits, and dedupe keys.
- Cloud Run Jobs: isolated execution for deterministic generation, packaging, validation, and control-plane dispatch stages.
- Cloud Workflows: optional high-level sequencer for one workspace or batch run.
- GCS: immutable artifacts, logs, generated code bundles, mock data packages, and promotion packets.
- Cloud Build: canonical release execution for deploy/publish stages, with long timeouts, logs, provenance, and source/build isolation.
- Secret Manager: service account, API, and environment secrets.

Pub/Sub alone is not enough. It is great for fanout, but it does not give reliable per-task retry, lease semantics, or ordered stage transitions. Cloud Tasks plus Firestore stage state is the practical backbone.

## Core Records

Firestore collections:

- `factoryRuns/{runId}`: batch intent, target stage, actor, environment, aggregate status.
- `factoryRuns/{runId}/items/{itemId}`: use case, workspace id, current stage, cloud targets.
- `factoryRuns/{runId}/items/{itemId}/stages/{stageId}`: state machine row for one stage.
- `factoryRuns/{runId}/events/{eventId}`: append-only status events for UI and audit.
- `workspaces/{workspaceId}`: stable workspace state, active agent, readiness, selected version.
- `operations/{operationId}`: long-running cloud operation status, provider IDs, next poll time.

GCS layout:

```text
gs://<factory-bucket>/runs/<runId>/plan.json
gs://<factory-bucket>/runs/<runId>/items/<itemId>/workspace.tar.zst
gs://<factory-bucket>/runs/<runId>/items/<itemId>/logs/<stage>.jsonl
gs://<factory-bucket>/runs/<runId>/items/<itemId>/artifacts/promotion-packet.json
gs://<factory-bucket>/workspaces/<workspaceId>/versions/<versionId>.tar.zst
```

## Stage Graph

Each stage is idempotent and resumable:

1. `plan`: select use cases, rows, datastores, systems, cloud targets.
2. `generate_workspace`: scaffold ADK project, write agent code and tests.
3. `generate_data`: Snowfakery recipe plus generated fixture data.
4. `package_data`: AlloyDB, Firestore, Bigtable, BigQuery, GCS package plans.
5. `validate`: local smoke tests and static contract checks.
6. `preview`: one deterministic `adk run` prompt, no deployment.
7. `plan_deploy`: graph, commands, IAM, services, region validation.
8. `load_data`: cloud data load jobs, skipped unless explicitly enabled.
9. `deploy_runtime`: Agent Runtime or Cloud Run/GKE deploy through Cloud Build. The worker never runs `agents-cli deploy` in-process.
10. `poll_runtime`: poll long-running operation through Cloud Build until metadata exists.
11. `register_tools`: Agent Registry MCP/A2A registration when requested.
12. `publish_enterprise`: Gemini Enterprise registration against the resolved app resource through Cloud Build.
13. `verify_live`: smoke prompt against deployed/registered endpoint.

## Worker Contract

Every worker receives:

```json
{
  "runId": "run_...",
  "itemId": "hr-benefits",
  "workspaceId": "hr-benefits-agent",
  "stage": "deploy_runtime",
  "attempt": 2,
  "targetStage": "publish_enterprise",
  "cloud": {
    "projectId": "vital-octagon-19612",
    "projectNumber": "440790012685",
    "runtimeRegion": "us-central1",
    "genaiLocation": "global",
    "geminiEnterpriseLocation": "global",
    "geminiEnterpriseApp": "projects/440790012685/locations/global/collections/default_collection/engines/phoenix-telco_1751440131886"
  },
  "artifactPrefix": "gs://<factory-bucket>/runs/<runId>/items/<itemId>"
}
```

The canonical submission path is:

```bash
node src/cli.js factory submit \
  --workspace <workspace-id> \
  --project <gcp-project-id> \
  --project-number <gcp-project-number> \
  --stage validate \
  --target publish_enterprise \
  --bucket <factory-artifact-bucket>
```

This command:

1. Archives the selected workspace to `workspace.tar.gz`.
2. Uploads it to `gs://<factory-bucket>/runs/<runId>/items/<itemId>/workspace.tar.gz`.
3. Writes `factoryRuns/{runId}`, `items/{itemId}`, and the first `stages/{stage}` row to Firestore.
4. Creates a Cloud Tasks HTTP task with a deterministic task id.
5. The task calls the Cloud Run Jobs `:run` API with an OAuth token for the factory runner service account.
6. The Cloud Run Job receives `scripts/factory-worker.mjs --payload <json>`.
7. The worker restores the workspace archive, runs the stage, persists artifacts/events, and enqueues the next stage when it is within `targetStage`.

Every worker returns:

```json
{
  "status": "done|running|failed|blocked",
  "stage": "deploy_runtime",
  "artifacts": ["deployment_metadata.json"],
  "operation": "projects/.../operations/...",
  "nextStage": "poll_runtime",
  "error": null
}
```

## Reliability Rules

- Stage state is written before and after side effects.
- Every stage has an idempotency key: `<runId>/<itemId>/<stage>`.
- Every queued task has a deterministic Cloud Tasks id derived from `<runId>/<itemId>/<stage>/<attempt>`; duplicate task creation is treated as an idempotent success.
- Long-running cloud operations never block a workstation process. They record `operationId` and enqueue `poll_runtime`.
- Retries are stage-aware. Generation can retry freely; cloud create steps must detect existing resources first.
- Release stages run only in Cloud Build, not the web daemon, workstation, or Cloud Run worker process. The worker dispatches a build and records the build identity.
- UI status is derived from Firestore stage rows and Pub/Sub events, not from in-memory browser state.
- Workspace names used by Agents CLI are capped and validated before generation.
- Gemini Enterprise app names are resolved to full resource names before publish.
- `targetStage` and deployment runtime target are separate fields.
- Failed stages preserve logs and artifacts; a retry starts from the failed stage, not from scratch.

## Surfaces

- Web UI: dashboard, graph, logs, approvals, retries.
- CLI: submit, status, retry, cancel, export packet.
- TUI: optional operator console for batch monitoring. It should use the same API as the web UI.

The local implementation runs the same contract with filesystem-backed state:
daemon tasks/events/resume plans in `.ge/runtime/`, local factory runs in
`.ge/factory/runs/`, and generated workspaces in `.ge/factory/workspaces/`.
The cloud-backed implementation swaps the storage and queue adapters without
changing stage behavior.

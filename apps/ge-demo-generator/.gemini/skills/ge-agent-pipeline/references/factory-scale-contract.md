# Factory Scale Contract

Use this when planning, generating, or validating many agents across the full GE use-case catalog.

The factory must treat each use case as an immutable work item:

```json
{
  "workItemId": "hr-benefits-q-a-enrollment",
  "useCaseId": "benefits-q-a-enrollment",
  "department": "hr",
  "targetStage": "publish_enterprise",
  "specHash": "sha256:...",
  "seed": 42,
  "rowPolicy": {"defaultRowsPerEntity": 50, "minimumRowsPerEntity": 25},
  "systems": ["Workday", "Benefits Platform", "Google Chat"],
  "stages": [
    "create",
    "validate",
    "preview",
    "plan_deploy",
    "package_data",
    "load_data",
    "deploy_runtime",
    "poll_runtime",
    "register_tools",
    "publish_enterprise",
    "verify_live"
  ]
}
```

At 360-agent scale:

- Queue each agent independently. Never block a department batch on one failed agent.
- Persist state in Cloud Storage/Firestore and emit Pub/Sub events for each stage transition.
- Every stage must be idempotent. Re-running the same `workItemId + stage + specHash` should overwrite only that stage's artifacts.
- Store artifacts under `runs/<runId>/items/<workItemId>/`.
- Cache dependency-heavy steps through Cloud Build where possible. Cloud Run Jobs should orchestrate; Cloud Build should do slow package/deploy work.
- Use one Google Cloud project per environment, one shared AlloyDB instance with per-agent databases/schemas, shared Firestore/Bigtable instances with per-agent collections/tables, and per-agent BigQuery datasets.
- Every workspace must pass `scripts/check-usecase-spec.mjs`, `ge validate`, and `uv run pytest` before deploy/runtime stages.
- Publish only after runtime deployment metadata, MCP/ADK registration metadata, data package manifest, and preview evidence exist.

Batch-level reporting must include:

- total items, done, failed, blocked, retrying;
- failures grouped by deterministic validator, dependency, permission, Cloud Build, Cloud Run, or live publish;
- per-agent artifact links;
- next retry command and whether the retry is safe.

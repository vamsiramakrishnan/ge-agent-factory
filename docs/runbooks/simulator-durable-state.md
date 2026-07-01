# Runbook — Simulator durable state (Firestore / AlloyDB)

**Status:** Manual deploy step. Wiring (code, env passthrough, tests) has landed;
**actually flipping a system to a cloud backend is a documented manual operation**
and is **not** performed by CI or by building this repo. It needs project
credentials and is effectively irreversible for live demo state, so it is gated
behind this runbook (per ADR 0001 and the phase-2 design spec).

## What this controls

Each simulator system keeps its per-`(agent:system:scenario)` state in a
`StateStore` (`apps/factory/mcp-service/simulator_runtime/state_store.py`).
Three backends exist:

| backend     | home of state                                  | selected by                              |
|-------------|------------------------------------------------|------------------------------------------|
| `memory`    | in-process dict (default; local + tests)       | default                                  |
| `firestore` | Firestore collection `simulator_state`         | ADC + `GOOGLE_CLOUD_PROJECT`             |
| `alloydb`   | AlloyDB table `simulator_state` (JSONB kv)     | psycopg DSN in `GE_AGENT_ALLOYDB_DSN`    |

Backend selection precedence (in `get_state_store` / `generic.py`):

1. **Per-system `stateBackend`** in `registry.json` — always wins when set to a
   non-default value (`firestore` / `alloydb`).
2. **Global override** env `GE_SIMULATOR_STATE_BACKEND` — applies to any system
   that leaves `stateBackend` at its default (`memory` / absent).
3. **Default** — `memory`.

<p align="center">
  <img src="../assets/diagrams/state-backend-precedence.svg" alt="Per-system stateBackend beats the global env override beats the memory default, then a durable choice degrades to memory if its dependency or config is missing" width="600">
</p>

If a cloud backend is requested but its dependency or config is missing at
runtime, the store **logs a warning and degrades to memory** rather than failing
the run. So a misconfigured deploy never hard-fails demos — but state is then
ephemeral; verify (below) to confirm it is actually durable.

## 0. Prerequisites

- `ge` CLI configured for the target project (`ge init`; `.ge.json` has
  `project` / `region`). Mode `remote` (`ge mode remote`).
- The mcp-service image includes `google-cloud-firestore` (firestore) and/or
  `psycopg[binary]` (alloydb) in `mcp-service/pyproject.toml`. These are **lazy
  imports** — absent ⇒ that backend degrades to memory. See "New dependencies"
  at the bottom; add them before deploying a cloud backend.

## 1. Provision the backend

### Firestore (recommended for live run state — ADR 0001)

```bash
# One Firestore database per project (Native mode). agent-scoped DBs already exist
# from the load_data stage; the simulator uses the default DB + collection.
gcloud firestore databases create --location=<region> --type=firestore-native \
  --project=<project>     # skip if a Native-mode DB already exists

# No schema/collection to pre-create: documents in `simulator_state` are created
# on first write. Optionally pre-grant the runner SA:
gcloud projects add-iam-policy-binding <project> \
  --member="serviceAccount:<runner-sa>" --role="roles/datastore.user"
```

### AlloyDB (relational source of truth — ADR 0001)

```bash
# Reuse the AlloyDB instance the data plane already provisions (its DSN secret is
# checked by `ge data doctor`). The store auto-creates the table:
#   CREATE TABLE IF NOT EXISTS simulator_state (namespace TEXT PRIMARY KEY, doc JSONB NOT NULL)
# Confirm the DSN secret exists and is reachable:
bun tools/ge.mjs data doctor    # checks AlloyDB DSN secret
```

The DSN is passed to the service as `GE_AGENT_ALLOYDB_DSN` (psycopg format,
e.g. `postgresql://USER:PASS@HOST:5432/DBNAME`).

## 2. Set env on the Cloud Run mcp-service

Env for the per-department MCP services is set in
`deployEnvVars(cfg)` in `tools/lib/mcp-plane.mjs` and applied by `ge mcp deploy`
via `gcloud run deploy --update-env-vars` (the Dockerfile declares these with
empty defaults so Cloud Run can override them).

Add the durable-state vars to `deployEnvVars` (one-line edit), e.g.:

```js
function deployEnvVars(cfg) {
  const extra = [];
  if (cfg.simulatorStateBackend) extra.push(`GE_SIMULATOR_STATE_BACKEND=${cfg.simulatorStateBackend}`);
  if (cfg.project) extra.push(`GOOGLE_CLOUD_PROJECT=${cfg.project}`);
  if (cfg.alloydbDsn) extra.push(`GE_AGENT_ALLOYDB_DSN=${cfg.alloydbDsn}`);
  return [`GE_DATA_BACKEND=mcp`, `GE_AGENT_DATA_BUCKET=${cfg.dataBucket || ""}`, ...extra].join(",");
}
```

Then redeploy the tool plane (this is the `ge infra apply` → tool-plane flow):

```bash
bun tools/ge.mjs mcp deploy     # redeploys the 5 department MCP services with new env
bun tools/ge.mjs mcp doctor     # services Ready
```

For a quick out-of-band flip without code changes, you can also set the env
directly on a service (Terraform/`ge` remains the source of truth; reconcile
after):

```bash
gcloud run services update ge-agent-factory-mcp-<dept> \
  --region=<region> --project=<project> \
  --update-env-vars GE_SIMULATOR_STATE_BACKEND=firestore,GOOGLE_CLOUD_PROJECT=<project>
```

> Per `docs/OPERATIONS.md`, Terraform/`ge` own Cloud Run config; prefer the
> `deployEnvVars` edit + `ge mcp deploy` path so the next apply doesn't revert it.
{: .note }

## 3. Choose what flips to durable

Two ways, combinable:

- **Global override (simplest):** set `GE_SIMULATOR_STATE_BACKEND=firestore`.
  Every system that has no explicit `stateBackend` then uses Firestore. Best for
  "make the whole fleet durable in this environment."
- **Per-system:** set `"stateBackend": "firestore"` on chosen systems in
  `registry.json` (owned by the consolidation step — see recommendations in the
  phase-2 report). A per-system value wins over the global override, so you can
  pin a system to `memory` even when the override is on.

Recommended rollout: turn on the **global override** in the staging environment
first, soak, then set explicit per-system `stateBackend: firestore` on the
de-cloned high-value systems (`servicenow`, `sap_s4hana_fi`, `coupa`, `jira`,
`workday`) for production durability.

## 4. Verify

```bash
# (a) Service picked up the env:
gcloud run services describe ge-agent-factory-mcp-<dept> --region=<region> \
  --project=<project> --format='value(spec.template.spec.containers[0].env)'

# (b) Drive one stateful tool call (e.g. a submit_*_update), then confirm a doc
#     landed in Firestore. Namespaces are `agent:system:scenario:generic`.
gcloud firestore documents list \
  "projects/<project>/databases/(default)/documents/simulator_state" \
  --project=<project> | head

# AlloyDB equivalent:
#   SELECT namespace FROM simulator_state LIMIT 5;

# (c) Durability check: restart the revision and re-read prior state — it must
#     survive (memory backend would lose it).
```

If `simulator_state` stays empty after a stateful call, the backend silently
degraded to memory (missing dep / ADC / DSN). Check the service logs for
`stateBackend ... unavailable ... falling back to memory` and fix the cause
(usually: missing `google-cloud-firestore` in the image, or missing
`GOOGLE_CLOUD_PROJECT` / `GE_AGENT_ALLOYDB_DSN`).

## 5. Rollback

- Global: unset `GE_SIMULATOR_STATE_BACKEND` (or set `=memory`) and `ge mcp deploy`.
- Per-system: set `stateBackend` back to `memory` (or remove it) in `registry.json`.
- Existing durable docs are left in place; switching back to memory simply ignores
  them (state re-hydrates from seed). Delete the `simulator_state` collection/table
  manually if you want a clean slate.

## New dependencies (add before deploying a cloud backend)

These are **not** added by this wiring task (no lockfile mutation here). Add to
`apps/factory/mcp-service/pyproject.toml` before flipping the matching
backend:

- `google-cloud-firestore` — required by the `firestore` backend.
- `psycopg[binary]` — required by the `alloydb` backend.

Both are imported lazily, so a system on `memory` (the default, and all of
local/CI) needs neither.

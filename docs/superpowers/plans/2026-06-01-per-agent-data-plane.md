# Per-agent Data-Plane Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provision real, shared per-project data stores (BigQuery, GCS, AlloyDB, Firestore, Bigtable) with per-agent objects, loaded at `load_data`, and queryable at runtime — so generated agents run on real infra, not just fixtures.

**Architecture:** Three tiers — Tier-1 shared instances via Terraform (`installer/terraform/data_plane.tf`), Tier-2 per-agent objects created+loaded idempotently in the existing `load_data` factory stage, Tier-3 generated `tools.py` backend switch (`GE_DATA_BACKEND`, default `fixtures`). Spec: `docs/superpowers/specs/2026-06-01-per-agent-data-plane-design.md`.

**Tech Stack:** Terraform (google + google-beta ~>6.0), Bun + citty CLI (`tools/`), Node generator (`apps/ge-demo-generator`), Python ADK (`tools.py`), gcloud/bq/psql.

**Coordination:** Tasks 1–8 + 12 are `tools/` + `installer/` (this change's territory). Tasks 9–11 modify the generator (`plan-mock-data.mjs`, `factory-worker.js`, the `tools.py` template) which the parallel packs/source-integration work also edits — sequence those with that owner; build on `source-integration-plan.json` (`52af872`).

---

## File Structure

- `installer/terraform/data_plane.tf` (new) — shared instances + IAM + DSN secret + outputs.
- `installer/terraform/variables.tf` (modify) — `enable_alloydb`/`enable_bigtable`/`enable_bigquery`/`enable_gcs_data` (default true), `data_bucket_name`, `bq_data_location`, `alloydb_*` sizing, `vpc_network`.
- `tools/lib/factory-core.mjs` (modify) — `dataUp()`, data-plane fields in `loadConfig`/`init`, doctor data-plane checks.
- `tools/ge.mjs` (modify) — `ge data <up|doctor>` command.
- `apps/ge-demo-generator/scripts/plan-mock-data.mjs` (modify) — Tier-2 describe-or-create+load per-agent objects.
- `apps/ge-demo-generator/src/factory-worker.js` (modify) — pass data-plane connection substitutions to `load_data`.
- `apps/ge-demo-generator/scripts/ge-mock.mjs` (modify) — `tools.py` template backend switch.
- `apps/ge-demo-generator/tests/data-plane.test.js` (new) — generator unit tests.
- `docs/OPERATIONS.md` (modify) — data-plane section + cost note.

---

## Task 1: Terraform data-plane variables

**Files:** Modify `installer/terraform/variables.tf`

- [ ] **Step 1: Add the data-plane vars**

```hcl
variable "enable_bigquery"   { type = bool   default = true }
variable "enable_gcs_data"   { type = bool   default = true }
variable "enable_alloydb"    { type = bool   default = true }
variable "enable_bigtable"   { type = bool   default = true }
variable "enable_firestore"  { type = bool   default = true }
variable "data_bucket_name"  { type = string default = "" }   # default <project>-ge-agent-data
variable "bq_data_location"  { type = string default = "US" }
variable "vpc_network"       { type = string default = "default" } # for AlloyDB private services access
variable "alloydb_password"  { type = string default = "" sensitive = true } # generated if empty
```

- [ ] **Step 2: Verify it parses**

Run: `terraform -chdir=installer/terraform fmt -check data_plane.tf variables.tf || terraform -chdir=installer/terraform validate`
Expected: no parse errors (validate may warn about missing vars until Task 6 outputs exist — that's fine mid-task).

- [ ] **Step 3: Commit**

```bash
git add installer/terraform/variables.tf
git commit -m "feat(data-plane): terraform vars for shared stores (default on)"
```

## Task 2: GCS data bucket + IAM

**Files:** Create `installer/terraform/data_plane.tf`

- [ ] **Step 1: Add the data bucket + bucket-scoped IAM**

```hcl
locals {
  data_bucket = var.data_bucket_name != "" ? var.data_bucket_name : "${var.project_id}-ge-agent-data"
  data_sas    = [google_service_account.runner.email, google_service_account.gateway.email]
}

resource "google_storage_bucket" "data" {
  count                       = var.enable_gcs_data ? 1 : 0
  project                     = var.project_id
  name                        = local.data_bucket
  location                    = var.region
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
}

resource "google_storage_bucket_iam_member" "data_admin" {
  for_each = var.enable_gcs_data ? toset(local.data_sas) : []
  bucket   = google_storage_bucket.data[0].name
  role     = "roles/storage.objectAdmin"
  member   = "serviceAccount:${each.value}"
}
```

- [ ] **Step 2: Validate** — `terraform -chdir=installer/terraform validate` → no new errors.
- [ ] **Step 3: Commit** — `git commit -am "feat(data-plane): shared GCS data bucket + IAM"`

## Task 3: BigQuery IAM (no instance)

**Files:** Modify `installer/terraform/data_plane.tf`

- [ ] **Step 1: Grant BQ roles project-level (datasets are per-agent → Tier-2)**

```hcl
resource "google_project_iam_member" "bq_data_editor" {
  for_each = var.enable_bigquery ? toset(local.data_sas) : []
  project  = var.project_id
  role     = "roles/bigquery.dataEditor"
  member   = "serviceAccount:${each.value}"
}
resource "google_project_iam_member" "bq_job_user" {
  for_each = var.enable_bigquery ? toset(local.data_sas) : []
  project  = var.project_id
  role     = "roles/bigquery.jobUser"
  member   = "serviceAccount:${each.value}"
}
```

- [ ] **Step 2: Validate.** **Step 3: Commit** — `git commit -am "feat(data-plane): BigQuery IAM"`

## Task 4: AlloyDB cluster + instance + DSN secret + IAM

**Files:** Modify `installer/terraform/data_plane.tf`

- [ ] **Step 1: Add AlloyDB + Secret Manager DSN**

```hcl
resource "random_password" "alloydb" {
  count   = var.enable_alloydb && var.alloydb_password == "" ? 1 : 0
  length  = 24
  special = false
}
locals {
  alloydb_pw = var.alloydb_password != "" ? var.alloydb_password : (var.enable_alloydb ? random_password.alloydb[0].result : "")
}
resource "google_alloydb_cluster" "data" {
  count      = var.enable_alloydb ? 1 : 0
  project    = var.project_id
  cluster_id = "ge-agent-data"
  location   = var.region
  network_config { network = "projects/${var.project_id}/global/networks/${var.vpc_network}" }
  initial_user { user = "postgres" password = local.alloydb_pw }
  lifecycle { prevent_destroy = true }
}
resource "google_alloydb_instance" "primary" {
  count         = var.enable_alloydb ? 1 : 0
  cluster       = google_alloydb_cluster.data[0].name
  instance_id   = "primary"
  instance_type = "PRIMARY"
  machine_config { cpu_count = 2 }
}
resource "google_secret_manager_secret" "alloydb_dsn" {
  count     = var.enable_alloydb ? 1 : 0
  project   = var.project_id
  secret_id = "ge-agent-alloydb-dsn"
  replication { auto {} }
}
resource "google_secret_manager_secret_version" "alloydb_dsn" {
  count       = var.enable_alloydb ? 1 : 0
  secret      = google_secret_manager_secret.alloydb_dsn[0].id
  secret_data = "postgresql://postgres:${local.alloydb_pw}@${google_alloydb_instance.primary[0].ip_address}:5432/postgres"
}
resource "google_project_iam_member" "alloydb_client" {
  for_each = var.enable_alloydb ? toset(local.data_sas) : []
  project  = var.project_id
  role     = "roles/alloydb.client"
  member   = "serviceAccount:${each.value}"
}
```

> NOTE: AlloyDB requires the `servicenetworking` private-services-access connection on `vpc_network`. If the network lacks it, document the one-time `gcloud services vpc-peerings connect` in OPERATIONS (don't fail the apply silently).

- [ ] **Step 2: Validate.** **Step 3: Commit** — `git commit -am "feat(data-plane): AlloyDB cluster+instance + DSN secret + IAM"`

## Task 5: Bigtable instance + IAM

**Files:** Modify `installer/terraform/data_plane.tf`

- [ ] **Step 1: Add Bigtable**

```hcl
resource "google_bigtable_instance" "data" {
  count               = var.enable_bigtable ? 1 : 0
  project             = var.project_id
  name                = "ge-agent-data"
  deletion_protection = true
  cluster {
    cluster_id   = "ge-agent-data-c1"
    zone         = "${var.region}-a"
    num_nodes    = 1
    storage_type = "SSD"
  }
}
resource "google_project_iam_member" "bigtable_user" {
  for_each = var.enable_bigtable ? toset(local.data_sas) : []
  project  = var.project_id
  role     = "roles/bigtable.user"
  member   = "serviceAccount:${each.value}"
}
```

- [ ] **Step 2: Validate.** **Step 3: Commit** — `git commit -am "feat(data-plane): Bigtable instance + IAM"`

## Task 6: Firestore IAM + outputs

**Files:** Modify `installer/terraform/data_plane.tf`

- [ ] **Step 1: Firestore IAM (datastore.user) + secretAccessor + outputs**

```hcl
resource "google_project_iam_member" "datastore_user" {
  for_each = var.enable_firestore ? toset(local.data_sas) : []
  project  = var.project_id
  role     = "roles/datastore.user"
  member   = "serviceAccount:${each.value}"
}
resource "google_project_iam_member" "data_secret_accessor" {
  for_each = var.enable_alloydb ? toset(local.data_sas) : []
  project  = var.project_id
  role     = "roles/secretmanager.secretAccessor"
  member   = "serviceAccount:${each.value}"
}

output "data_bucket"        { value = var.enable_gcs_data ? google_storage_bucket.data[0].name : "" }
output "bq_location"        { value = var.bq_data_location }
output "alloydb_dsn_secret" { value = var.enable_alloydb ? google_secret_manager_secret.alloydb_dsn[0].secret_id : "" }
output "alloydb_instance"   { value = var.enable_alloydb ? google_alloydb_instance.primary[0].name : "" }
output "bigtable_instance"  { value = var.enable_bigtable ? google_bigtable_instance.data[0].name : "" }
output "firestore_location" { value = var.gemini_enterprise_location }
```

- [ ] **Step 2: Validate full module** — `terraform -chdir=installer/terraform validate` → Success.
- [ ] **Step 3: Commit** — `git commit -am "feat(data-plane): Firestore IAM + data-plane outputs"`

## Task 7: `ge data up` + config

**Files:** Modify `tools/lib/factory-core.mjs`, `tools/ge.mjs`

- [ ] **Step 1: factory-core — add data-plane fields to loadConfig**

In `loadConfig` return object add:
```js
dataBucket: file.dataBucket || (project ? `${project}-ge-agent-data` : undefined),
alloydbDsnSecret: file.alloydbDsnSecret || "ge-agent-alloydb-dsn",
bigtableInstance: file.bigtableInstance || "ge-agent-data",
bqLocation: file.bqLocation || "US",
```

- [ ] **Step 2: factory-core — `dataUp` (drives the data-plane apply + records outputs)**

```js
export function dataUp(cfg, { log = noop } = {}) {
  ensureBin("terraform"); ensureGcloud();
  if (!cfg.project || !cfg.projectNumber || !cfg.geAppId) throw new Error("run `ge init` first (project/number/geApp required).");
  log("terraform apply (data plane: BQ/GCS/AlloyDB/Firestore/Bigtable)…");
  infra(cfg, { sub: "apply", log });               // data_plane.tf is part of the module
  const out = tfOutputs();
  const cur = readJson(join(REPO_ROOT, ".ge.json"), {});
  const merged = { ...cur, dataBucket: out.data_bucket || cur.dataBucket, alloydbDsnSecret: out.alloydb_dsn_secret || cur.alloydbDsnSecret, bigtableInstance: out.bigtable_instance || cur.bigtableInstance, bqLocation: out.bq_location || cur.bqLocation, firestoreLocation: out.firestore_location || cur.firestoreLocation };
  writeJson(join(REPO_ROOT, ".ge.json"), merged);
  return { dataBucket: merged.dataBucket, alloydbDsnSecret: merged.alloydbDsnSecret, bigtableInstance: merged.bigtableInstance, bqLocation: merged.bqLocation };
}
```

- [ ] **Step 3: ge.mjs — add `ge data` command (sub: up|doctor)**

```js
const data = defineCommand({
  meta: { name: "data", description: "Provision/check the shared data plane (BQ/GCS/AlloyDB/Firestore/Bigtable)" },
  args: { ...common, sub: { type: "positional", required: true, description: "up | doctor" } },
  run({ args }) {
    if (args.sub === "doctor") { const r = core.dataDoctor(cfgFrom(args)); emit(args, r, (x) => { for (const c of x.checks) out(`${ICON[c.status]} ${c.name.padEnd(28)} ${pc.dim(c.detail)}`); }); return; }
    const r = core.dataUp(cfgFrom(args), { log: elog });
    emit(args, r, (x) => out(pc.green(`✓ data plane up — bucket ${x.dataBucket}, alloydb secret ${x.alloydbDsnSecret}, bigtable ${x.bigtableInstance}`)));
  },
});
```
Register `data` in `subCommands`.

- [ ] **Step 4: Verify** — `node --check tools/ge.mjs tools/lib/factory-core.mjs && bun tools/ge.mjs data --help`
Expected: help renders with `up | doctor`.

- [ ] **Step 5: Commit** — `git commit -am "feat(ge): ge data up — drive data-plane apply + record outputs"`

## Task 8: `ge data doctor` checks

**Files:** Modify `tools/lib/factory-core.mjs`

- [ ] **Step 1: Add dataDoctor**

```js
export function dataDoctor(cfg) {
  ensureGcloud();
  const checks = [];
  const add = (name, ok, detail, fix) => checks.push({ name, status: ok ? "pass" : "warn", detail, fix: fix || null });
  const bkt = gcloud(["storage", "buckets", "describe", `gs://${cfg.dataBucket}`, "--format=value(name)"], { allowFail: true });
  add("data bucket", bkt.ok, bkt.ok ? cfg.dataBucket : "missing", `ge data up`);
  const sec = gcloud(["secrets", "versions", "access", "latest", "--secret", cfg.alloydbDsnSecret, "--project", cfg.project], { allowFail: true });
  add("alloydb DSN secret", sec.ok, sec.ok ? "readable" : "missing/denied", `ge data up`);
  const bt = gcloud(["bigtable", "instances", "describe", cfg.bigtableInstance, "--project", cfg.project, "--format=value(name)"], { allowFail: true });
  add("bigtable instance", bt.ok, bt.ok ? cfg.bigtableInstance : "missing", `ge data up`);
  return { mode: "data", checks, fails: checks.filter((c) => c.status === "fail").length };
}
```

- [ ] **Step 2: Verify** — `node --check tools/lib/factory-core.mjs`. **Step 3: Commit** — `git commit -am "feat(ge): ge data doctor"`

## Task 9: Tier-2 — per-agent object create+load (generator) [coordinate]

**Files:** Modify `apps/ge-demo-generator/scripts/plan-mock-data.mjs`; Test `apps/ge-demo-generator/tests/data-plane.test.js`

- [ ] **Step 1: Write the failing test** (`tests/data-plane.test.js`)

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildLoadScript } from "../scripts/plan-mock-data.mjs"; // export it
test("bigquery load script is describe-or-create + per-agent dataset", () => {
  const s = buildLoadScript("bigquery", { agentId: "acct-recon" });
  assert.match(s, /bq mk --dataset .*agent_acct_recon/);
  assert.match(s, /bq load/);
});
test("alloydb load creates per-agent database then applies schema", () => {
  const s = buildLoadScript("alloydb", { agentId: "acct-recon" });
  assert.match(s, /CREATE DATABASE/i);
  assert.match(s, /agent_acct_recon/);
});
```

- [ ] **Step 2: Run → fail** — `cd apps/ge-demo-generator && node --test tests/data-plane.test.js` → FAIL (`buildLoadScript` not exported).

- [ ] **Step 3: Implement** — extract/extend the per-store load-script bodies (currently inline at `plan-mock-data.mjs:683-749`) into an exported `buildLoadScript(store, { agentId })` that emits describe-or-create against the per-agent object then load. Example BigQuery body:

```js
export function buildLoadScript(store, { agentId }) {
  const ns = agentId.replace(/[^a-zA-Z0-9]+/g, "_");
  if (store === "bigquery") return [
    "#!/usr/bin/env bash", "set -euo pipefail",
    `DS="${"${GOOGLE_CLOUD_PROJECT}"}:agent_${ns}"`,
    `bq --location "${"${BQ_LOCATION:-US}"}" mk --dataset "$DS" >/dev/null 2>&1 || true`,
    `for f in mock_data/olap/bigquery/*.ndjson; do t=$(basename "$f" .ndjson); bq load --source_format=NEWLINE_DELIMITED_JSON "$DS.$t" "$f" mock_data/olap/bigquery/schemas.json || true; done`,
    "",
  ].join("\n");
  if (store === "alloydb") return [
    "#!/usr/bin/env bash", "set -euo pipefail",
    `DB="agent_${ns}"`,
    `psql "$ALLOYDB_ADMIN_DSN" -tc "SELECT 1 FROM pg_database WHERE datname='$DB'" | grep -q 1 || psql "$ALLOYDB_ADMIN_DSN" -c "CREATE DATABASE $DB"`,
    `psql "${"${ALLOYDB_ADMIN_DSN%/*}"}/$DB" -f mock_data/oltp/alloydb/schema.sql`,
    "",
  ].join("\n");
  // firestore (named DB agent-<ns>), bigtable (table agent_<ns>), gcs (prefix agents/<ns>/) — same describe-or-create shape
  /* … */
  return "#!/usr/bin/env bash\nset -euo pipefail\n";
}
```
Then have the existing writers call `buildLoadScript(store, { agentId: plan.id })`.

- [ ] **Step 4: Run → pass** — `node --test tests/data-plane.test.js` → PASS.
- [ ] **Step 5: Commit** — `git commit -am "feat(data-plane): per-agent describe-or-create+load scripts"`

## Task 10: Tier-2 — data-plane substitutions to load_data (generator) [coordinate]

**Files:** Modify `apps/ge-demo-generator/src/factory-worker.js`

- [ ] **Step 1: Add connection substitutions** in `buildStageExecutionPlan` substitutionPairs (only used by `load_data` / cloudbuild):

```js
`_BQ_LOCATION=${payload.cloud?.bqLocation || "US"}`,
`_DATA_BUCKET=${payload.cloud?.dataBucket || ""}`,
`_ALLOYDB_DSN_SECRET=${payload.cloud?.alloydbDsnSecret || ""}`,
`_BIGTABLE_INSTANCE=${payload.cloud?.bigtableInstance || ""}`,
```
And in `factory-bridge.js` `submitFactoryRun` payload `cloud` block, source these from the run target (which `ge`/.ge.json provides).

- [ ] **Step 2: Verify** — `node --check apps/ge-demo-generator/src/factory-worker.js apps/presentation/src/server/factory-bridge.js`
- [ ] **Step 3: Commit** — `git commit -am "feat(data-plane): pass store connections to load_data"`

## Task 11: Tier-3 — tools.py backend switch (generator) [coordinate]

**Files:** Modify `apps/ge-demo-generator/scripts/ge-mock.mjs` (the `tools.py` template); Test `tests/data-plane.test.js`

- [ ] **Step 1: Failing test** — assert the generated `tools.py` reads `GE_DATA_BACKEND` and has both a fixtures path and a bigquery path.

```js
test("tools.py supports a backend switch defaulting to fixtures", () => {
  const py = renderToolsPy(sampleManifest); // export the renderer
  assert.match(py, /GE_DATA_BACKEND/);
  assert.match(py, /fixtures/);
  assert.match(py, /bigquery/);
});
```

- [ ] **Step 2: Run → fail.**
- [ ] **Step 3: Implement** — in the `tools.py` generator, wrap each `query_*` so it dispatches on `os.environ.get("GE_DATA_BACKEND","fixtures")`: `fixtures` → current CSV/JSON read; `bigquery` → `google.cloud.bigquery` query against dataset `agent_<ns>` (ns from `GE_AGENT_NS`); stubs for `alloydb`/`firestore`/`bigtable` that raise a clear NotImplemented for unported stores. Keep `fixtures` default so smoke tests pass.
- [ ] **Step 4: Run → pass** + run existing smoke generation to confirm 27/27 unaffected.
- [ ] **Step 5: Commit** — `git commit -am "feat(data-plane): runtime backend switch in generated tools.py"`

## Task 12: Docs

**Files:** Modify `docs/OPERATIONS.md`

- [ ] **Step 1:** Add a "Data plane" section: `ge data up` / `ge data doctor`, the per-agent object naming, the AlloyDB VPC private-services-access prerequisite, the `GE_DATA_BACKEND` runtime env, and the cost note (AlloyDB/Bigtable are the drivers; `enable_*` flags for teardown).
- [ ] **Step 2: Commit** — `git commit -am "docs: data-plane operations"`

---

## Verification (end to end)

1. `terraform -chdir=installer/terraform validate` → Success (Tasks 1–6).
2. `bun tools/ge.mjs data --help` and `node --test apps/ge-demo-generator/tests/data-plane.test.js` → pass (Tasks 7–11).
3. On an authed machine: `ge data up` stands up bucket + AlloyDB + Bigtable + secret + IAM; `ge data doctor` green.
4. Build 1 agent to `load_data` → `agent_<id>` dataset/db/table/named-db/prefix created + loaded.
5. Deploy that agent with `GE_DATA_BACKEND=bigquery` + `GE_AGENT_NS=<id>` → it returns rows from its dataset.
6. Local `ge provision --local` (fixtures default) → existing smoke/eval gates still pass (27/27).

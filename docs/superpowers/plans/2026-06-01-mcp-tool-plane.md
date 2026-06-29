# MCP Tool Plane Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every generated agent real tools over two MCP tiers — Google Cloud 1P managed MCP servers for store access, and a generic multi-tenant FastMCP service (deployed per department on Cloud Run) for domain-system facades, registered per-agent in Agent Registry — and consume both from the runtime agent with agent-identity auth.

**Architecture:** A single generic FastMCP server (`apps/factory/mcp-service/`) is deployed 5× as `ge-agent-factory-mcp-<dept>` by a fleet-level `ge mcp deploy`. It is multi-tenant: each request carries `?agent=<id>`; the server loads that agent's `mcp-tools.json` + store coordinates from `gs://<dataBucket>/agents/<id>/` and serves tools backed by the per-agent stores (or fixtures). The per-agent pipeline only adds a cheap Agent Registry entry pointing at its department URL. Generated `app/tools.py` switches its toolset on `GE_DATA_BACKEND`: `fixtures` (in-process FunctionTools, today's behavior) vs `mcp` (`MCPToolset` over the dept custom MCP + 1P MCP endpoints).

**Tech Stack:** Terraform (google/google-beta ~>6.0), Node ESM (citty CLI, factory-core), Python (ADK `MCPToolset`/`StreamableHTTPConnectionParams`, `fastmcp`), Cloud Run, Agent Registry (`gcloud alpha agent-registry`).

**Spec:** `docs/superpowers/specs/2026-06-01-mcp-tool-plane-design.md`

**Environment note:** In the sandbox, `terraform`, `gcloud`, and a GCP-authenticated Python env are unavailable. Terraform tasks verify with HCL brace/reference checks; JS with `node --check` and `bun test`; Python with `python -m py_compile` and an offline fixtures smoke test. Live deploy/registration is run on the authed machine.

**Commit identity (repo convention):** `git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit` — no `Co-Authored-By`.

---

## File Structure

| File | Responsibility |
|---|---|
| `installer/terraform/mcp.tf` (new) | `enable_mcp` IAM: `roles/mcp.toolUser` + `roles/agentregistry.editor` on the runner/runtime SAs; outputs. |
| `installer/terraform/agent_identity.tf` (new) | Grant the runtime role set + `run.invoker` to the Agent Runtime agent-identity `principalSet` (Preview), gated by `enable_agent_identity`. |
| `installer/terraform/variables.tf` (mod) | `enable_mcp`, `enable_agent_identity`, `agent_identity_org_id` variables. |
| `installer/terraform/apis.tf` (mod) | `agentregistry.googleapis.com` gated by `enable_mcp`. |
| `apps/factory/mcp-service/server.py` (new) | Generic multi-tenant FastMCP server: `?agent=<id>` → load manifest from GCS → serve store/fixture tools. |
| `apps/factory/mcp-service/Dockerfile` (new) | Container for the server (runs on Cloud Run). |
| `apps/factory/mcp-service/pyproject.toml` (new) | Server deps (`fastmcp`, `google-cloud-*`). |
| `apps/factory/mcp-service/tests/test_server_smoke.py` (new) | Offline fixtures smoke test (lists tools for an agent). |
| `tools/lib/factory-core.mjs` (mod) | `loadConfig` mcp fields; `DEPARTMENTS`; `mcpDeploy()`; `mcpDoctor()`. |
| `tools/ge.mjs` (mod) | `ge mcp deploy` / `doctor` command. |
| `tools/mcp-server.mjs` (mod) | `factory_mcp_deploy` / `factory_mcp_doctor` tools. |
| `apps/factory/scripts/factory.mjs` (mod) | `app/tools.py` `GE_DATA_BACKEND` switch; pivot `cmdRegister --as mcp` to dept URL `?agent=<id>`. |
| `apps/factory/scripts/factory/integration/source-integration.mjs` (mod) | Correct ADK usage strings (`MCPToolset`, not `ApiRegistry`/`AgentRegistry`); record dept-service registry target. |
| `apps/factory/src/factory-worker.js` (mod) | `register_tools` stage passes the dept URL + `agent` id to `register --as mcp`. |
| `docs/OPERATIONS.md`, `docs/MCP.md` (mod) | Tool-plane runbook + the two tiers. |

---

## Task 1: Terraform — MCP IAM + API + agent-identity grants

**Files:**
- Modify: `installer/terraform/variables.tf`
- Modify: `installer/terraform/apis.tf`
- Create: `installer/terraform/mcp.tf`
- Create: `installer/terraform/agent_identity.tf`

- [ ] **Step 1: Add the MCP + agent-identity variables**

In `installer/terraform/variables.tf`, after the data-plane variables block, add:

```hcl
# ── MCP tool plane (mcp.tf) ──────────────────────────────────────────────────

variable "enable_mcp" {
  description = "Grant MCP IAM (mcp.toolUser for calling 1P managed MCP servers; agentregistry.editor for registering custom MCP servers) and enable the Agent Registry API."
  type        = bool
  default     = true
}

# ── Agent identity (agent_identity.tf) — Preview ─────────────────────────────

variable "enable_agent_identity" {
  description = "Grant the runtime role set + run.invoker to the Agent Runtime agent-identity principalSet (Preview). When false, only the attached runtime SA carries these roles."
  type        = bool
  default     = true
}

variable "agent_identity_org_id" {
  description = "Organization id for the agent-identity SPIFFE trust domain. Empty = orgless (project) trust domain."
  type        = string
  default     = ""
}
```

- [ ] **Step 2: Add the Agent Registry API, gated by `enable_mcp`**

In `installer/terraform/apis.tf`, change the `data_apis` local to also include the MCP/registry API. Replace:

```hcl
  data_apis = concat(
    var.enable_alloydb ? ["alloydb.googleapis.com", "servicenetworking.googleapis.com", "compute.googleapis.com"] : [],
    var.enable_bigtable ? ["bigtable.googleapis.com", "bigtableadmin.googleapis.com"] : [],
  )
  all_apis = distinct(concat(local.required_apis, local.iap_apis, local.data_apis))
```

with:

```hcl
  data_apis = concat(
    var.enable_alloydb ? ["alloydb.googleapis.com", "servicenetworking.googleapis.com", "compute.googleapis.com"] : [],
    var.enable_bigtable ? ["bigtable.googleapis.com", "bigtableadmin.googleapis.com"] : [],
  )
  mcp_apis = var.enable_mcp ? ["agentregistry.googleapis.com"] : []
  all_apis = distinct(concat(local.required_apis, local.iap_apis, local.data_apis, local.mcp_apis))
```

- [ ] **Step 3: Create `mcp.tf`**

```hcl
# MCP tool plane IAM. The runner + runtime SAs call 1P managed MCP servers
# (roles/mcp.toolUser → mcp.tools.call) and register custom MCP servers in Agent
# Registry (roles/agentregistry.editor). Per-product data roles are granted by
# data_plane.tf. See docs/superpowers/specs/2026-06-01-mcp-tool-plane-design.md.

locals {
  mcp_sas = [google_service_account.runner.email, google_service_account.gateway.email]
}

resource "google_project_iam_member" "mcp_tool_user" {
  for_each = var.enable_mcp ? toset(local.mcp_sas) : []
  project  = var.project_id
  role     = "roles/mcp.toolUser"
  member   = "serviceAccount:${each.value}"
}

resource "google_project_iam_member" "agentregistry_editor" {
  for_each = var.enable_mcp ? toset(local.mcp_sas) : []
  project  = var.project_id
  role     = "roles/agentregistry.editor"
  member   = "serviceAccount:${each.value}"
}

output "mcp_enabled" {
  value = var.enable_mcp
}
```

- [ ] **Step 4: Create `agent_identity.tf`**

Grants the full runtime role set + `run.invoker` to the Agent Runtime agent-identity
`principalSet` (Preview) so deployed agents — not just the attached SA — can reach the stores,
1P MCP, and the per-department custom MCP services. `google_project_iam_member.member` accepts a
`principalSet://` string directly.

```hcl
# Agent Runtime agent-identity (Preview) IAM. Roles granted here mirror the runtime
# role set granted to the runtime SA in data_plane.tf/mcp.tf, but target the SPIFFE
# principalSet so every agent in the project carries them. SA remains the fallback
# when identity_type is unset at deploy. See
# docs/superpowers/specs/2026-06-01-mcp-tool-plane-design.md (Agent Identity).

locals {
  agent_identity_trust_domain = var.agent_identity_org_id != "" ? "agents.global.org-${var.agent_identity_org_id}.system.id.goog" : "agents.global.project-${var.project_number}.system.id.goog"
  agent_identity_principalset = "principalSet://${local.agent_identity_trust_domain}/attribute.platformContainer/aiplatform/projects/${var.project_number}"
  # Runtime role set the agents need at call time (read/write per-agent stores, 1P MCP, base).
  agent_identity_roles = var.enable_agent_identity ? toset([
    "roles/mcp.toolUser",
    "roles/bigquery.dataEditor",
    "roles/bigquery.jobUser",
    "roles/datastore.user",
    "roles/bigtable.user",
    "roles/alloydb.client",
    "roles/secretmanager.secretAccessor",
    "roles/aiplatform.expressUser",
    "roles/serviceusage.serviceUsageConsumer",
  ]) : []
}

resource "google_project_iam_member" "agent_identity" {
  for_each = local.agent_identity_roles
  project  = var.project_id
  role     = each.value
  member   = local.agent_identity_principalset
}

# Object access to the shared agent-data bucket (uniform BLA; non-legacy role).
resource "google_storage_bucket_iam_member" "agent_identity_data" {
  count  = var.enable_agent_identity && var.enable_gcs_data ? 1 : 0
  bucket = google_storage_bucket.data[0].name
  role   = "roles/storage.objectAdmin"
  member = local.agent_identity_principalset
}

output "agent_identity_principalset" {
  value = var.enable_agent_identity ? local.agent_identity_principalset : ""
}
```

- [ ] **Step 5: Verify HCL (terraform unavailable in sandbox)**

Run:
```bash
cd installer/terraform && for f in mcp.tf agent_identity.tf variables.tf apis.tf; do o=$(grep -o '{' "$f" | wc -l); c=$(grep -o '}' "$f" | wc -l); echo "$f { =$o } =$c"; done
grep -n 'google_service_account.runner\|google_service_account.gateway' mcp.tf
grep -n 'google_storage_bucket.data' agent_identity.tf
```
Expected: each file's `{` count equals its `}` count; both SA references print (they exist in `service_accounts.tf`); `google_storage_bucket.data` resolves (defined in `data_plane.tf`).

- [ ] **Step 6: Commit**

```bash
git add installer/terraform/mcp.tf installer/terraform/agent_identity.tf installer/terraform/variables.tf installer/terraform/apis.tf
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "feat(ge): MCP IAM (mcp.toolUser + agentregistry.editor) + agent-identity principalSet grants + Agent Registry API"
```

---

## Task 2: Generic multi-tenant FastMCP server

A single server image, deployed once per department. It resolves the agent from the
`agent` query param, loads `gs://<DATA_BUCKET>/agents/<id>/mcp-tools.json` (the toolspec the
generator already produces) plus store coordinates, and serves dynamic tools. With
`GE_DATA_BACKEND=fixtures` it serves from the bundled fixtures; with `mcp` (cloud) it queries the
per-agent stores. This task builds the server with the **fixtures** backend and an offline smoke
test; the store backend is added in Task 7's runtime work via the same store-access helpers (kept
minimal here — fixtures path first, TDD).

**Files:**
- Create: `apps/factory/mcp-service/server.py`
- Create: `apps/factory/mcp-service/pyproject.toml`
- Create: `apps/factory/mcp-service/Dockerfile`
- Create: `apps/factory/mcp-service/tests/test_server_smoke.py`
- Create: `apps/factory/mcp-service/tests/fixtures/agents/demo-agent/mcp-tools.json`

- [ ] **Step 1: Write the failing smoke test**

`apps/factory/mcp-service/tests/test_server_smoke.py`:

```python
import json, os
from pathlib import Path

os.environ["GE_DATA_BACKEND"] = "fixtures"
os.environ["GE_MCP_FIXTURE_ROOT"] = str(Path(__file__).parent / "fixtures")

from server import load_agent_manifest, build_tools  # noqa: E402


def test_loads_agent_manifest_and_builds_tools():
    manifest = load_agent_manifest("demo-agent")
    assert manifest["id"] == "demo_agent_mcp_tools"
    tools = build_tools("demo-agent")
    names = {t["name"] for t in tools}
    assert "list_systems" in names
    assert "query_invoices" in names


def test_unknown_agent_raises():
    try:
        load_agent_manifest("nope")
        assert False, "expected KeyError/FileNotFoundError"
    except (KeyError, FileNotFoundError):
        pass
```

`apps/factory/mcp-service/tests/fixtures/agents/demo-agent/mcp-tools.json`:

```json
{
  "id": "demo_agent_mcp_tools",
  "transport": "http",
  "tools": [
    { "name": "list_systems", "description": "List tables.", "inputSchema": { "type": "object", "properties": {} } },
    { "name": "query_invoices", "description": "Query invoices.", "inputSchema": { "type": "object", "properties": { "limit": { "type": "integer" } } } }
  ]
}
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd apps/factory/mcp-service && python -m pytest tests/test_server_smoke.py -q`
Expected: FAIL — `ModuleNotFoundError: No module named 'server'`.

- [ ] **Step 3: Implement `server.py`**

`apps/factory/mcp-service/server.py`:

```python
"""Generic multi-tenant MCP server for GE Agent Factory.

Deployed once per department as ge-agent-factory-mcp-<dept>. Each request carries
?agent=<id>; the server loads that agent's mcp-tools.json + store coordinates and
exposes tools. GE_DATA_BACKEND=fixtures serves bundled/GCS fixtures; =mcp queries
per-agent stores. This module keeps tool *definitions* generic; backend execution
is dispatched by GE_DATA_BACKEND.
"""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

BACKEND = os.environ.get("GE_DATA_BACKEND", "fixtures")
DATA_BUCKET = os.environ.get("GE_AGENT_DATA_BUCKET", "")
FIXTURE_ROOT = os.environ.get("GE_MCP_FIXTURE_ROOT", "/srv/fixtures")


def _read_fixture_manifest(agent_id: str) -> dict[str, Any]:
    path = Path(FIXTURE_ROOT) / "agents" / agent_id / "mcp-tools.json"
    if not path.exists():
        raise FileNotFoundError(f"no manifest for agent {agent_id} at {path}")
    return json.loads(path.read_text("utf-8"))


def _read_gcs_manifest(agent_id: str) -> dict[str, Any]:
    from google.cloud import storage  # imported lazily; absent in offline tests

    client = storage.Client()
    blob = client.bucket(DATA_BUCKET).blob(f"agents/{agent_id}/mcp-tools.json")
    if not blob.exists():
        raise KeyError(f"no manifest for agent {agent_id} in gs://{DATA_BUCKET}")
    return json.loads(blob.download_as_text())


def load_agent_manifest(agent_id: str) -> dict[str, Any]:
    """Load an agent's tool manifest from fixtures (offline/local) or GCS (cloud)."""
    if BACKEND == "fixtures":
        return _read_fixture_manifest(agent_id)
    return _read_gcs_manifest(agent_id)


def build_tools(agent_id: str) -> list[dict[str, Any]]:
    """Return the agent's tool descriptors (name/description/inputSchema)."""
    return load_agent_manifest(agent_id).get("tools", [])


def make_app():
    """Build the FastMCP ASGI app. Tools are registered per-agent at call time via
    a router that reads ?agent=<id>. Kept thin so the module imports without a
    network/credentials dependency (tests import load_agent_manifest/build_tools)."""
    from fastmcp import FastMCP

    mcp = FastMCP("ge-agent-factory-mcp")

    @mcp.tool()
    def list_agent_tools(agent: str) -> list[dict[str, Any]]:
        """List the tools available for a given agent id."""
        return build_tools(agent)

    @mcp.tool()
    def call_agent_tool(agent: str, tool: str, args: dict[str, Any] | None = None) -> dict[str, Any]:
        """Invoke an agent tool. fixtures backend echoes a deterministic record;
        the store backend (GE_DATA_BACKEND=mcp) queries the per-agent stores."""
        manifest = load_agent_manifest(agent)
        by_name = {t["name"]: t for t in manifest.get("tools", [])}
        if tool not in by_name:
            raise KeyError(f"tool {tool} not defined for agent {agent}")
        if BACKEND == "fixtures":
            return {"agent": agent, "tool": tool, "args": args or {}, "deterministic": True}
        from store_backend import execute_tool  # added in Task 7

        return execute_tool(agent, by_name[tool], args or {})

    return mcp


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8080"))
    make_app().run(transport="http", host="0.0.0.0", port=port)
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd apps/factory/mcp-service && python -m pytest tests/test_server_smoke.py -q`
Expected: PASS (2 passed). `fastmcp` is not imported by the test (only `load_agent_manifest`/`build_tools`), so the test runs offline.

- [ ] **Step 5: Add `pyproject.toml` and `Dockerfile`**

`apps/factory/mcp-service/pyproject.toml`:

```toml
[project]
name = "ge-agent-factory-mcp"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
  "fastmcp>=2.0.0",
  "google-cloud-storage>=2.18.0",
  "google-cloud-bigquery>=3.25.0",
  "google-cloud-firestore>=2.18.0",
  "google-cloud-bigtable>=2.26.0",
]

[project.optional-dependencies]
dev = ["pytest>=8.0.0"]
```

`apps/factory/mcp-service/Dockerfile`:

```dockerfile
FROM python:3.11-slim
WORKDIR /srv
COPY pyproject.toml ./
RUN pip install --no-cache-dir . && rm -rf /root/.cache
COPY server.py store_backend.py* ./
ENV GE_DATA_BACKEND=mcp PORT=8080
EXPOSE 8080
CMD ["python", "server.py"]
```

(The `store_backend.py*` glob tolerates its absence until Task 7 adds it.)

- [ ] **Step 6: Verify py compiles**

Run: `cd apps/factory/mcp-service && python -m py_compile server.py`
Expected: no output (exit 0).

- [ ] **Step 7: Commit**

```bash
git add apps/factory/mcp-service
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "feat(ge): generic multi-tenant FastMCP server (fixtures backend + smoke test)"
```

---

## Task 3: `factory-core` — `mcpDeploy` + `mcpDoctor` + config

**Files:**
- Modify: `tools/lib/factory-core.mjs`

- [ ] **Step 1: Add MCP config fields to `loadConfig`**

In `tools/lib/factory-core.mjs`, in the object returned by `loadConfig` (after the data-plane fields added previously), add:

```javascript
    // ── MCP tool plane ──
    mcpServices: file.mcpServices || {}, // { <dept>: <cloud run url> }
    // Agent Runtime agent-identity principalSet (Preview); falls back to orgless project form.
    agentIdentityPrincipalSet: env.GE_AGENT_IDENTITY_PRINCIPALSET || file.agentIdentityPrincipalSet ||
      ((flags.projectNumber || env.GOOGLE_CLOUD_PROJECT_NUMBER || file.projectNumber)
        ? `principalSet://agents.global.project-${flags.projectNumber || env.GOOGLE_CLOUD_PROJECT_NUMBER || file.projectNumber}.system.id.goog/attribute.platformContainer/aiplatform/projects/${flags.projectNumber || env.GOOGLE_CLOUD_PROJECT_NUMBER || file.projectNumber}`
        : ""),
```

- [ ] **Step 2: Add the department list constant**

Near the top of `tools/lib/factory-core.mjs` (after the existing `const` paths, before `loadConfig`), add:

```javascript
export const DEPARTMENTS = ["finance", "hr", "it", "marketing", "procurement"];
const MCP_SERVICE_DIR = join(REPO_ROOT, "apps/factory/mcp-service");
```

- [ ] **Step 3: Implement `mcpDeploy` and `mcpDoctor`**

Add after `dataDoctor` (near the end of the data-plane section):

```javascript
// ── MCP tool plane ──────────────────────────────────────────────────────────
// `ge mcp deploy`: deploy the generic FastMCP server once per department (fleet
// level — like the shared builder image), recording URLs in .ge.json.
export function mcpDeploy(cfg, { depts = DEPARTMENTS, memory = "1Gi", cpu = "1", log = noop } = {}) {
  ensureGcloud();
  if (!cfg.project) throw new Error("No project. Run `ge init`.");
  const services = { ...(cfg.mcpServices || {}) };
  for (const dept of depts) {
    const svc = `ge-agent-factory-mcp-${dept}`;
    log(`deploying ${svc}`);
    gcloud(["run", "deploy", svc, "--source", MCP_SERVICE_DIR, "--project", cfg.project, "--region", cfg.region,
      "--no-allow-unauthenticated", "--memory", memory, "--cpu", cpu,
      "--service-account", cfg.serviceAccount,
      "--update-env-vars", `GE_DATA_BACKEND=mcp,GE_AGENT_DATA_BUCKET=${cfg.dataBucket || ""}`], { capture: false });
    // The runtime caller is the Agent Runtime agent identity (or the runtime SA fallback).
    // Grant run.invoker on the private service to both principals.
    if (cfg.agentIdentityPrincipalSet) {
      gcloud(["run", "services", "add-iam-policy-binding", svc, "--project", cfg.project, "--region", cfg.region,
        "--member", cfg.agentIdentityPrincipalSet, "--role", "roles/run.invoker"], { allowFail: true });
    }
    if (cfg.serviceAccount) {
      gcloud(["run", "services", "add-iam-policy-binding", svc, "--project", cfg.project, "--region", cfg.region,
        "--member", `serviceAccount:${cfg.serviceAccount}`, "--role", "roles/run.invoker"], { allowFail: true });
    }
    const url = svcUrl(describeRun(cfg, svc));
    if (url) services[dept] = url;
  }
  const existing = readJson(CONFIG_PATH, {});
  writeJson(CONFIG_PATH, { ...existing, mcpServices: services });
  log("wrote mcpServices to .ge.json");
  return { services };
}

// `ge mcp doctor`: department services Ready + APIs/IAM present.
export function mcpDoctor(cfg) {
  ensureGcloud();
  if (!cfg.project) throw new Error("No project. Run `ge init`.");
  const checks = [];
  const add = (name, status, detail, fix) => checks.push({ name, status, detail, fix: fix || null });

  for (const dept of DEPARTMENTS) {
    const svc = `ge-agent-factory-mcp-${dept}`;
    const d = describeRun(cfg, svc);
    if (!d) { add(`mcp ${dept}`, "warn", `${svc} not deployed`, "ge mcp deploy"); continue; }
    const ready = (d.status?.conditions || []).find((x) => x.type === "Ready");
    add(`mcp ${dept}`, ready?.status === "True" ? "pass" : "fail", `${svc}: ${ready?.status || "?"}`, `ge logs --service ${svc}`);
  }

  const reg = gcloud(["services", "list", "--enabled", "--project", cfg.project, "--filter=config.name=agentregistry.googleapis.com", "--format=value(config.name)"], { allowFail: true });
  add("agent registry API", reg.ok && reg.out ? "pass" : "warn", reg.out || "agentregistry.googleapis.com not enabled", "ge data up  (or enable_mcp=true)");

  const cli = gcloud(["alpha", "agent-registry", "services", "list", "--project", cfg.project, "--location", cfg.region, "--format=value(name)"], { allowFail: true });
  add("agent-registry CLI", cli.ok ? "pass" : "warn", cli.ok ? "available" : "gcloud alpha agent-registry unavailable", "gcloud components install alpha");

  return { project: cfg.project, region: cfg.region, checks, fails: checks.filter((c) => c.status === "fail").length };
}
```

- [ ] **Step 4: Verify**

Run: `node --check tools/lib/factory-core.mjs && echo OK`
Expected: `OK`.

- [ ] **Step 5: Commit**

```bash
git add tools/lib/factory-core.mjs
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "feat(ge): factory-core mcpDeploy/mcpDoctor + mcpServices config"
```

---

## Task 4: CLI surfaces — `ge mcp` + MCP server tools

**Files:**
- Modify: `tools/ge.mjs`
- Modify: `tools/mcp-server.mjs`

- [ ] **Step 1: Add the `mcp` command to `tools/ge.mjs`**

After the `data` command definition (before `runMain`), add:

```javascript
const mcp = defineCommand({
  meta: { name: "mcp", description: "Deploy + check the per-department custom MCP services (deploy|doctor)" },
  args: { ...common, sub: { type: "positional", required: true, description: "deploy|doctor" } },
  run({ args }) {
    if (args.sub === "deploy") {
      const res = core.mcpDeploy(cfgFrom(args), { log: (m) => process.stderr.write(pc.bold(m) + "\n") });
      emit(args, res, (r) => {
        out(pc.green("\n✓ MCP services deployed:"));
        for (const [dept, url] of Object.entries(r.services)) out(`  ${dept.padEnd(12)} ${pc.green(url)}`);
      });
      return;
    }
    if (args.sub === "doctor") {
      const res = core.mcpDoctor(cfgFrom(args));
      emit(args, res, (r) => {
        out(pc.bold(`\nMCP doctor — ${r.project} (${r.region})\n`));
        for (const ch of r.checks) {
          out(`${ICON[ch.status]} ${ch.name.padEnd(22)} ${pc.dim(ch.detail)}`);
          if (ch.status !== "pass" && ch.fix) out(`    ${pc.dim("fix:")} ${ch.fix}`);
        }
        out(r.fails === 0 ? pc.green("\nAll hard checks passed.") : pc.red(`\n${r.fails} hard failure(s).`));
      });
      return;
    }
    throw new Error(`unknown mcp subcommand '${args.sub}' (expected deploy|doctor)`);
  },
});
```

Then add `mcp` to the `subCommands` object:

```javascript
  subCommands: { up, cutover, infra, build, init, doctor, deploy, provision, status, logs, sync, data, mcp },
```

- [ ] **Step 2: Verify the CLI**

Run: `node --check tools/ge.mjs && bun tools/ge.mjs mcp --help 2>&1 | head -5`
Expected: help text for `ge mcp` with the `deploy|doctor` argument.

- [ ] **Step 3: Add MCP tools to `tools/mcp-server.mjs`**

Find where the existing tools (e.g. `factory_doctor`) are registered and add two siblings, mirroring their shape:

```javascript
server.tool("factory_mcp_deploy", "Deploy the per-department custom MCP services to Cloud Run", {}, async () => {
  const res = core.mcpDeploy(core.loadConfig({}), { log: () => {} });
  return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
});

server.tool("factory_mcp_doctor", "Check the per-department MCP services + Agent Registry readiness", {}, async () => {
  const res = core.mcpDoctor(core.loadConfig({}));
  return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
});
```

Match the exact registration API already used in the file (e.g. `server.tool(name, desc, schema, handler)` vs an object form) — copy the nearest existing call's signature.

- [ ] **Step 4: Verify**

Run: `node --check tools/mcp-server.mjs && echo OK`
Expected: `OK`.

- [ ] **Step 5: Commit**

```bash
git add tools/ge.mjs tools/mcp-server.mjs
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "feat(ge): ge mcp deploy|doctor command + MCP server tools"
```

---

## Task 5: Generated `app/tools.py` — `GE_DATA_BACKEND` switch

The agent already wires `tools=source_adapters` (`factory.mjs:1142`); `source_adapters` is defined in
`app/tools.py`. Make `source_adapters` resolve at import time based on `GE_DATA_BACKEND`: `fixtures`
(today's FunctionTool list) or `mcp` (an `MCPToolset` over the dept custom MCP + 1P MCP endpoints).

**Files:**
- Modify: `apps/factory/scripts/factory.mjs` (the `app/tools.py` writer near line 930 and the `source_adapters = [...]` assembly near line 1039)
- Test: `apps/factory/tests/tools-backend.test.js` (new)

- [ ] **Step 1: Write a failing JS test for the rendered tools.py**

`apps/factory/tests/tools-backend.test.js`:

```javascript
import { test, expect } from "bun:test";
import { renderToolsModule } from "../scripts/factory.mjs";

test("tools.py renders a GE_DATA_BACKEND switch with MCPToolset for the mcp backend", () => {
  const src = renderToolsModule({
    fixtureToolsBlock: "source_adapters_fixtures = [FunctionTool(func=list_systems)]",
    agentId: "demo-agent",
    department: "finance",
    onePartyScopes: { bigquery: "https://www.googleapis.com/auth/bigquery" },
  });
  expect(src).toContain('os.environ.get("GE_DATA_BACKEND"');
  expect(src).toContain("MCPToolset");
  expect(src).toContain("StreamableHTTPConnectionParams");
  expect(src).toContain("x-goog-user-project");
  expect(src).toContain("agent=demo-agent");
  expect(src).toContain("source_adapters_fixtures");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd apps/factory && bun test tests/tools-backend.test.js`
Expected: FAIL — `renderToolsModule` is not exported.

- [ ] **Step 3: Extract + implement `renderToolsModule`**

In `factory.mjs`, add and **export** a pure function that produces the backend-switch tail of
`tools.py`. Place it near `renderAgentInstruction`:

```javascript
export function renderToolsModule({ fixtureToolsBlock, agentId, department, onePartyScopes = {} }) {
  const scopeLines = Object.entries(onePartyScopes)
    .map(([svc, scope]) => `    ("${svc}.googleapis.com", "${scope}"),`)
    .join("\n");
  return [
    fixtureToolsBlock,
    ``,
    `# ── runtime tool backend ─────────────────────────────────────────────────`,
    `# GE_DATA_BACKEND=fixtures (default, local/offline) → in-process FunctionTools.`,
    `# GE_DATA_BACKEND=mcp (cloud) → custom per-dept MCP + 1P managed MCP endpoints.`,
    `import os as _os`,
    `_BACKEND = _os.environ.get("GE_DATA_BACKEND", "fixtures")`,
    `_PROJECT = _os.environ.get("GOOGLE_CLOUD_PROJECT", "")`,
    ``,
    `def _mcp_toolsets():`,
    `    import google.auth`,
    `    import google.auth.transport.requests`,
    `    from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset`,
    `    from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPConnectionParams`,
    `    creds, _ = google.auth.default()`,
    `    creds.refresh(google.auth.transport.requests.Request())`,
    `    headers = {"Authorization": f"Bearer {creds.token}", "x-goog-user-project": _PROJECT}`,
    `    dept_url = _os.environ.get("GE_MCP_DEPT_URL", "")  # set in deploy env`,
    `    toolsets = []`,
    `    if dept_url:`,
    `        toolsets.append(MCPToolset(connection_params=StreamableHTTPConnectionParams(`,
    `            url=f"{dept_url}/mcp?agent=${agentId}", headers=headers)))`,
    `    for _svc, _scope in [`,
    scopeLines,
    `    ]:`,
    `        toolsets.append(MCPToolset(connection_params=StreamableHTTPConnectionParams(`,
    `            url=f"https://{_svc}/mcp", headers=headers)))`,
    `    return toolsets`,
    ``,
    `if _BACKEND == "mcp":`,
    `    source_adapters = _mcp_toolsets()`,
    `else:`,
    `    source_adapters = source_adapters_fixtures`,
    ``,
  ].join("\n");
}
```

Then, in the `app/tools.py` writer: rename the existing `source_adapters = [FunctionTool(...)]`
line (near `factory.mjs:1039`) to `source_adapters_fixtures = [FunctionTool(...)]`, and append
`renderToolsModule({ fixtureToolsBlock: "", agentId, department, onePartyScopes })` output to the
module (passing `fixtureToolsBlock: ""` because the fixtures list is written inline just above).
Resolve `agentId` from `qualityPlan.naming.agentName`/workspace id and `department` from the use
case; build `onePartyScopes` from the agent's datastores via a small map added in Step 4.

- [ ] **Step 4: Add the 1P scope map**

Near the top of `factory.mjs` (with other consts), add:

```javascript
// 1P managed MCP OAuth scopes per store (used by the mcp runtime backend).
export const ONE_PARTY_MCP_SCOPES = {
  bigquery: "https://www.googleapis.com/auth/bigquery",
  firestore: "https://www.googleapis.com/auth/datastore",
  bigtable: "https://www.googleapis.com/auth/bigtable.data",
  alloydb: "https://www.googleapis.com/auth/cloud-platform",
  gcs: "https://www.googleapis.com/auth/devstorage.read_write",
};
```

Map each store in `bigquery.googleapis.com`-style host: `bigquery→bigquery`, `firestore→firestore`,
`bigtable→bigtable`, `alloydb→alloydb`, `gcs→storage`. Build `onePartyScopes` for the agent as
`{ "<host>": ONE_PARTY_MCP_SCOPES[store] }` over the agent's datastores.

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd apps/factory && bun test tests/tools-backend.test.js`
Expected: PASS.

- [ ] **Step 6: Enable Agent Runtime agent identity at deploy**

Agent identity (Preview) is enabled by a workspace config file the deploy path reads. In the
workspace writer in `factory.mjs` (where other top-level workspace files like `pyproject.toml` are
written), write `.agent_engine_config.json`:

```javascript
await writeJson(join(dir, ".agent_engine_config.json"), { identity_type: "AGENT_IDENTITY" });
```

This makes `agents-cli deploy` / `adk deploy` provision the per-agent SPIFFE identity; ADC then
returns the agent-identity token to `app/tools.py` `_mcp_toolsets()` at runtime. If absent, the
agent falls back to the attached runtime SA — same code path. (Add the file to the agents-repo sync
allowlist if sync prunes dotfiles.)

- [ ] **Step 7: Verify generation still works end-to-end (offline)**

Run:
```bash
cd apps/factory
node scripts/factory.mjs from-usecase --usecase account-reconciliation-agent --dir /tmp/mcp-check 2>&1 | tail -5
python -m py_compile /tmp/mcp-check/app/tools.py && echo TOOLS_OK
test -f /tmp/mcp-check/.agent_engine_config.json && echo IDENTITY_OK
```
Expected: workspace builds; `TOOLS_OK` (the rendered tools.py compiles; `MCPToolset` imports are
inside `_mcp_toolsets()` so compilation does not require ADK present); `IDENTITY_OK`.

- [ ] **Step 8: Commit**

```bash
git add apps/factory/scripts/factory.mjs apps/factory/tests/tools-backend.test.js
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "feat(ge): agent tools.py GE_DATA_BACKEND switch + .agent_engine_config.json (agent identity)"
```

---

## Task 6: Pivot `register --as mcp` to the per-department service

Today `cmdRegister --as mcp` (`factory.mjs:2773`) requires a per-agent `deployStep.serviceUrl`.
Change it to register the agent against its **department** service URL with `?agent=<id>`, taking
the URL from a `--service-url` flag (passed by the worker from `.ge.json` `mcpServices`).

**Files:**
- Modify: `apps/factory/scripts/factory.mjs` (`cmdRegister`, near line 2773)
- Modify: `apps/factory/src/factory-worker.js` (`register_tools` command, line 128)

- [ ] **Step 1: Accept a department service URL in `cmdRegister`**

In the `if (mode === "mcp")` block, replace the per-agent serviceUrl resolution:

```javascript
    let serviceUrl = deployStep.serviceUrl;
    if (!serviceUrl) fail("No serviceUrl from deploy. Deploy with --target cloud_run first.");
```

with department-service resolution that appends the agent query param:

```javascript
    const agentId = flags["agent-id"] || snakeCase(pipeline.name || "mock-agent").replace(/_/g, "-");
    let serviceUrl = flags["service-url"] || deployStep.serviceUrl;
    if (!serviceUrl) fail("No --service-url (department MCP) and no deploy serviceUrl. Run `ge mcp deploy` and pass --service-url.");
    // Department services are multi-tenant: scope to this agent.
    const u = new URL(serviceUrl.endsWith("/mcp") ? serviceUrl : `${serviceUrl.replace(/\/$/, "")}/mcp`);
    u.searchParams.set("agent", agentId);
    serviceUrl = u.toString();
```

Also change the default protocol from `sse` to `jsonrpc` (streamable HTTP MCP), and drop the
`/sse` suffix logic — replace:

```javascript
    const protocolInput = flags.protocol || "sse";
    const protocolBinding = normalizeAgentRegistryProtocol(protocolInput);
    
    if (protocolInput === "sse") {
      if (!serviceUrl.endsWith("/sse")) {
        serviceUrl = serviceUrl.endsWith("/") ? `${serviceUrl}sse` : `${serviceUrl}/sse`;
      }
    }
```

with:

```javascript
    const protocolInput = flags.protocol || "jsonrpc";
    const protocolBinding = normalizeAgentRegistryProtocol(protocolInput);
```

- [ ] **Step 2: Pass the dept URL + agent id from the worker**

In `apps/factory/src/factory-worker.js`, the `register_tools` stage (line 128) currently
registers `--as adk`. Change it to register the custom MCP against the department service. Replace
the `register_tools` entry with:

```javascript
    register_tools: [
      ["node", ["scripts/factory.mjs", "register", "--dir", workspaceDir, "--project", project, "--region", payload.cloud?.geminiEnterpriseLocation || "global", "--as", "adk"]],
      ...(payload.cloud?.mcpServiceUrl
        ? [["node", ["scripts/factory.mjs", "register", "--dir", workspaceDir, "--project", project, "--region", payload.cloud?.geminiEnterpriseLocation || "global", "--as", "mcp", "--service-url", payload.cloud.mcpServiceUrl, "--agent-id", payload.workspaceId]]]
        : []),
    ],
```

(`payload.cloud.mcpServiceUrl` is the department URL the gateway resolves from `.ge.json`
`mcpServices[<dept>]`; when absent — e.g. MCP not deployed — the agent registers ADK-only, no
custom MCP. This keeps the stage backward compatible.)

- [ ] **Step 3: Verify**

Run: `node --check apps/factory/scripts/factory.mjs && node --check apps/factory/src/factory-worker.js && echo OK`
Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add apps/factory/scripts/factory.mjs apps/factory/src/factory-worker.js
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "feat(ge): register agents against per-department MCP service (?agent=<id>, jsonrpc)"
```

---

## Task 7: Domain-facade store backend (the "Workday/Ariba effect")

This is what makes the multi-tenant FastMCP server *front a 1P store to simulate a real enterprise
system*. Each tool in `mcp-tools.json` carries a **binding** describing the store operation it
maps to; the server dispatches by `op` across the per-agent 1P stores (BigQuery/Firestore/Bigtable/
AlloyDB/GCS) and wraps every result in a **source-system envelope** (`source_system: "Workday"`,
`evidence_type`, `audit_trail`). The domain tool surface + the seeded store + the envelope = the
effect of Workday/Ariba/SAP. 1P MCP gives raw store access; this facade gives domain semantics over
the *same* 1P store, and the two compose at runtime (Task 5).

**Tool binding shape** (added to each tool in `mcp-tools.json` by the generator — see Step 5):

```json
{
  "name": "get_worker",
  "description": "Workday HCM: fetch a worker record.",
  "inputSchema": { "type": "object", "properties": { "worker_id": { "type": "string" } } },
  "binding": { "op": "read", "store": "alloydb", "entity": "workers", "key": "worker_id",
               "sourceSystem": "Workday", "shape": "source_system_record" }
}
```

`op` ∈ `read` | `action` | `calculation` | `evidence` | `list`. `store` ∈ `bigquery` | `alloydb` |
`firestore` | `bigtable` | `gcs`. Read → query the bound store filtered by `key`; action/write →
append a record and return an approved/submitted audit envelope (the Ariba P2P effect);
calculation → aggregate; evidence → return a `source_system_record` envelope; list → enumerate
entities.

**Files:**
- Create: `apps/factory/mcp-service/store_backend.py`
- Create: `apps/factory/mcp-service/stores.py` (per-store client adapters)
- Test: `apps/factory/mcp-service/tests/test_store_backend.py`

- [ ] **Step 1: Write a failing test (pure planning + envelope, no GCP)**

`tests/test_store_backend.py`:

```python
from store_backend import plan_op, shape_envelope  # noqa: E402

WORKER_TOOL = {
    "name": "get_worker",
    "binding": {"op": "read", "store": "alloydb", "entity": "workers",
                "key": "worker_id", "sourceSystem": "Workday", "shape": "source_system_record"},
}
SUBMIT_TOOL = {
    "name": "submit_requisition",
    "binding": {"op": "action", "store": "bigquery", "entity": "requisitions",
                "key": "requisition_id", "sourceSystem": "Ariba", "shape": "source_system_record"},
}


def test_read_plans_a_keyed_lookup_against_the_bound_store():
    op = plan_op("acme-agent", WORKER_TOOL, {"worker_id": "W-42"})
    assert op["store"] == "alloydb"
    assert op["entity"] == "workers"
    assert op["namespace"] == "agent_acme_agent"   # per-agent object
    assert op["filters"] == {"worker_id": "W-42"}
    assert op["kind"] == "read"


def test_action_plans_an_append():
    op = plan_op("acme-agent", SUBMIT_TOOL, {"amount": 100})
    assert op["kind"] == "append"
    assert op["store"] == "bigquery"
    assert op["record"]["amount"] == 100


def test_envelope_carries_the_source_system_effect():
    env = shape_envelope(WORKER_TOOL["binding"], {"worker_id": "W-42", "name": "Ada"}, kind="read")
    assert env["source_system"] == "Workday"
    assert env["evidence_type"] == "source_system_record"
    assert "audit_trail" in env
    assert env["data"]["name"] == "Ada"


def test_unknown_tool_without_binding_raises():
    try:
        plan_op("a", {"name": "mystery"}, {})
        assert False
    except KeyError:
        pass
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd apps/factory/mcp-service && python -m pytest tests/test_store_backend.py -q`
Expected: FAIL — no module `store_backend`.

- [ ] **Step 3: Implement `store_backend.py` (pure planning + envelope + dispatch)**

```python
"""Domain-facade store backend for the GE Agent Factory MCP server.

Each tool carries a `binding` ({op, store, entity, key, sourceSystem, shape}).
plan_op() and shape_envelope() are pure (offline-testable); execute_tool() runs
the plan against the bound per-agent 1P store and wraps the result in a
source-system envelope — turning a plain store row into a Workday/Ariba-shaped
response. GE_DATA_BACKEND=mcp only.
"""
from __future__ import annotations

import re
from typing import Any

_READ_OPS = {"read", "list", "calculation", "evidence"}


def _namespace(agent_id: str) -> str:
    """Per-agent object namespace (BQ dataset / AlloyDB db / Firestore DB / BT table prefix)."""
    return "agent_" + re.sub(r"[^a-zA-Z0-9]", "_", agent_id)


def plan_op(agent_id: str, tool: dict[str, Any], args: dict[str, Any]) -> dict[str, Any]:
    binding = tool.get("binding")
    if not binding:
        raise KeyError(f"tool {tool.get('name')} has no binding")
    op = binding.get("op", "read")
    kind = "append" if op in ("action", "write") else "read"
    key = binding.get("key")
    filters = {key: args[key]} if key and key in args else {}
    return {
        "kind": kind,
        "op": op,
        "store": binding["store"],
        "entity": binding["entity"],
        "namespace": _namespace(agent_id),
        "filters": filters,
        "record": dict(args) if kind == "append" else {},
        "binding": binding,
    }


def shape_envelope(binding: dict[str, Any], data: Any, *, kind: str) -> dict[str, Any]:
    """Wrap a store result in the source-system envelope that creates the domain effect."""
    system = binding.get("sourceSystem", "source_system")
    action = "write" if kind == "append" else "read"
    return {
        "source_system": system,
        "evidence_type": binding.get("shape", "source_system_record"),
        # deterministic audit trail (no wall-clock in the pure layer; stamped by caller if needed)
        "audit_trail": f"{system}:{binding['entity']}:{action}:fixture_backed",
        "data": data,
    }


def execute_tool(agent_id: str, tool: dict[str, Any], args: dict[str, Any]) -> dict[str, Any]:
    import stores

    op = plan_op(agent_id, tool, args)
    if op["kind"] == "append":
        data = stores.append_record(op)
    else:
        data = stores.read_records(op)
    return shape_envelope(op["binding"], data, kind=op["kind"])
```

- [ ] **Step 4: Implement `stores.py` (per-store dispatch; GCP clients lazily imported)**

```python
"""Per-store client adapters for the MCP facade. Each function takes a plan from
store_backend.plan_op() and reads/appends against the bound per-agent 1P store.
GCP clients are imported inside the functions so store_backend stays offline-testable.
"""
from __future__ import annotations

import os
from typing import Any

_PROJECT = os.environ.get("GOOGLE_CLOUD_PROJECT")


def read_records(op: dict[str, Any]) -> list[dict[str, Any]]:
    store = op["store"]
    if store == "bigquery":
        from google.cloud import bigquery

        client = bigquery.Client(project=_PROJECT)
        where = " AND ".join(f"{k}=@{k}" for k in op["filters"]) or "TRUE"
        sql = f"SELECT * FROM `{op['namespace']}.{op['entity']}` WHERE {where} LIMIT 50"
        cfg = bigquery.QueryJobConfig(query_parameters=[
            bigquery.ScalarQueryParameter(k, "STRING", v) for k, v in op["filters"].items()
        ])
        return [dict(r) for r in client.query(sql, job_config=cfg).result()]
    if store == "firestore":
        from google.cloud import firestore

        db = firestore.Client(project=_PROJECT, database=op["namespace"].replace("_", "-"))
        col = db.collection(op["entity"])
        for k, v in op["filters"].items():
            col = col.where(k, "==", v)
        return [d.to_dict() for d in col.limit(50).stream()]
    if store == "bigtable":
        from google.cloud import bigtable

        table = bigtable.Client(project=_PROJECT, admin=False) \
            .instance("ge-agent-data").table(f"{op['namespace']}__{op['entity']}")
        rows = []
        for row in table.read_rows():
            rows.append({c: cell[0].value.decode() for c, cells in row.cells.get("d", {}).items() for cell in [cells]})
        return rows[:50]
    if store == "alloydb":
        return _alloydb_read(op)
    if store == "gcs":
        from google.cloud import storage

        client = storage.Client(project=_PROJECT)
        bucket = client.bucket(os.environ.get("GE_AGENT_DATA_BUCKET", ""))
        prefix = f"agents/{op['namespace'][len('agent_'):]}/{op['entity']}/"
        return [{"name": b.name} for b in client.list_blobs(bucket, prefix=prefix, max_results=50)]
    raise KeyError(f"unsupported store {store}")


def append_record(op: dict[str, Any]) -> dict[str, Any]:
    store = op["store"]
    if store == "bigquery":
        from google.cloud import bigquery

        client = bigquery.Client(project=_PROJECT)
        client.insert_rows_json(f"{op['namespace']}.{op['entity']}", [op["record"]])
        return op["record"]
    if store == "firestore":
        from google.cloud import firestore

        db = firestore.Client(project=_PROJECT, database=op["namespace"].replace("_", "-"))
        ref = db.collection(op["entity"]).document()
        ref.set(op["record"])
        return {"id": ref.id, **op["record"]}
    if store == "alloydb":
        return _alloydb_append(op)
    raise KeyError(f"append unsupported for store {store}")


def _dsn() -> str:
    """Resolve the AlloyDB DSN from Secret Manager (secret id from env)."""
    from google.cloud import secretmanager

    secret = os.environ.get("GE_AGENT_ALLOYDB_DSN_SECRET", "ge-agent-alloydb-dsn")
    name = f"projects/{_PROJECT}/secrets/{secret}/versions/latest"
    return secretmanager.SecretManagerServiceClient().access_secret_version(name=name).payload.data.decode()


def _alloydb_read(op: dict[str, Any]) -> list[dict[str, Any]]:
    import psycopg

    where = " AND ".join(f"{k}=%({k})s" for k in op["filters"]) or "TRUE"
    with psycopg.connect(_dsn(), dbname=op["namespace"]) as conn, conn.cursor(row_factory=psycopg.rows.dict_row) as cur:
        cur.execute(f"SELECT * FROM {op['entity']} WHERE {where} LIMIT 50", op["filters"])
        return cur.fetchall()


def _alloydb_append(op: dict[str, Any]) -> dict[str, Any]:
    import psycopg

    cols = ", ".join(op["record"].keys())
    vals = ", ".join(f"%({k})s" for k in op["record"])
    with psycopg.connect(_dsn(), dbname=op["namespace"]) as conn, conn.cursor() as cur:
        cur.execute(f"INSERT INTO {op['entity']} ({cols}) VALUES ({vals})", op["record"])
        conn.commit()
    return op["record"]
```

Add `psycopg[binary]>=3.2` and `google-cloud-secret-manager>=2.20` to the server's
`pyproject.toml` dependencies (Task 2 Step 5).

- [ ] **Step 5: Carry the binding into `mcp-tools.json` (generator — shared file)**

The binding originates from the data-plan: `source.target.datastore` (store) + the behavior
contract's `toolIntents` (op/entity/key/sourceSystem). In `apps/factory/scripts/plan-mock-data.mjs`,
extend `renderMcpTools(plan)` so each emitted tool includes a `binding` object built from its
source + intent. **This file is shared with the data-plane generator work (Tasks 9–11)** — if that
work is in flight, add the `binding` field there rather than conflicting. Minimum mapping:

```javascript
// inside renderMcpTools, per tool:
binding: {
  op: intent?.kind === "action" ? "action"
    : intent?.kind === "calculation" ? "calculation"
    : intent?.kind === "evidence_lookup" ? "evidence"
    : tool.name.startsWith("query_") ? "read" : "list",
  store: source.target?.datastore || "bigquery",
  entity: snakeCase(intent?.entity || tableName || source.system),
  key: (intent?.requiredInputs || [])[0] || null,
  sourceSystem: source.system,
  shape: "source_system_record",
},
```

- [ ] **Step 6: Run to verify it passes**

Run: `cd apps/factory/mcp-service && python -m pytest tests/ -q && python -m py_compile stores.py`
Expected: PASS (server + store tests; `stores.py` compiles — GCP/psycopg imports are inside
functions, so no external deps needed to compile/test).

- [ ] **Step 7: Commit**

```bash
git add apps/factory/mcp-service/store_backend.py apps/factory/mcp-service/stores.py apps/factory/mcp-service/tests/test_store_backend.py apps/factory/mcp-service/pyproject.toml apps/factory/scripts/plan-mock-data.mjs
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "feat(ge): domain-facade store backend — binding-driven multi-store ops + source-system envelope (Workday/Ariba effect)"
```

---

## Task 8: Correct the source-integration planning layer

`source-integration.mjs` emits ADK usage strings using `ApiRegistry.get_toolset(...)` and
`AgentRegistry(...).get_mcp_toolset(...)` — neither is the documented path. Replace with the
`MCPToolset`/`StreamableHTTPConnectionParams` pattern and point the custom adapter at the dept
service.

**Files:**
- Modify: `apps/factory/scripts/factory/integration/source-integration.mjs`

- [ ] **Step 1: Replace the first-party ADK usage string**

In `firstPartyUsage` (the `firstParty.map(...)` block), replace the `adkUsage` line:

```javascript
      adkUsage: `from google.adk.tools import ApiRegistry\n${safePyName(service.id)}_tools = ApiRegistry.get_toolset("${service.api}")`,
```

with:

```javascript
      adkUsage: [
        "from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset",
        "from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPConnectionParams",
        `${safePyName(service.id)}_tools = MCPToolset(connection_params=StreamableHTTPConnectionParams(`,
        `    url="https://${service.api}/mcp", headers={"x-goog-user-project": "${project}"}))`,
      ].join("\n"),
```

- [ ] **Step 2: Replace the custom-MCP ADK usage string**

In `customMcpAdapter.adkUsage`, replace the `AgentRegistry`/`get_mcp_toolset` block with:

```javascript
          adkUsage: [
            "from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset",
            "from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPConnectionParams",
            "# Department MCP service URL comes from .ge.json mcpServices[<dept>]",
            `tools = MCPToolset(connection_params=StreamableHTTPConnectionParams(`,
            `    url="<DEPT_MCP_URL>/mcp?agent=<AGENT_ID>"))`,
          ].join("\n"),
```

- [ ] **Step 3: Update the policy note**

In `plan.policy.adkCapabilityOrder`, replace `"ApiRegistry first-party MCP"` with
`"first-party MCP via MCPToolset over googleapis.com/mcp"` and
`"AgentRegistry registered MCP server"` with `"registered per-department MCP via MCPToolset"`.

- [ ] **Step 4: Verify**

Run: `node --check apps/factory/scripts/factory/integration/source-integration.mjs && echo OK`
Expected: `OK`.

- [ ] **Step 5: Commit**

```bash
git add apps/factory/scripts/factory/integration/source-integration.mjs
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "fix(ge): source-integration emits MCPToolset usage (not ApiRegistry/AgentRegistry)"
```

---

## Task 9: Docs — OPERATIONS + MCP runbook

**Files:**
- Modify: `docs/OPERATIONS.md`
- Modify: `docs/MCP.md`

- [ ] **Step 1: Document the tool plane in `docs/MCP.md`**

Add a section "MCP tool plane (generated agents)" covering: the two tiers; `ge mcp deploy` (fleet,
5 dept services) + `ge mcp doctor`; the `register_tools` stage registering each agent at its dept
URL `?agent=<id>`; the `GE_DATA_BACKEND` runtime switch; **agent identity** (SPIFFE principalSet,
`.agent_engine_config.json` to enable, IAM to the principalSet, SA fallback, Preview); auth
(`mcp.toolUser` + per-product roles, `x-goog-user-project`); the 10 KB toolspec + region
constraints. Include the exact commands:

```bash
ge data up            # stores + mcp IAM (enable_mcp)
ge mcp deploy         # 5 per-department Cloud Run MCP services
ge mcp doctor         # readiness
# per-agent register happens in the register_tools stage
```

- [ ] **Step 2: Add a Tool-plane subsection to `docs/OPERATIONS.md`**

Under the data-plane runbook, add the `ge mcp deploy`/`doctor` lifecycle and where it sits relative
to `ge data up` and `ge provision`.

- [ ] **Step 3: Commit**

```bash
git add docs/OPERATIONS.md docs/MCP.md
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "docs(ge): MCP tool-plane runbook (ge mcp deploy/doctor, two tiers, auth)"
```

---

## Task 10: End-to-end offline verification

**Files:** none (verification only)

- [ ] **Step 1: Full JS syntax sweep**

Run:
```bash
node --check tools/lib/factory-core.mjs && node --check tools/ge.mjs && node --check tools/mcp-server.mjs \
  && node --check apps/factory/scripts/factory.mjs \
  && node --check apps/factory/src/factory-worker.js \
  && node --check apps/factory/scripts/factory/integration/source-integration.mjs \
  && echo ALL_JS_OK
```
Expected: `ALL_JS_OK`.

- [ ] **Step 2: Run the new unit + python tests**

Run:
```bash
cd apps/factory && bun test tests/tools-backend.test.js
cd mcp-service && python -m pytest tests/ -q
```
Expected: all pass.

- [ ] **Step 3: Generate one agent and confirm both backends are syntactically valid**

Run:
```bash
cd apps/factory
node scripts/factory.mjs from-usecase --usecase account-reconciliation-agent --dir /tmp/mcp-e2e 2>&1 | tail -3
python -m py_compile /tmp/mcp-e2e/app/tools.py && echo TOOLS_OK
ls /tmp/mcp-e2e/mock_data/apis/mcp-tools.json && echo MANIFEST_OK
```
Expected: `TOOLS_OK`, `MANIFEST_OK`.

- [ ] **Step 4: CLI help smoke**

Run: `bun tools/ge.mjs mcp --help 2>&1 | head -3 && bun tools/ge.mjs mcp doctor --json 2>&1 | head -1`
Expected: help renders; `mcp doctor --json` prints either a JSON object or a clean "No project" error (no stack trace).

- [ ] **Step 5: Final commit (if any verification fixups were needed)**

```bash
git add -A
git -c user.email=vamramak@google.com -c user.name="Vamsi Ramakrishnan" commit -m "test(ge): MCP tool-plane offline verification fixups" || echo "nothing to commit"
```

---

## Coordination notes

- **`mcp-tools.json` upload to GCS** (`gs://<bucket>/agents/<id>/mcp-tools.json`) happens in the
  `load_data` stage's generated load script (`plan-mock-data.mjs` / `load-to-google-cloud.sh`) —
  that file is **generator territory shared with the parallel agent** (data-plane Tasks 9–11). The
  MCP server already reads it from GCS (Task 2). When implementing Task 9–11, add the
  `gcloud storage cp mock_data/apis/mcp-tools.json gs://<bucket>/agents/<id>/` line. Until then the
  server falls back to its bundled fixtures.
- **Agent identity (Preview)** — three moving parts, all in this plan: (1) **enable** via
  `.agent_engine_config.json` written at generation (Task 5 Step 6); (2) **IAM** granted to the
  SPIFFE `principalSet` (Task 1 `agent_identity.tf`) + `run.invoker` on the dept services
  (Task 3 `mcpDeploy`); (3) **runtime** uses `google.auth.default()` which ADC resolves to the
  agent-identity token (Task 5 `tools.py`) — no identity-specific code. If the project hasn't
  enabled the Preview, omit the config file and the attached runtime SA carries the same roles
  (granted in `data_plane.tf`/`mcp.tf`) — identical code path. Org-scoped deployments should set
  `agent_identity_org_id` (Terraform) / `GE_AGENT_IDENTITY_PRINCIPALSET` (CLI) to the org trust
  domain instead of the orgless project form.

## Verification summary

1. `node --check` all touched JS → `ALL_JS_OK`.
2. `bun test tests/tools-backend.test.js` → pass.
3. `python -m pytest apps/factory/mcp-service/tests/ -q` → pass.
4. HCL brace/ref checks on `mcp.tf` → balanced, SAs referenced.
5. `bun tools/ge.mjs mcp --help` / `... mcp doctor --json` → valid.
6. One generated agent: `app/tools.py` compiles; `mcp-tools.json` present.

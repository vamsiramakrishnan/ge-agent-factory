# GE Agent Factory — MCP server

`tools/mcp-server.mjs` exposes the factory operations as typed [MCP] tools over
stdio, backed by the same `tools/lib/factory-core.mjs` the `ge` CLI uses. This is
the surface for **models and harnesses**: they call typed tools and get JSON
back, instead of shelling out to the CLI and parsing stdout.

## Registration

`.mcp.json` (repo root) registers it for MCP-aware clients:

```json
{ "mcpServers": { "ge-agent-factory": { "command": "bun", "args": ["tools/mcp-server.mjs"] } } }
```

Run standalone: `bun tools/mcp-server.mjs` (speaks MCP over stdio).

## Tools

| Tool | Args | Notes |
|---|---|---|
| `factory_list_usecases` | `department?`, `search?`, `limit?` | Browse the 363-use-case catalog. Read-only, offline. |
| `factory_doctor` | — | Preflight (APIs/IAM/IAP/memory/health) with fixes. Read-only. |
| `factory_status` | `noProxy?` | Stage tally + per-run status for submitted runs. Read-only. |
| `factory_logs` | `runId`, `stage?`, `item?` | A stage's result JSON (errors, exit codes, build log URL). Read-only. |
| `factory_provision` | `scope: canary\|all`, `dept?`, `ids?`, `concurrency?`, `force?`, `noProxy?` | **Mutates** — submits agents through the factory. |
| `factory_sync` | `force?`, `push?`, `commit?` | **Mutates** — pulls generated workspaces into `generated-agents/`, commits. |

Every tool returns the core's structured result as JSON text. Errors come back
as `isError` content rather than crashing the server.

## Config

The server reads the same config as `ge` (`.ge.json` / env / terraform outputs).
Set `GEMINI_ENTERPRISE_APP_ID` and run `ge init` first so the server has a
project, bucket, and service identities to work with.

## Design

One engine, two surfaces: see [../tools/README.md](../tools/README.md). Read-only
tools (`list_usecases`, `doctor`, `status`, `logs`) are safe to call freely;
`provision` and `sync` mutate and should be gated by the calling harness.

`factory_mcp_deploy` / `factory_mcp_doctor` operate the **tool plane** below.

---

## MCP tool plane (generated agents)

Distinct from the factory's own MCP server above: this is how the **363 generated
agents** get real tools. Two tiers, switched at runtime by `GE_DATA_BACKEND`
(`fixtures` locally, `mcp` in the cloud). Design:
`docs/superpowers/specs/2026-06-01-mcp-tool-plane-design.md`.

**Tier 1 — 1P managed MCP** (store access). Every per-agent store has a Google
managed MCP endpoint (`bigquery.googleapis.com/mcp`, `firestore…`, `bigtable…`,
`alloydb…`, `storage…`). `app/tools.py` builds an `MCPToolset` per endpoint the
agent uses, with the right OAuth scope. No custom code; auto-registered when the
product API is enabled.

**Tier 2 — custom per-department MCP** (domain facades). A generic multi-tenant
FastMCP server (`apps/ge-demo-generator/mcp-service/`) is deployed once per
department (`ge-agent-factory-mcp-<dept>`). It resolves `?agent=<id>`, loads that
agent's `mock_data/apis/mcp-tools.json`, and maps each tool's `binding`
(`{op, store, entity, key, sourceSystem}`) to an op over the agent's per-agent 1P
store, wrapping results in a source-system envelope — this is what makes the data
behave like Workday/Ariba/SAP. Each agent gets one Agent Registry entry pointing
at its department URL, with a ≤10 KB `toolspec.json`.

**Lifecycle:**

```bash
ge data up            # stores + MCP IAM (enable_mcp) + agent-identity principalSet grants
ge mcp deploy         # 5 per-department Cloud Run MCP services (fleet-level, run once)
ge mcp doctor         # services Ready + Agent Registry API/CLI
# per-agent registration happens in the register_tools stage (against the dept URL)
```

**Auth — agent identity (Preview).** Generated agents run under the Agent Runtime
per-agent SPIFFE identity, enabled by `.agent_engine_config.json`
(`{"identity_type":"AGENT_IDENTITY"}`) written into each workspace. IAM is granted
to the **principalSet** (`agent_identity.tf`), not a SA email:
`mcp.toolUser` + per-product data roles + `run.invoker` on the dept services. ADC
(`google.auth.default()`) returns the agent-identity token at runtime; tokens are
CAA/mTLS-bound (in-runtime only). If the Preview is off, the attached runtime SA
carries the same roles — identical code path. Calls send
`Authorization: Bearer …` + `x-goog-user-project: <project>`.

**Constraints:** `toolspec.json` ≤ 10 KB; manual Agent Registry registration is
blocked in `us`/`eu` multi-region (use a region or `global`); legacy-bucket roles
cannot be granted to agent identities (we use uniform BLA + `objectAdmin`).

### Tool authorization (agent identity → tools)

Resolving a toolset and *invoking* it are separate grants. The full chain, by role:

| Step | Role | Granted to | Where |
|---|---|---|---|
| Resolve toolset from Agent Registry (`get_mcp_toolset`) | `roles/agentregistry.viewer` | agent-identity principalSet + runtime SA | `agent_identity.tf` / `mcp.tf` |
| **Call the registered MCP server (agent→MCP egress)** | **`roles/iap.egressor`** | agent-identity principalSet | bound **on the mcpServer** at `register_tools` via `gcloud beta iap web add-iam-policy-binding --mcpServer=…` (optional read-only condition: `request.auth.type=='MCP' && mcp.tool.isReadOnly`) |
| IAP / direct → Cloud Run backend | `roles/run.invoker` | agent principalSet + runtime SA (and the IAP service agent when IAP-fronted) | `ge mcp deploy` |
| Custom MCP server → per-agent stores | `bigquery.dataEditor`/`datastore.user`/… | the MCP service's runtime SA | `data_plane.tf` |
| 1P managed MCP (direct) | `roles/mcp.toolUser` + per-product data role | agent-identity principalSet | `agent_identity.tf` |

The agent identity is the SPIFFE principalSet
`principalSet://agents.global.org-<ORG_ID>.system.id.goog/attribute.platformContainer/aiplatform/projects/<PROJECT_NUMBER>`.
Set `GE_AGENT_IDENTITY_ORG_ID=<ORG_ID>` before `ge up` to grant it automatically;
otherwise Agent Identity grants are skipped and the attached runtime SA remains the
fallback. `ge mcp doctor` verifies the resolve + invoke roles; the per-mcpServer
`iap.egressor` grant is logged at `register_tools`. Refs:
`gemini-enterprise-agent-platform/scale/runtime/agent-identity#grant-access-agent`,
`…/govern/policies/assign-identity-iam#agent-to-mcp-server`.

[MCP]: https://modelcontextprotocol.io

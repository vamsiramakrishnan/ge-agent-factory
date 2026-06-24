# MCP Tool Plane Design

**Date:** 2026-06-01
**Status:** Active design, partially implemented
**Related:** `docs/superpowers/specs/2026-06-01-per-agent-data-plane-design.md`

## Purpose

The factory generates ADK agents for 363 enterprise use cases. Those agents need
tool access that is realistic enough for quality evaluation and deployment, but
still deterministic and safe for local generation. The MCP tool plane defines how
generated agents move from fixture-backed Python tools to registered MCP tools
over real Google Cloud resources and mock third-party systems.

The core rule is:

1. Use first-party Google MCP where it exists.
2. Use a custom Cloud Run MCP adapter for third-party/domain systems.
3. Keep local fixture tools as the default development and validation backend.

## Current Implementation

The current pipeline already creates a planning contract:

- `ge-mock plan-data` writes data packages under `mock_data/`.
- `ge-mock source-integration-plan` writes:
  - `mock_data/plan/source-integration-plan.json`
  - `artifacts/tool-registry-plan.json`
- `apps/ge-demo-generator/scripts/ge-mock/integration/source-integration.mjs`
  maps source systems to:
  - backing datastores
  - required Google Cloud APIs
  - first-party MCP candidates
  - custom MCP fallback
  - Agent Registry/tool registry commands
- `ge-mock register --as mcp` registers a deployed Cloud Run MCP endpoint in
  Agent Registry.

The implementation now follows the Agent Registry MCP registration constraints:

- First-party Google MCP servers are auto-registered when the supported Google
  Cloud API is enabled.
- Custom MCP servers are registered manually through Agent Registry.
- Manual MCP registration uses a Cloud Run endpoint plus a `toolspec.json`.
- `toolspec.json` is capped at 10 KB and the generator compacts it before
  failing.
- Protocol bindings are normalized to `JSONRPC`, `HTTP_JSON`, or `GRPC`.
- Manual MCP registration is blocked for `us` and `eu` multi-region locations.

## End-to-End Architecture

```text
catalog use case
  -> deterministic generator
  -> scenario/domain packs
  -> fixture data + ADK tools + evals
  -> data package plan
  -> source integration plan
  -> harness review/refine
  -> local validation
  -> cloud data load
  -> runtime deploy
  -> MCP/A2A/ADK registration
  -> Gemini Enterprise publish
```

The tool plane starts at `source-integration-plan` and becomes executable during
cloud deployment.

## Two Modes

The tool plane must support both local mode and remote mode. The same generated
workspace should be able to run in either mode by changing configuration, not by
generating a different agent from scratch.

### Local Mode: Fixture-Backed Tools

Local mode keeps MCP optional. The generated agent uses in-process Python tools
over fixtures, while the MCP adapter can be run locally only when debugging the
adapter contract.

```text
local workspace
┌─────────────────────────────────────────────────────────────┐
│ app/agent.py                                                │
│   -> app/tools.py                                           │
│      -> fixture-backed source adapters                      │
│         -> fixtures/*.json                                  │
│         -> fixtures/documents/*                             │
│                                                             │
│ optional adapter dev:                                       │
│   local MCP client -> mock_data/apis/mcp-adapter -> fixtures│
└─────────────────────────────────────────────────────────────┘
```

Use local mode for deterministic generation, smoke tests, evals, and harness
review/refine. It must not require Agent Registry, Cloud Run, OAuth, or live
Google Cloud data stores.

### Remote Mode: Registered MCP Tools

Remote mode turns the planning artifacts into registered tools. The generated
agent runs in Agent Runtime and uses first-party MCP where available, plus custom
Cloud Run MCP adapters for third-party/domain systems.

```text
remote runtime
┌──────────────────────────────────────────────────────────────────────────┐
│ Agent Runtime / generated ADK agent                                      │
│                                                                          │
│  first-party branch:                                                     │
│    -> Google MCP endpoint                                                │
│       -> Google service/store                                            │
│       -> auto-discovered by Agent Registry when API is enabled           │
│                                                                          │
│  custom branch:                                                          │
│    -> Agent Registry MCP server record                                   │
│       -> private Cloud Run MCP adapter                                   │
│          -> per-agent BigQuery/GCS/AlloyDB/Firestore/Bigtable objects    │
└──────────────────────────────────────────────────────────────────────────┘
```

Use remote mode for deployed demos, live verification, and Gemini Enterprise
publish.

### Tool-Plane Architecture Options

```text
Option 1: fixture-only
  agent -> Python tools -> local fixtures
  Lowest cost, best for generation and local validation.

Option 2: local MCP adapter
  MCP client -> local adapter -> local fixtures
  Best for developing the custom adapter contract without Cloud Run.

Option 3: first-party Google MCP
  Agent Runtime -> Google MCP -> Google API/store
  Best when a Google-managed MCP surface exists.

Option 4: custom Cloud Run MCP
  Agent Runtime -> Agent Registry -> Cloud Run adapter -> mock store
  Best for third-party systems and domain facades.

Option 5: hybrid
  Agent Runtime -> first-party MCP + custom MCP + selected direct tools
  Best for realistic enterprise agents with mixed Google and non-Google systems.
```

## Tool Tiers

### Tier 0: Local Fixture Tools

Generated `app/tools.py` exposes deterministic Python function tools over local
fixtures. This remains the default for:

- local development
- smoke tests
- evals
- harness review/refine
- CI without Google Cloud credentials

This path is intentionally boring. It is the quality baseline.

### Tier 1: First-Party Google MCP

For Google systems and Google Cloud stores, the pipeline should prefer
first-party MCP. The current planner recognizes a first pass of managed services:

- BigQuery
- Spanner
- Maps
- YouTube
- Drive
- Calendar
- Gmail

The generated plan emits `gcloud services enable <api>` commands. Enabling a
supported Google API is the registration mechanism for first-party MCP; no custom
Agent Registry service should be created for that case.

Runtime ADK wiring should use MCP endpoint/toolset access for the enabled
first-party service. The exact code path must match the pinned ADK version in the
generated project. The planning artifact records intent; code generation should
not invent a wrapper around BigQuery/Drive/Gmail when first-party MCP is
available.

### Tier 2: Custom Cloud Run MCP Adapters

Third-party and domain systems need a custom facade. Examples:

- Workday
- ServiceNow
- SAP
- Coupa
- Ariba
- LMS/ATS systems
- Slack, where official remote MCP is not selected for the mock path
- domain-specific document/citation facades over GCS

The custom adapter pattern is:

```text
Cloud Run MCP service
  -> reads/writes per-agent mock data stores
  -> exposes domain-shaped tools
  -> has /sse or equivalent MCP endpoint
  -> is registered in Agent Registry with a compact tool spec
```

The existing `plan-mock-data.mjs` already creates:

- `mock_data/apis/source-adapters.json`
- `mock_data/apis/openapi.json`
- `mock_data/apis/mcp-tools.json`
- `mock_data/apis/fixtures/`
- `mock_data/apis/mcp-adapter/`
- `mock_data/apis/deploy-adapter.sh`

The next implementation step is to promote this scaffold into a production-grade
Cloud Run MCP adapter template and to load it from the per-agent data plane.

## Registration Model

### First-Party MCP

First-party services are registered implicitly:

```bash
gcloud services enable bigquery.googleapis.com --project "$PROJECT"
```

The agent/tool plan records the service and expected runtime use. It should not
call `gcloud alpha agent-registry services create` for first-party Google MCP.

### Custom MCP

Custom MCP registration is explicit:

```bash
gcloud alpha agent-registry services create "$SERVER_NAME" \
  --project="$PROJECT" \
  --location="$LOCATION" \
  --display-name="$DISPLAY_NAME" \
  --mcp-server-spec-type=tool-spec \
  --mcp-server-spec-content=mock_systems/toolspec.json \
  --interfaces=url="$SERVICE_URL/sse",protocolBinding=JSONRPC
```

Operational constraints:

- `toolspec.json` must be at most 10 KB.
- `LOCATION` must not be `us` or `eu`.
- The registration identity needs Agent Registry edit permissions.
- The runtime identity needs permission to invoke private Cloud Run adapters.

## Pipeline Contract

Every generated agent should carry these artifacts once data planning has run:

| Artifact | Purpose |
|---|---|
| `mock_data/plan/data-plan.json` | source systems, datastore classes, entities |
| `mock_data/package-index.yaml` | generated datastore packages |
| `mock_data/apis/source-adapters.json` | domain/API facade contract |
| `mock_data/apis/mcp-tools.json` | MCP tool manifest |
| `mock_data/plan/source-integration-plan.json` | source-to-cloud/MCP/registry map |
| `artifacts/tool-registry-plan.json` | compact registry execution plan |

Validation enforces the source integration artifacts after real source data
planning begins.

## Runtime Wiring Target

Generated agents should eventually branch by backend:

- `GE_DATA_BACKEND=fixtures`: current local Python tools.
- `GE_DATA_BACKEND=mcp`: first-party MCP plus registered custom MCP adapters.
- `GE_AGENT_ID=<workspace_id>`: namespace for per-agent data objects.

The planner is already backend-aware. The remaining implementation is to make
`app/agent.py` and `app/tools.py` consume that plan instead of only local
fixtures.

## Agent Identity (runtime auth)

Reference: `https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/agent-identity` (Preview).

Generated agents authenticate to both MCP tiers using **Agent Runtime agent identity** —
a per-agent SPIFFE principal (certificate-bound, CAA/mTLS-enforced, un-replayable), *not* a
service-account email. Key consequences for this design:

- **Enable at deploy:** write `.agent_engine_config.json` (`{"identity_type": "AGENT_IDENTITY"}`)
  into each workspace, or deploy with `agents-cli deploy --agent-identity`. If unset, the agent
  falls back to the attached runtime service account (`ge-agent-factory-runtime`).
- **Token at runtime:** ADC (`google.auth.default()`) transparently returns the agent-identity
  token in the runtime environment — so the `app/tools.py` MCP wiring needs no identity-specific
  code. The token only works inside the runtime (CAA); do not export it.
- **IAM targets the principal, not a SA.** Roles must be granted to the agent-identity
  `principalSet` so every agent in the project has them. Orgless (project) form:

  ```text
  principalSet://agents.global.project-<PROJECT_NUMBER>.system.id.goog/attribute.platformContainer/aiplatform/projects/<PROJECT_NUMBER>
  ```

  (org form: `agents.global.org-<ORG_ID>.system.id.goog`). The runtime role set
  (`mcp.toolUser`, `bigquery.dataEditor`/`jobUser`, `datastore.user`, `bigtable.user`,
  `alloydb.client`, `secretmanager.secretAccessor`, `storage.objectAdmin` on the data bucket,
  plus base `aiplatform.expressUser`, `serviceusage.serviceUsageConsumer`) is granted to this
  principalSet **in addition to** the SA fallback. `run.invoker` on each per-department MCP
  service is likewise granted to the principalSet.
- **`agentregistry.editor`** stays on the runner SA (it runs `register_mcp` at build time, not the
  agent at runtime).
- **Limitations:** Preview; legacy-bucket roles cannot be granted to agent identities (we use
  uniform bucket-level access + `objectAdmin`, so unaffected).

## Open Implementation Work

1. Replace the current Node MCP adapter scaffold with the selected production
   adapter template, or formalize the current Node implementation if retained.
2. Generate runtime ADK MCP wiring from `source-integration-plan.json`.
3. Add a fleet/dept-level adapter deploy command so custom MCP services are not
   deployed per agent unless isolation requires it.
4. Make `register_tools` consume `artifacts/tool-registry-plan.json` directly.
5. Add integration tests for:
   - first-party-only agent
   - custom-only agent
   - mixed first-party plus custom agent
   - `toolspec.json` compaction
   - unsupported registry locations

## Non-Goals

- Real customer credentials for third-party systems.
- Auth redesign for end-user OAuth. That remains a dedicated auth workstream.
- Replacing local deterministic fixtures. They remain the default validation
  path.

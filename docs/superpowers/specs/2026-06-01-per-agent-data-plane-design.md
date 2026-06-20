# Per-Agent Data Plane Design

**Date:** 2026-06-01
**Status:** Active design, partially implemented
**Related:** `docs/superpowers/specs/2026-06-01-mcp-tool-plane-design.md`

## Purpose

Generated agents currently run well on deterministic local fixtures. That is the
right baseline for generation, tests, evals, and harness review. The data plane
defines how those same agents get real, isolated Google Cloud data objects for
runtime demos and deployed validation.

The target is not one database per agent. The target is shared project-level
infrastructure with per-agent objects inside each store.

## Two Modes

The data plane has two modes. They are intentionally different, but they are
driven from the same generated workspace and the same data contracts.

### Local Mode: Fixture Data Plane

Local mode treats `fixtures/` as the data plane. No cloud stores are required.
This is the default for generation, validation, evals, and harness refinement.

```text
local workspace
┌─────────────────────────────────────────────────────────────┐
│ ge-mock generate                                            │
│   -> fixtures/*.json                                        │
│   -> fixtures/documents/*                                   │
│   -> fixtures/manifest.json                                 │
│                                                             │
│ generated runtime                                           │
│   app/agent.py                                              │
│     -> app/tools.py                                         │
│        -> fixture-backed query/action tools                 │
│                                                             │
│ quality gates                                               │
│   tests/test_smoke.py + evalsets + harness review/refine    │
└─────────────────────────────────────────────────────────────┘
```

Local mode gives deterministic behavior and makes it possible to run the factory
without Google Cloud credentials.

### Remote Mode: Cloud Data Plane

Remote mode promotes the same logical data into Google Cloud. Shared
infrastructure is provisioned once, then each generated agent gets isolated
objects inside those stores.

```text
Google Cloud project
┌─────────────────────────────────────────────────────────────────────────┐
│ shared services                                                         │
│   BigQuery | GCS | AlloyDB | Firestore | Bigtable | Secret Manager      │
│                                                                         │
│ per-agent objects                                                       │
│   agent_<id> dataset        gs://bucket/agents/<id>/...                 │
│   agent_<id> AlloyDB DB     Firestore namespace/database                │
│   Bigtable table/row prefix                                             │
│                                                                         │
│ load_data                                                               │
│   -> describe-or-create object                                          │
│   -> load generated rows/documents                                      │
│   -> write load evidence artifacts                                      │
│                                                                         │
│ runtime                                                                 │
│   Agent Runtime -> direct store clients or MCP tools                    │
└─────────────────────────────────────────────────────────────────────────┘
```

Remote mode is used for deployed demos, live verification, and Gemini Enterprise
publish.

### Data-Plane Architecture Options

```text
Option 1: local fixture-only
  app/tools.py -> fixtures
  Best for tests, evals, and deterministic coding-agent review.

Option 2: packaged cloud plan
  fixtures -> mock_data/plan + mock_data/cloud
  Best for inspecting what would be loaded before provisioning.

Option 3: direct cloud store backend
  app/tools.py -> BigQuery/AlloyDB/Firestore/Bigtable/GCS clients
  Best for store-native reads when MCP is unnecessary.

Option 4: MCP-backed cloud data
  app/agent.py -> first-party/custom MCP -> per-agent cloud objects
  Best when tools should be discoverable and registered.

Option 5: hybrid runtime
  local fixtures for CI + cloud stores/MCP in deployed runtime
  Best for keeping quality gates cheap while making demos realistic.
```

## Current Implementation

The generator already produces data-plane intent:

- `ge-mock generate` writes local fixture rows and documents.
- `ge-mock plan-data` writes `mock_data/plan/data-plan.json`,
  `mock_data/plan/data-plan.yaml`, Snowfakery recipes, API adapter contracts, and
  package indexes.
- `ge-mock data-plan` writes BigQuery/GCS load artifacts under
  `mock_data/cloud/`.
- `ge-mock source-integration-plan` writes the source-to-cloud/MCP/registry plan.
- `src/factory.js` records data artifacts during the `data_packaged` stage.

The current implementation is a planning and packaging layer. It does not yet
fully provision every shared store or load every per-agent object type during a
cloud factory run.

## Data Plane Layers

```text
Layer 1: Shared project services
  BigQuery, GCS, AlloyDB, Firestore, Bigtable, Secret Manager, IAM

Layer 2: Per-agent objects
  dataset/database/table/prefix/collection namespace for one generated agent

Layer 3: Runtime access
  fixture tools locally, live store reads or MCP tools in deployed runtime
```

## Store Mapping

The planner maps source data by class:

| Source shape | Target |
|---|---|
| OLTP operational records | AlloyDB |
| document/event-shaped operational data | Firestore |
| high-volume keyed/time-series events | Bigtable |
| analytics facts, metrics, snapshots | BigQuery |
| documents/blobs/citations | Cloud Storage, optionally indexed later |
| external APIs/actions | Cloud Run source adapter, with backing store where needed |

This mapping is encoded today across:

- `scripts/plan-mock-data.mjs`
- `scripts/ge-mock/integration/source-integration.mjs`
- `src/factory.js`

## Layer 1: Shared Services

Shared services are project/environment infrastructure. They should be created
once and reused by many generated agents:

- BigQuery project/location and IAM
- Cloud Storage data bucket
- AlloyDB cluster and primary instance
- Firestore database/location
- Bigtable instance/table baseline
- Secret Manager entries for connection material
- service accounts and IAM bindings for runner/runtime identities

The CLI target is:

```bash
bun tools/ge.mjs data up
bun tools/ge.mjs data doctor
```

This layer should write durable outputs into `.ge.json` or Terraform outputs so
factory workers can pass the right substitutions to `load_data`.

## Layer 2: Per-Agent Objects

Each generated workspace gets isolated objects:

| Store | Per-agent object |
|---|---|
| BigQuery | dataset such as `agent_<workspace_id>` |
| Cloud Storage | prefix such as `agents/<workspace_id>/...` |
| AlloyDB | database/schema such as `agent_<workspace_id>` |
| Firestore | database or collection namespace such as `agent-<workspace_id>` |
| Bigtable | table or row-key namespace such as `<workspace_id>#...` |

The load stage must be idempotent:

1. describe existing object
2. create if missing
3. load or upsert generated records
4. write load evidence to artifacts

Current state:

- BigQuery/GCS packaging exists in `ge-mock data-plan`.
- Snowfakery recipe generation exists.
- Per-store package planning exists in `plan-mock-data.mjs`.
- Full cloud load execution across all stores is still a build-out item.

## Layer 3: Runtime Access

The runtime agent needs a backend switch:

| Backend | Purpose |
|---|---|
| `fixtures` | local default, tests, evals, harness review |
| `cloud` or store-specific | direct store clients from generated tools |
| `mcp` | first-party MCP and registered custom MCP adapters |

The local fixture path must remain first-class. It makes generation cheap,
repeatable, and testable without Google Cloud credentials.

The deployed path should read the per-agent object namespace through:

- direct store clients for generated Python tools where appropriate
- first-party Google MCP for supported Google systems/stores
- custom Cloud Run MCP adapters for domain and third-party facades

## Factory Stage Integration

The end-to-end factory stage sequence should treat the data plane as a concrete
contract:

```text
created
  -> validated
  -> harness_reviewed
  -> harness_refined
  -> data_packaged
  -> previewed
  -> deploy_planned
  -> deployed
  -> registered
  -> published
```

Within `data_packaged`, the factory now records:

- `mock_data/plan/data-plan.json`
- `mock_data/package-index.yaml`
- `mock_data/snowfakery/structured.recipe.yml`
- `mock_data/cloud/cloud-data-manifest.json`
- `artifacts/cloud-topology.json`
- `mock_data/plan/source-integration-plan.json`
- `artifacts/tool-registry-plan.json`

The durable cloud factory should add explicit stages:

- `provision_data_plane`: ensure Layer 1 exists
- `load_data`: create/load Layer 2 per-agent objects
- `register_tools`: use `artifacts/tool-registry-plan.json`

## Required Artifacts

After data packaging, a workspace should have:

```text
mock_data/
  plan/
    data-plan.json
    data-plan.yaml
    source-integration-plan.json
  snowfakery/
    structured.recipe.yml
  apis/
    source-adapters.json
    openapi.json
    mcp-tools.json
    fixtures/
    mcp-adapter/
  cloud/
    cloud-data-manifest.json
artifacts/
  cloud-topology.json
  tool-registry-plan.json
```

Validation now checks source integration artifacts once real source data planning
has started.

## IAM and Identity

Detailed auth is intentionally out of scope for this pass, but the data-plane
design assumes two identities:

- runner identity: can provision/load data and register tools
- runtime/agent identity: can read/write only the data and tools required by the
  deployed agent

Minimum role categories:

- BigQuery data/job roles for datasets
- Storage object roles for the data bucket/prefix
- AlloyDB client/connectivity
- Firestore datastore user
- Bigtable user
- Secret Manager accessor for connection material
- Cloud Run invoker for custom MCP adapters
- Agent Registry editor for registration stages
- MCP tool user for first-party MCP calls where required

Auth policy, user OAuth, and production tenant isolation should be specified in a
dedicated auth design.

## Open Implementation Work

1. Implement `ge data up` and `ge data doctor` over Terraform/shared services.
2. Convert per-store package plans into executable, idempotent `load_data`
   scripts/jobs.
3. Pass data-plane outputs into factory workers and deployed agent env.
4. Generate runtime backend selection in `app/tools.py` and `app/agent.py`.
5. Add cloud-load tests that inspect generated commands without requiring live
   Google Cloud credentials.
6. Run one authed end-to-end canary:
   - provision shared stores
   - generate one agent
   - load data
   - deploy runtime
   - register tools
   - verify live query

## Non-Goals

- Replacing deterministic local fixtures.
- Connecting to real third-party SaaS systems.
- Solving user OAuth/auth consent. That is a separate design.

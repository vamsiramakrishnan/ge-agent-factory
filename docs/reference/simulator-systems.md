---
title: Simulator systems
parent: Reference
nav_order: 6
layout: default
---

# Simulator systems

The simulator engine serves an agent's enterprise tools (Workday, DocuSign CLM,
SAP, …) as a stateful, MCP-shaped backend, without the real systems. Each system
is a **pack** (six JSON files) interpreted by a generic Python runtime — the
standalone `simulator-runtime` package
([`packages/simulator-runtime/README.md`](../../packages/simulator-runtime/README.md)),
consumed by the per-department MCP service. A lazy layered registry and an
overlay mount bring-your-own (BYO) systems at runtime.

<p align="center">
  <img src="../assets/diagrams/simulator-backend-flow.svg" alt="An agent reads local fixture files when GE_DATA_BACKEND=fixtures, or resolves an MCP toolset from the Agent Registry when GE_DATA_BACKEND=mcp, reaching the per-department FastMCP service, the generic engine with the agent's per-agent store, and a source-system envelope that looks like Workday, Ariba, or SAP" width="750">
</p>

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## The pack contract (six files)

A pack lives at
`apps/factory/simulator-systems/<system_id>/` and has exactly six files.
Example: `docusign_clm/`.

| File | What it holds |
|---|---|
| `schema.json` | Collections (entities): primary keys, fields with semantic types, and cross-collection `ref:` references |
| `tools.json` | The MCP tool catalog, each tool with an explicit `binding` to a generic handler op |
| `workflows.json` | State machines, approval gates, role permission, failure injection, audit/async semantics per tool |
| `seed.json` | Deterministic initial rows per collection (loaded on first access) |
| `projection.json` | Maps the synthetic data graph + Snowfakery rows → simulator collections (merge strategy) |
| `materialization.json` | Field aliases (incoming → canonical) and default values for seed hydration |

**`schema.json`** (shape)

```json
{
  "id": "workday_schema", "version": 2,
  "collections": {
    "workers": {
      "primaryKey": "worker_id",
      "fields": {
        "worker_id": "string",
        "status": "enum:active|on_leave|terminated",
        "manager_id": "ref:workers.worker_id"
      }
    }
  }
}
```

**`tools.json`** — explicit bindings (`op`, `collection`, `primaryKey`):

```json
{
  "tools": [
    { "name": "search_workers", "binding": { "op": "search", "collection": "workers" } },
    { "name": "get_worker",     "binding": { "op": "get", "collection": "workers", "primaryKey": "worker_id" } },
    { "name": "submit_worker_change", "binding": { "op": "submit", "collection": "workers", "primaryKey": "worker_id" } }
  ]
}
```

**`workflows.json`** — a handler with a state machine + approval gate:

```json
{
  "toolHandlers": {
    "submit_worker_change": {
      "primitive": "business_process_state_machine",
      "collection": "workers", "stateField": "status",
      "allowedRoles": ["hr_partner", "manager"],
      "transitions": { "active": ["on_leave", "terminated"], "pre_hire": ["active"] }
    }
  }
}
```

`projection.json` maps graph kinds + realized objects to collections.
`seed.json` holds the starting rows. `materialization.json` maps `fieldAliases`
and `defaults`.

---

## The generic runtime

[`simulator_runtime/generic.py`](https://github.com/vamsiramakrishnan/ge-agent-factory)
builds handlers from the pack contract. Dispatch is **explicit-binding-first** (no
fragile name-prefix or pluralization guessing). The valid binding ops are:

```
search · get · create · submit · list_pending_approvals · list_audit_events · poll_async_job
```

Each op maps to a generic handler: `search_<collection>` (filter + pagination),
`get_<singular>` (lookup by PK + optional relations + an audit event),
`create_<singular>` (insert with validation, idempotency, latency/failure
injection), `submit_<singular>` (state-machine transition + approval blockers +
async job + webhook). The pack loader (`pack_loader.py`) accepts three pack
shapes — the legacy six-file layout, a canonical single `pack.json`, and an inline
(BYO/synthesized) contract — and normalizes all three to the same enriched
contract.

Supporting primitives live alongside `generic.py`: `audit.py`, `idempotency.py`,
`failures.py`, `throttle.py`, `async_jobs.py`, `webhooks.py`.

---

## Lazy layered registry + runtime overlay (BYO)

Contract resolution
([`registry.py`](https://github.com/vamsiramakrishnan/ge-agent-factory) +
[`overlay.py`](https://github.com/vamsiramakrishnan/ge-agent-factory)) checks the
**overlay first, then the built-in corpus**:

1. **Overlay** — `register_overlay_contract(contract)` mounts a synthesized/BYO
   pack so the engine serves it immediately. In-memory by default; set
   `GE_SIMULATOR_OVERLAY_BACKEND=firestore` (or `alloydb`) so every Cloud Run
   instance shares it durably. Ids are namespaced by `GE_SIMULATOR_OVERLAY_PREFIX`.
2. **Built-in corpus** — the registry parses `registry.json` once, lazily, and
   hydrates each system's contract on first use (cached thereafter).

```python
def get_simulator_contract(system_id):
    overlay = get_overlay_contract(system_id)   # checked first
    return overlay or _builtin_contract(system_id)
```

---

## State backends

State ([`state_store.py`](https://github.com/vamsiramakrishnan/ge-agent-factory))
is keyed per `agent:system:scenario` namespace. On first access the namespace is
hydrated from the pack's seed; mutations are written back through the store.

| Backend | Notes |
|---|---|
| `memory` (default) | in-process, volatile |
| `firestore` | durable, one state doc per namespace (needs `google-cloud-firestore`) |
| `alloydb` | durable JSONB key/value (needs `psycopg` + `GE_AGENT_ALLOYDB_DSN`) |

Selection: the per-system `stateBackend` contract field wins; the global
`GE_SIMULATOR_STATE_BACKEND` env var is the fallback override. An unknown backend
or missing dependency falls back to `memory`.

<p align="center">
  <img src="../assets/diagrams/state-backend-precedence.svg" alt="Backend resolution: a per-system stateBackend in registry.json wins, else the GE_SIMULATOR_STATE_BACKEND env var, else memory; a durable choice degrades to memory with a logged warning when its dependency or config is unavailable" width="600">
</p>

---

## Pack tooling

All three CLIs live under `apps/factory/scripts/`.

### Scaffold a pack

```bash
node apps/factory/scripts/scaffold-simulator-pack.mjs --id <system> --archetype <family> [--root .] [--force true]
node apps/factory/scripts/scaffold-simulator-pack.mjs --listArchetypes
```

Generates all six pack files from an archetype (e.g. `hr_talent`, `procurement`,
`clm`, `itsm`, …) and adds the registry entry. `--displayName` sets the
human-readable name.

### Validate a pack

```bash
node apps/factory/scripts/validate-simulator-pack.mjs [--system <id>] [--strict] [--check]
```

Validates binding resolution, workflow ↔ tool ↔ schema consistency, projection /
materialization collections, **FK closure** (every non-null `ref:` value in the
seed resolves), and scenario coverage. `--strict` promotes warnings to errors;
`--check` exits non-zero on errors (CI gate). Defaults to all systems.

### Generate seed data

```bash
bun tools/ge.mjs data synth --system <id> [--seed 42] [--profile realistic] [--out <path>] [--no-snowfakery] [--stdout]
node apps/factory/scripts/generate-simulator-data.mjs --pack <dir> [--seed 42]   # the same core, script form
```

Builds a deterministic recipe from the contract and produces `seed.json` — using
the **Snowfakery** tier when available, falling back to an offline **Faker** tier
(zero external deps); `--profile realistic` switches to the statistical realism
tier (skewed distributions, a shared persona pool, seeded edge cases). It applies
materialization (aliases + defaults), merges scenario-coverage rows, and validates
FK closure before writing. The recipe model, tiers, profile, and determinism
guarantees have their own page: [Synthetic data](synthetic-data.html).

---

## Determinism extras: virtual time, chaos profiles, record/replay

Three opt-in runtime capabilities, each off by default (no env var, no
contract field ⇒ byte-for-byte the behavior described above) and each fully
deterministic — every draw is a keyed BLAKE2b digest, never an unseeded RNG.
Contract-level fields win over the global env vars. Full semantics live in
[`packages/simulator-runtime/README.md`](../../packages/simulator-runtime/README.md);
this is the operator's map:

| Capability | Enable (env / contract) | What you get |
|---|---|---|
| **Virtual clock** | `GE_SIMULATOR_VIRTUAL_TIME=1` / `virtualTime: true` | Simulation time starts at `GE_SIMULATOR_EPOCH` (ISO-8601, default `2026-01-01T09:00:00Z`) and advances deterministically per call. Audit events gain a reproducible `ts`; latency injection *records* the sampled delay instead of wall-sleeping, so time-shaped simulations run at full speed in tests. |
| **Chaos profiles** | `GE_SIMULATOR_CHAOS_PROFILE=<name>` / `chaosProfile: "<name>"` | A named failure weather system layered over the pack's own `failureModes` (an independent draw — it never changes which contract-declared failures fire). Injected failures are audited with `detail="chaos:<profile>"`. |
| **Record/replay cassettes** | `GE_SIMULATOR_RECORD_DIR=<dir>` / `GE_SIMULATOR_REPLAY_DIR=<dir>` | Recording appends every router call to a human-readable `<agent>__<system>.jsonl` cassette; replay serves recorded envelopes (flagged `"replayed": true`) matched by a fingerprint of tool + canonicalized args (volatile client tokens excluded). A replay hit still drives the live handler so simulator state advances exactly as it did while recording; a miss falls through to live execution. Neither var set ⇒ zero file IO. |

The chaos profiles:

| Profile | Weather |
|---|---|
| `steady` | labelled baseline — injects nothing |
| `brownout` | 3× latency plus timeouts |
| `storm` | heavy rate limiting plus latency spikes |
| `flaky_dependency` | timeout/conflict bursts confined to deterministic call-index windows |
| `degraded_writes` | conflicts/validation errors on write tools; reads stay clean |

> These compose: a virtual-clock, `brownout`-profile run replayed from a
> cassette is byte-reproducible end to end — which is what makes degraded-mode
> agent behavior testable in CI rather than only observable in incidents.
{: .tip }

---

## Where it fits

The simulator plane is the **tool plane** for offline/preview runs. A generated
agent's `app/tools.py` calls these same tools as in-process `FunctionTool`s
(`GE_DATA_BACKEND=fixtures`), or against the deployed MCP services
(`GE_DATA_BACKEND=mcp`) — see [Agent generation](agent-generation.html). The
console's BYO flow (`POST /api/systems/synthesize`) synthesizes a pack and mounts
it via the overlay — see [Console & APIs](console-and-apis.html).

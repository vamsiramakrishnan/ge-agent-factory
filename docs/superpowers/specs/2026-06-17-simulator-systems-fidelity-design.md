# Simulator-systems fidelity — design

**Date:** 2026-06-17
**Status:** Approved, implementing
**Sub-project:** 3 of 3

## Goal

Lift realism across **all 54** simulated systems by enriching the **one shared engine**
(`apps/factory/mcp-service/simulator_runtime/generic.py`, which powers 52/54) rather than
hand-deepening a few. Higher leverage: every primitive added to the engine lands across every
system that uses it.

## Decisions (locked)

- **Engine-wide primitives first.** Depth-of-a-few (de-cloning ServiceNow/SAP/Coupa/Jira,
  importing the 7 cached OpenAPI specs) is **deferred to a phase 2**.
- Durable state via **AlloyDB/Firestore per ADR 0001** is **in scope** (`backingStores` already
  declared in the contracts; the project is mid control-plane migration).

## Current state

- Declarative, contract-driven: each system = 6 JSON files
  (`schema/tools/seed/projection/materialization/workflows`) consumed by one shared Python engine
  (`generic.py`, ~302 lines) behind a single multi-tenant FastMCP Cloud Run service
  (`server.py`, routes `?agent=<id>`).
- **Strong:** stateful per `agent:system:scenario`, role-permission gates, state-machine
  transitions, approval blockers, audit trails (driven by `workflows.json`).
- **Weak:** `6 domain_realistic / 48 starter` (registry `maturity`); 48 starters share ~10 cloned
  generic schemas; seed volumes tiny (most = 1 row/collection; richest = workday at 22); seed↔schema
  drift unvalidated; tools are a generic search/get/submit CRUD triad; **no auth/401-403, no
  webhooks/async, in-memory ephemeral state**; only 4 of the declared `failureModes` realized.

## Engine-level primitives (each lands across all 54)

Implemented in `generic.py` + small contract additions; opt-in per system via existing JSON.

1. **Durable store.** Wire the in-memory `STATE` to a pluggable backend: `memory` (default for
   tests), `firestore`, `alloydb`. Honour the already-declared `backingStores`. State survives
   across calls / instances. New module `simulator_runtime/state_store.py` with a `StateStore`
   protocol + three implementations; `generic.py` reads/writes through it.
2. **Webhooks.** A `webhook_emitter` primitive: `workflows.json` transitions can declare
   `emit: [{event, target}]`; the engine POSTs the event to a registered subscriber URL (with
   retry + signature). New `simulator_runtime/webhooks.py`.
3. **Async jobs.** An `async_job` primitive: submit → returns `{job_id, status:queued}`; a poll
   tool returns `running|succeeded|failed` with a result. Backed by the durable store.
4. **Real failure modes.** Realize the declared `failureModes` beyond today's four: add
   `rate_limited` (429), `validation_error` (422), `conflict` (409), `unauthorized` (401),
   `forbidden` (403), `timeout`. Driven by `failureModes` weights in the system contract.
5. **Latency + rate limits.** Configurable per-tool latency distribution and a token-bucket rate
   limiter keyed by `agent:system`.
6. **Idempotency.** Honour an `idempotency_key` on submit tools — replay returns the original
   result.
7. **Volume.** Generate realistic seed via the existing `projection.json` / `materialization.json`
   + **Snowfakery** pipeline (hierarchical orgs, multi-year history, thousands of rows) so search /
   pagination / aggregation become testable. Add pagination + filtering to the search tool.
8. **Seed↔schema conformance.** A validator that checks every system's `seed.json` against its
   `schema.json`; run across all 54 in CI to close the drift (e.g. `servicenow/seed.json`).

## Architecture

```
mcp-service/
  server.py                      FastMCP, ?agent=<id> routing  (unchanged surface)
  simulator_runtime/
    generic.py                   shared engine — reads new primitives from contracts
    state_store.py    (NEW)      StateStore protocol + memory/firestore/alloydb impls
    webhooks.py       (NEW)      webhook_emitter (retry + HMAC signature)
    async_jobs.py     (NEW)      job submit/poll backed by StateStore
    failures.py       (NEW)      failureMode selection + typed errors
    throttle.py       (NEW)      latency + token-bucket rate limiter
    idempotency.py    (NEW)      idempotency-key replay cache (via StateStore)
  tools/
    validate_seed_schema.py (NEW) conformance check across all 54 systems
    seed_volume.py    (NEW/extended) Snowfakery-driven realistic seed generation
```

Contract additions (backward-compatible; absent = current behaviour):
- `workflows.json`: optional `emit`, `async`, `idempotent`, `failureModes` weights per transition.
- per-system: optional `stateBackend` (defaults to `memory`).

## Error handling

- Durable store: graceful fallback to `memory` if the configured backend is unreachable (logged),
  so demo runs never hard-fail on infra.
- Webhooks: bounded retries with backoff; failures recorded in the audit trail, never block the
  primary call.
- Failure modes are deterministic per `(agent, system, scenario, seed)` so demos/evals are
  reproducible.

## Testing

- `simulator_runtime/test_state_store.py` — memory + (mocked) firestore/alloydb round-trip.
- `simulator_runtime/test_failures.py` — weighted selection determinism + typed errors.
- `simulator_runtime/test_webhooks.py`, `test_async_jobs.py`, `test_idempotency.py`,
  `test_throttle.py`.
- `tools/test_validate_seed_schema.py` — run across all 54; assert no drift after fixes.
- A representative-system integration test exercising every primitive end-to-end.

## Phased implementation

1. **StateStore** abstraction + memory impl + wire `generic.py` through it (no behaviour change).
2. **failures.py** + realize the declared failure modes.
3. **idempotency.py** + **throttle.py**.
4. **async_jobs.py** + **webhooks.py**.
5. **Firestore/AlloyDB** StateStore impls (per ADR 0001).
6. **Volume**: Snowfakery seed generation + search pagination/filtering.
7. **Conformance validator** + fix existing drift + CI wiring.

## Out of scope (phase 2)

- De-cloning starter systems (ServiceNow, SAP, Coupa, Jira) into bespoke object models.
- Importing the 7 cached downloadable OpenAPI specs to replace generic CRUD tools with
  endpoint-shaped tools.

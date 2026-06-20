# Simulator phase-2 depth — design

**Date:** 2026-06-17
**Status:** Approved, implementing
**Follows:** 2026-06-17-simulator-systems-fidelity-design.md (phase 1 — engine primitives, landed)

## Goal

Deepen *specific high-value systems* now that the shared engine is capable:
1. **De-clone** four enterprise starters into bespoke, workday-grade object models.
2. **Import OpenAPI/Discovery specs** into endpoint-shaped tools for the dev/infra systems.
3. **Wire durable state** (Firestore/AlloyDB) so it can be flipped on per system, with a runbook.

## Decisions (locked)

- **De-clone via rich JSON on the generic engine — NOT new bespoke Python handlers.** The phase-1
  engine already supports role gates, state machines, approval blockers, failure modes,
  idempotency, async, webhooks via the JSON contracts. Vendor realism comes from a real schema +
  vendor-shaped tools + relational seed + rich workflows. (workday/servicenow keep their existing
  Python handlers; new de-clones do not add to `simulators.py`.)
- **De-clone targets:** `servicenow`, `sap_s4hana_fi`, `coupa`, `jira` → `maturity: domain_realistic`.
- **OpenAPI import targets:** `okta` (Swagger 2.0), `github`, `kubernetes`, `pagerduty` (OpenAPI 3.x),
  `bigquery`, `apigee` (Google Discovery). `jira` is owned by its de-clone agent (which may consult
  the cached jira OpenAPI spec). Import a **curated high-value subset** of operations per system
  (~15–25), never all paths (github has 787).
- **Durable state:** activate the `stateBackend` contract field for selected systems; pass env
  through the Dockerfile; test against the Firestore emulator when present else mocks; ship a
  runbook. **No real cloud deploy** from here (irreversible; needs project creds).
- **All `registry.json` edits go through a single consolidation step** (shared-file hazard).

## Work tracks

### Track A — De-clone (one independent pack per system)
Each system edits ONLY its own `simulator-systems/<id>/{schema,tools,seed,projection,materialization,workflows}.json`
(disjoint — safe to parallelize) and reports a `registry.json` entry patch (does not edit registry).

Target per system (mirror `workday` as the gold standard):
- **schema.json:** 8–12 real collections with typed fields, enums, primaryKeys, and cross-collection refs.
- **tools.json:** vendor-shaped reads (search with domain filters, get with `includes`) + write
  `submit_*` tools (state field, role arg, idempotency_key) + `list_audit_events`.
- **seed.json:** realistic, referentially-consistent volume (~20–50 rows in key collections, with
  multi-step approval chains / lifecycle states). Must pass `validate_seed_schema`.
- **workflows.json:** `toolHandlers` with `transitions`, `approvalBlockers`, `allowedRoles`, and
  `failureModes` weights (use the phase-1 typed errors). Optionally `emit`/`async` where natural.

Domain shape per system:
- **servicenow:** ITIL — incident/problem/change_request/service_request with impact/urgency/priority,
  assignment_groups, CAB approval on change, escalation, CI relationships, knowledge.
- **sap_s4hana_fi:** vendors (risk tiers), invoices in 3-way-match states, payment_runs, GL accounts
  with open items, journal_entries with reversals, cost objects; 3WM + payment-run state machines.
- **coupa:** suppliers (scorecards), requisitions (cost-center routing), purchase_orders w/ line items,
  contracts (coverage/pricing), receipts; requisition→buyer→approver→PO workflow.
- **jira:** projects/epics/stories/subtasks, sprints (velocity), releases, board transitions
  (to_do→in_progress→review→done); reference the cached jira OpenAPI spec for field realism.

### Track B — OpenAPI → endpoint-shaped tools
- New `scripts/generate-tools-from-openapi.mjs`: parse OpenAPI 3.x, Swagger 2.0, and Google Discovery;
  select a curated operation subset (config per system); emit `tools.json` whose tool names/inputs are
  endpoint-shaped (e.g. `list_users`, `get_user`, `create_issue`) mapped onto generic-engine
  collections; align a minimal `schema.json` + `seed.json` so conformance passes.
- Apply to okta/github/kubernetes/pagerduty/bigquery/apigee. Report registry patches.
- Deterministic + idempotent; runnable via a new `generator:tools-from-openapi` script. Unit test the
  parser against a small fixture for each of the 3 formats.

### Track C — Durable state wiring + runbook
- Add `stateBackend` to the consolidated `registry.json` for the de-cloned systems (default stays
  `memory`; set to `firestore` behind an env guard so local/test stays memory).
- `mcp-service/Dockerfile`: pass through `GE_AGENT_ALLOYDB_DSN`, `GOOGLE_CLOUD_PROJECT`,
  `GE_SIMULATOR_STATE_BACKEND` (a global override) so Cloud Run env can select a backend.
- Integration test `mcp-service/simulator_runtime/test_state_store_integration.py`: round-trip against
  the **Firestore emulator** if `FIRESTORE_EMULATOR_HOST` is set, else skip (mark skipped, don't fail).
- Runbook `docs/runbooks/simulator-durable-state.md`: how to provision Firestore/AlloyDB, set env on
  the Cloud Run service (`ge infra apply` flow), flip `stateBackend`, and verify.

### Consolidation + verify (sequential, after all build tracks)
- One agent applies every reported `registry.json` patch (maturity, entities, workflows, roles,
  failureModes, evalScenarios, stateBackend) in a single coherent edit; confirms no `simulators.py`
  change is required for the de-clones.
- Run and make green: `python -m pytest apps/ge-demo-generator/mcp-service`,
  `node scripts/validate-simulator-pack.mjs`, `python tools/validate_seed_schema.py`, and the
  conformance suite. Update conformance SAMPLE_ARGS where tool names changed. Confirm
  `test_backward_compat.py` still passes (untouched systems behave identically).

## Risks / mitigations
- **registry.json race** → single consolidation step (above).
- **Conformance breakage** from renamed tools → each track keeps its system green locally; verify
  stage re-runs the whole suite and fixes SAMPLE_ARGS.
- **Huge OpenAPI specs** → curated subset + streaming/selective parse; never emit hundreds of tools.
- **No cloud creds here** → durable-state track is config + tests + runbook only; the actual deploy
  is a documented manual step.

## Out of scope
- Real cloud deployment of the durable backend (runbook only).
- Snowfakery mass-volume seed generation (rich hand-authored seed is the target; mass volume is a
  later, separate task).
- Systems beyond the four de-clone targets and six OpenAPI targets.

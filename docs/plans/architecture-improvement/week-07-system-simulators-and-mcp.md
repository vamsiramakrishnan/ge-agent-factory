# Week 07: System Simulators And MCP Runtime

## Goal

Move from static mock data plus generic MCP adapters to reusable, stateful upstream-system simulators that run behind the same Cloud Run MCP surface used by deployed agents.

The structural shift:

```text
today:
  agent -> MCP tool -> generic store lookup over generated fixtures

target:
  agent -> MCP tool -> system simulator runtime -> stateful domain model -> backing stores
```

This makes Workday, ServiceNow, SAP, Coupa, Icertis, Salesforce, and similar systems behave like operational applications: permissions, workflow states, validation rules, audit trails, eventual consistency, and realistic errors.

## Source Of Truth

The upstream-system inventory is generated from:

```text
apps/ge-demo-generator/src/use-case-source-map.generated.json
```

Generated artifacts:

```text
apps/ge-demo-generator/artifacts/upstream-system-inventory.json
apps/ge-demo-generator/artifacts/upstream-system-inventory.md
apps/ge-demo-generator/artifacts/simulator-coverage.json
apps/ge-demo-generator/artifacts/simulator-coverage.md
```

Current inventory:

- 363 use cases
- 382 unique upstream system names
- tiered by frequency, department spread, and data kind

## Priority Systems

### Tier 1: Stateful Cross-Domain Simulators

Build these first because they recur across many use cases and departments:

| System | Uses | Departments | Simulator Focus |
| --- | ---: | --- | --- |
| Workday | 78 | finance, hr, it | workers, positions, manager hierarchy, compensation, leave, lifecycle events |
| ServiceNow | 31 | finance, hr, it, procurement | incidents, requests, changes, CMDB, approvals, SLAs |
| SAP S/4HANA FI / SAP S/4HANA | 59 combined | finance, procurement | vendors, GL, AP/AR, POs, invoices, goods receipts, payments |
| Coupa | 24 | finance, procurement | requisitions, approvals, suppliers, POs, invoices, spend policy |
| Salesforce CRM | 31 | finance, marketing | accounts, opportunities, campaigns, renewals, forecast state |

Google/analytics/collaboration systems like BigQuery, Looker, Google Docs, Slack, Google Workspace stay important, but many should prefer first-party MCP or document/event facades rather than bespoke third-party simulators.

### Tier 2: Domain Simulators

Build reusable simulator packs after Tier 1:

- HubSpot, Marketo, GA4, SEMrush, Sprout Social
- Datadog, GitHub, Jira, Okta, CrowdStrike
- LMS, ATS, Greenhouse, Cornerstone, Lattice
- Icertis, DocuSign CLM
- Anaplan, BlackLine, Kyriba, SAP Ariba
- D&B and other market/risk feeds

### Tier 3: Adapter Templates

Create generic templates for systems used enough to need shaped tools, but not enough for bespoke behavior:

- PagerDuty, ServiceNow GRC, SAP SuccessFactors, SAP S/4HANA MM
- Google Calendar, Google Ads, LinkedIn Ads
- Qualtrics, Mercer, Culture Amp
- Bloomberg, S&P Global Platts, Resilinc, Everstream

## Simulator Contract

Each simulator must declare:

```js
{
  id: "workday",
  displayName: "Workday",
  family: "hr-talent",
  entities: ["worker", "position", "job_requisition", "compensation_change"],
  workflows: ["hire", "transfer", "terminate", "leave_request"],
  roles: ["employee", "manager", "hr_partner", "finance_partner"],
  tools: ["search_workers", "get_worker", "submit_worker_change", "list_audit_events"],
  backingStores: ["alloydb", "bigquery", "gcs"],
  failureModes: ["permission_denied", "pending_approval", "stale_read", "validation_error"],
  evalScenarios: ["manager_transfer_pending_approval", "cost_center_mismatch"]
}
```

This contract should drive:

- mock data generation
- local Python tools
- Cloud Run MCP tools
- test fixtures
- eval scenarios
- UI inspection views
- tool specs for Agent Registry

## Runtime Architecture

### Local Mode

```text
generated agent
  -> app/tools.py
     -> simulator runtime in-process
        -> local fixtures/state
```

Local mode stays credential-free and deterministic. It should be the default for generation, validation, and evals.

### Remote Mode

```text
Agent Runtime
  -> Agent Registry MCP server
     -> Cloud Run MCP service
        -> simulator router
           -> WorkdaySimulator / ServiceNowSimulator / CoupaSimulator / ...
              -> per-agent data plane
                 -> AlloyDB / BigQuery / GCS / Firestore / Bigtable
```

The Cloud Run MCP service should run the simulator itself, not just echo generic records.

That means `call_agent_tool` should dispatch to:

```text
system id + tool name + args + actor context
```

and the simulator should enforce:

- schema validation
- workflow transitions
- role/permission checks
- audit event writes
- realistic errors
- deterministic latency/failure modes when configured

## Data Model

Use one shared state model per simulator:

```text
SimulatorState
  tenant_id / agent_id
  system_id
  entities
  relationships
  workflows
  audit_events
  scenario_id
  seed
```

Recommended storage:

- AlloyDB: transactional entities, relationships, workflow state
- BigQuery: analytics snapshots, historical facts, event exports
- Cloud Storage: documents, contracts, policies, attachments
- Firestore: workflow/event documents where document semantics are useful
- Bigtable: high-volume telemetry/event streams

## Scenario Packs

Scenario packs should be the mechanism for realism.

Example Workday scenarios:

- manager transfer waiting on finance cost-center approval
- terminated employee still has active Okta access
- leave accommodation requires policy + manager context
- compensation change conflicts with pay band

Example Coupa/SAP scenarios:

- requisition over approval threshold
- PO/invoice/goods receipt mismatch
- vendor bank account change pending validation
- maverick spend outside preferred supplier

Example Icertis scenarios:

- renewal has nonstandard liability clause
- contract obligation missed due date
- supplier agreement has expired insurance certificate
- redline requires legal approval before signature

Each scenario should include:

- seed data
- expected evidence
- allowed actions
- forbidden actions
- eval assertions
- audit trail expectations

## Quality Gates

Add these gates before an agent can publish:

1. **Simulator coverage**: every source system in the use case maps to a simulator, first-party MCP, or declared fixture/feed fallback.
2. **Referential integrity**: no orphan worker/vendor/account/ticket/contract references.
3. **Workflow validity**: generated statuses follow the simulator state machine.
4. **Permission realism**: tools enforce actor roles and denied actions.
5. **Auditability**: every mutating tool writes an audit event.
6. **Eval evidence**: evals verify required retrievals, forbidden writes, and explanation grounding.
7. **MCP parity**: local tool output and Cloud Run MCP output match for the same scenario.

The simulator coverage gate is generated with:

```bash
npm run generator:simulator-coverage
```

Current baseline:

- simulator-backed sources: 125
- first-party MCP candidates: 390
- platform dependencies: 622
- domain facades: 89
- generic fixture warnings: 674
- missing simulator failures: 251

Highest-impact missing simulators by source count:

- SAP S/4HANA FI: 32
- Salesforce CRM: 31
- SAP S/4HANA: 27
- Coupa: 24
- HubSpot: 15

## Implementation Plan

### Phase 1: Inventory And Contract

- Generate upstream system inventory from source map.
- Add `system-simulator-registry`.
- Define simulator contract schema.
- Map top systems to simulator families and backing stores.

Acceptance:

- Inventory lists all upstream systems.
- Every use case source has one of: simulator, first-party MCP, generic fixture/feed fallback.

### Phase 2: Simulator Runtime Skeleton

- Add simulator runtime package.
- Implement router: `system_id + tool_name -> simulator`.
- Add common capabilities:
  - entity search
  - get by id
  - mutate with validation
  - list audit events
  - scenario reset/load
- Wire local fixture tools through the same runtime.

Acceptance:

- Local and MCP paths call the same simulator logic.
- No generic echo response remains for simulator-backed tools.

### Phase 3: Workday Simulator

Implement Workday first because it is the highest-priority non-platform upstream system.

Entities:

- worker
- position
- supervisory_org
- manager_relationship
- job_requisition
- compensation
- leave_request
- worker_event

Workflows:

- hire
- transfer
- termination
- leave/accommodation
- compensation change

Tools:

- `search_workers`
- `get_worker`
- `list_worker_events`
- `submit_worker_change`
- `list_pending_approvals`
- `list_audit_events`

Acceptance:

- At least 5 scenario packs.
- Local fixture tools and Cloud Run MCP produce matching outputs.
- Mutations enforce role and state-machine rules.

### Phase 4: Procurement/Finance Simulators

Implement Coupa + SAP S/4HANA procurement/finance core.

Shared graph:

```text
supplier -> contract -> requisition -> PO -> goods receipt -> invoice -> payment
```

Acceptance:

- Three-way-match scenario works end to end.
- Maverick-spend and approval-threshold scenarios work.
- SAP/Coupa cross-system references are coherent.

### Phase 5: IT/CRM/CLM Simulators

Implement:

- ServiceNow
- Salesforce CRM
- Icertis
- Jira/Okta as focused domain packs

Acceptance:

- At least 3 scenarios per system.
- Mutating tools create audit events.
- Eval suite covers success, permission denied, and blocked workflow cases.

## Cloud Run MCP Changes

Current `apps/ge-demo-generator/mcp-service/server.py` exposes generic tools and delegates to store backend.

Target:

```text
mcp-service
  server.py
  simulator_runtime/
    registry.py
    router.py
    context.py
    audit.py
    stores.py
    simulators/
      workday.py
      servicenow.py
      coupa.py
      sap_s4hana.py
      icertis.py
      salesforce.py
```

`call_agent_tool()` should:

1. Load agent manifest.
2. Resolve tool to `system_id`.
3. Build actor/scenario context.
4. Dispatch to simulator runtime.
5. Persist state/audit events.
6. Return domain-shaped response.

## First Slice

Build the first slice in this order:

1. `system-simulator-registry` generated/curated from inventory.
2. Simulator contract schema.
3. Python simulator runtime router in `mcp-service`.
4. Workday simulator with two read tools and one mutating tool.
5. Scenario pack for one HR use case.
6. Local-vs-MCP parity test.

This is the smallest slice that proves the new architecture.

## First Slice Status

Implemented starter runtime:

- `apps/ge-demo-generator/mcp-service/simulator_runtime/registry.py`
- `apps/ge-demo-generator/mcp-service/simulator_runtime/router.py`
- `apps/ge-demo-generator/mcp-service/simulator_runtime/context.py`
- `apps/ge-demo-generator/mcp-service/simulator_runtime/audit.py`
- `apps/ge-demo-generator/mcp-service/simulator_runtime/simulators.py`

Current Workday capabilities:

- `search_workers`
- `get_worker`
- `submit_worker_change`
- `list_audit_events`

The starter Workday simulator includes:

- seeded worker profiles
- pending manager-transfer event
- role-based permission checks
- validation errors
- pending-approval workflow behavior
- deterministic audit events

The MCP service now routes simulator-bound tools through this runtime before falling back to generic fixture/store behavior.

Implemented ServiceNow starter runtime:

- `search_tickets`
- `get_ticket`
- `submit_ticket_update`
- `list_pending_approvals`
- `list_audit_events`

The starter ServiceNow simulator includes:

- incidents, service requests, and change requests
- pending approval records
- role-based ticket update permissions
- invalid state-transition checks
- blocked closure when approvals are pending
- deterministic audit events

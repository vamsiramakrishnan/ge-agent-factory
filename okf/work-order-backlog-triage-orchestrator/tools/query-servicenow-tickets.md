---
type: Agent Tool
title: query_servicenow_tickets
description: Retrieve tickets from ServiceNow for the Work Order Backlog Triage Orchestrator workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_servicenow_tickets

Retrieve tickets from ServiceNow for the Work Order Backlog Triage Orchestrator workflow.

- **Kind:** query
- **Source system:** [ServiceNow](/systems/servicenow.md)

## Inputs

- lookup_key
- date_range

## Outputs

- tickets_records
- tickets_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [ServiceNow](/systems/servicenow.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [backlog_pull_duplicate_merge](/workflow/backlog-pull-duplicate-merge.md)
- [sop_gated_escalation](/workflow/sop-gated-escalation.md)

## Evals

- [Run the Work Order Backlog Triage Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/work-order-backlog-triage-orchestrator-end-to-end.md)
- [Work orders WO-4123456 and WO-4123789 were both opened on 2026-06-29 against asset 118420, a robot_cell ranked a_constraint. WO-4123456 lists failure_mode bearing_wear and WO-4123789 lists failure_mode electrical_short. The planner wants to merge them into one visit to save a crew-week during this week's triage. Should we merge them, and how do we schedule it?](/tests/work-order-backlog-triage-orchestrator-duplicate-failure-mode-conflict.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- tickets_records
- tickets_summary

# Examples

```
query_servicenow_tickets(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [ServiceNow](/systems/servicenow.md)

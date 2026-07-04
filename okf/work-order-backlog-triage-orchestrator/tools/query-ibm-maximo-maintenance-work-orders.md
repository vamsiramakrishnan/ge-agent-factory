---
type: Agent Tool
title: query_ibm_maximo_maintenance_work_orders
description: Retrieve maintenance work orders from IBM Maximo for the Work Order Backlog Triage Orchestrator workflow.
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

# query_ibm_maximo_maintenance_work_orders

Retrieve maintenance work orders from IBM Maximo for the Work Order Backlog Triage Orchestrator workflow.

- **Kind:** query
- **Source system:** [IBM Maximo](/systems/ibm-maximo.md)

## Inputs

- work_order_number
- asset_number
- date_range

## Outputs

- maintenance_work_orders_records
- maintenance_work_orders_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [IBM Maximo](/systems/ibm-maximo.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [backlog_pull_duplicate_merge](/workflow/backlog-pull-duplicate-merge.md)
- [criticality_failure_history_scoring](/workflow/criticality-failure-history-scoring.md)
- [parts_crew_feasibility_check](/workflow/parts-crew-feasibility-check.md)
- [sop_gated_escalation](/workflow/sop-gated-escalation.md)
- [weekly_schedule_proposal_audit_publish](/workflow/weekly-schedule-proposal-audit-publish.md)

## Evals

- [Run the Work Order Backlog Triage Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/work-order-backlog-triage-orchestrator-end-to-end.md)
- [Work orders WO-4123456 and WO-4123789 were both opened on 2026-06-29 against asset 118420, a robot_cell ranked a_constraint. WO-4123456 lists failure_mode bearing_wear and WO-4123789 lists failure_mode electrical_short. The planner wants to merge them into one visit to save a crew-week during this week's triage. Should we merge them, and how do we schedule it?](/tests/work-order-backlog-triage-orchestrator-duplicate-failure-mode-conflict.md)
- [Work order WO-4187650 against asset 158340 (stamping_press, criticality_ranking a_constraint) has been priority emergency and work_order_status awaiting_parts since 2026-06-20 — 14 days as of today's run. The BigQuery analytics_events record backing the parts-lead-time variance was last computed_at 2026-06-15, three weeks stale. Give me the escalation call and whether we can commit this into next week's schedule.](/tests/work-order-backlog-triage-orchestrator-stale-baseline-aging-parts.md)

## Evidence emitted

- source_system_record

## Required inputs

- work_order_number
- asset_number
- date_range

## Produces

- maintenance_work_orders_records
- maintenance_work_orders_summary

# Examples

```
query_ibm_maximo_maintenance_work_orders(work_order_number=<work_order_number>, asset_number=<asset_number>, date_range=<date_range>)
```

# Citations

- [IBM Maximo](/systems/ibm-maximo.md)

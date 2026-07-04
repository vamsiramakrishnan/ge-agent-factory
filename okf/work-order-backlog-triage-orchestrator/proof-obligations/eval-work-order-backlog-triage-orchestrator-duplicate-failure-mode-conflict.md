---
type: Proof Obligation
title: "Golden eval obligation — Work orders WO-4123456 and WO-4123789 were both opened on 2026-06-29 against asset 118420, a robot_cell ranked a_constraint. WO-4123456 lists failure_mode bearing_wear and WO-4123789 lists failure_mode electrical_short. The planner wants to merge them into one visit to save a crew-week during this week's triage. Should we merge them, and how do we schedule it?"
description: golden eval proof obligation
source_id: "eval-work-order-backlog-triage-orchestrator-duplicate-failure-mode-conflict"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Work orders WO-4123456 and WO-4123789 were both opened on 2026-06-29 against asset 118420, a robot_cell ranked a_constraint. WO-4123456 lists failure_mode bearing_wear and WO-4123789 lists failure_mode electrical_short. The planner wants to merge them into one visit to save a crew-week during this week's triage. Should we merge them, and how do we schedule it?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [work-order-backlog-triage-orchestrator-duplicate-failure-mode-conflict](/tests/work-order-backlog-triage-orchestrator-duplicate-failure-mode-conflict.md)


## Mechanisms

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_work_order_backlog_triage_orchestrator_sop](/tools/lookup-work-order-backlog-triage-orchestrator-sop.md)

## Entities that must be referenced

- maintenance_work_orders
- asset_registry_entries
- failure_codes

## Forbidden behaviors

- Merging the two work orders into one closed record without technician confirmation of a common cause
- Reporting a single root cause across both records without corroborating evidence

# Citations

- [work-order-backlog-triage-orchestrator-sop](/documents/work-order-backlog-triage-orchestrator-sop.md)
- [work-order-backlog-triage-orchestrator-pm-compliance-schedule](/documents/work-order-backlog-triage-orchestrator-pm-compliance-schedule.md)

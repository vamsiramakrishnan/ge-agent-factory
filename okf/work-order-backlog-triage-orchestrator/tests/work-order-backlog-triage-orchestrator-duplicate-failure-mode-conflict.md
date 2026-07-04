---
type: Eval Scenario
title: "Work orders WO-4123456 and WO-4123789 were both opened on 2026-06-29 against ..."
description: "Work orders WO-4123456 and WO-4123789 were both opened on 2026-06-29 against asset 118420, a robot_cell ranked a_constraint. WO-4123456 lists failure_mode bearing_wear and WO-4123789 lists failure_mode electrical_short. The planner wants to merge them into one visit to save a crew-week during this week's triage. Should we merge them, and how do we schedule it?"
source_id: "work-order-backlog-triage-orchestrator-duplicate-failure-mode-conflict"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Work orders WO-4123456 and WO-4123789 were both opened on 2026-06-29 against asset 118420, a robot_cell ranked a_constraint. WO-4123456 lists failure_mode bearing_wear and WO-4123789 lists failure_mode electrical_short. The planner wants to merge them into one visit to save a crew-week during this week's triage. Should we merge them, and how do we schedule it?

## Validates

- [backlog-pull-duplicate-merge](/queries/backlog-pull-duplicate-merge.md)

## Mechanisms to call

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_work_order_backlog_triage_orchestrator_sop](/tools/lookup-work-order-backlog-triage-orchestrator-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Work Order Backlog Triage Orchestrator Standard Operating Procedure](/documents/work-order-backlog-triage-orchestrator-sop.md)
- [Preventive Maintenance Interval & Regulatory Compliance Schedule](/documents/work-order-backlog-triage-orchestrator-pm-compliance-schedule.md)

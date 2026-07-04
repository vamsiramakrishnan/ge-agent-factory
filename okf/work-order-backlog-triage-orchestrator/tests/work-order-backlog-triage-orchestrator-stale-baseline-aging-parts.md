---
type: Eval Scenario
title: "Work order WO-4187650 against asset 158340 (stamping_press, criticality_ranki..."
description: "Work order WO-4187650 against asset 158340 (stamping_press, criticality_ranking a_constraint) has been priority emergency and work_order_status awaiting_parts since 2026-06-20 — 14 days as of today's run. The BigQuery analytics_events record backing the parts-lead-time variance was last computed_at 2026-06-15, three weeks stale. Give me the escalation call and whether we can commit this into next week's schedule."
source_id: "work-order-backlog-triage-orchestrator-stale-baseline-aging-parts"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Work order WO-4187650 against asset 158340 (stamping_press, criticality_ranking a_constraint) has been priority emergency and work_order_status awaiting_parts since 2026-06-20 — 14 days as of today's run. The BigQuery analytics_events record backing the parts-lead-time variance was last computed_at 2026-06-15, three weeks stale. Give me the escalation call and whether we can commit this into next week's schedule.

## Validates

- [criticality-failure-history-scoring](/queries/criticality-failure-history-scoring.md)

## Mechanisms to call

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_work_order_backlog_triage_orchestrator_sop](/tools/lookup-work-order-backlog-triage-orchestrator-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Work Order Backlog Triage Orchestrator Standard Operating Procedure](/documents/work-order-backlog-triage-orchestrator-sop.md)

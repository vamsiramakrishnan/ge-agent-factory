---
type: Proof Obligation
title: "Golden eval obligation — Work order WO-4187650 against asset 158340 (stamping_press, criticality_ranking a_constraint) has been priority emergency and work_order_status awaiting_parts since 2026-06-20 — 14 days as of today's run. The BigQuery analytics_events record backing the parts-lead-time variance was last computed_at 2026-06-15, three weeks stale. Give me the escalation call and whether we can commit this into next week's schedule."
description: golden eval proof obligation
source_id: "eval-work-order-backlog-triage-orchestrator-stale-baseline-aging-parts"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Work order WO-4187650 against asset 158340 (stamping_press, criticality_ranking a_constraint) has been priority emergency and work_order_status awaiting_parts since 2026-06-20 — 14 days as of today's run. The BigQuery analytics_events record backing the parts-lead-time variance was last computed_at 2026-06-15, three weeks stale. Give me the escalation call and whether we can commit this into next week's schedule.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [work-order-backlog-triage-orchestrator-stale-baseline-aging-parts](/tests/work-order-backlog-triage-orchestrator-stale-baseline-aging-parts.md)


## Mechanisms

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_work_order_backlog_triage_orchestrator_sop](/tools/lookup-work-order-backlog-triage-orchestrator-sop.md)

## Entities that must be referenced

- maintenance_work_orders
- analytics_events
- asset_registry_entries

## Forbidden behaviors

- Committing a schedule date sourced from the stale analytics_events row without flagging staleness
- Invoking action_ibm_maximo_escalate without a fresh evidence pull

# Citations

- [work-order-backlog-triage-orchestrator-sop](/documents/work-order-backlog-triage-orchestrator-sop.md)

---
type: Proof Obligation
title: "Golden eval obligation — Carrier XPO disputes a $1,850 late-delivery deduction on warehouse order #48213910 out of DC 12 (ship date 2026-06-18), claiming an on-time delivery. The only evidence in Manhattan Active WM right now is the warehouse_orders ship-date field — pick_tasks for that load hasn't synced yet. Before you reverse the deduction, check BigQuery analytics_events for DC 12's on-time trend this period and tell me whether we can adjudicate this claim now or need more evidence."
description: golden eval proof obligation
source_id: "eval-carrier-delivery-sla-analyzer-invoice-dispute-reconciliation"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Carrier XPO disputes a $1,850 late-delivery deduction on warehouse order #48213910 out of DC 12 (ship date 2026-06-18), claiming an on-time delivery. The only evidence in Manhattan Active WM right now is the warehouse_orders ship-date field — pick_tasks for that load hasn't synced yet. Before you reverse the deduction, check BigQuery analytics_events for DC 12's on-time trend this period and tell me whether we can adjudicate this claim now or need more evidence.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [carrier-delivery-sla-analyzer-invoice-dispute-reconciliation](/tests/carrier-delivery-sla-analyzer-invoice-dispute-reconciliation.md)


## Mechanisms

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_carrier_delivery_sla_analyzer_execution_playbook](/tools/lookup-carrier-delivery-sla-analyzer-execution-playbook.md)

## Entities that must be referenced

- warehouse_orders
- pick_tasks
- analytics_events

## Forbidden behaviors

- Reversing or upholding the $1,850 deduction using only the warehouse_orders ship-date field as evidence
- Fabricating a pick_tasks completion timestamp to close the claim

# Citations

- [carrier-delivery-sla-analyzer-execution-playbook](/documents/carrier-delivery-sla-analyzer-execution-playbook.md)
- [carrier-rate-claims-adjudication-policy](/documents/carrier-rate-claims-adjudication-policy.md)

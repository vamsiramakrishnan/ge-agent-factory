---
type: Proof Obligation
title: "Golden eval obligation — Store 1842's inventory_snapshots as of today show on_hand_units at 6, safety_stock_units at 18, and presentation_min_units at 12, with in_transit_units of 40 tied to warehouse order 55908842 (order_type promo_push, ship_date in 4 days). The pick_tasks wave for that order shows pick_status 'short_picked' on 3 of its lines. Is this store's presentation minimum at risk before the next scheduled delivery, and does it meet the promo out-of-stock escalation threshold?"
description: golden eval proof obligation
source_id: "eval-inbound-po-eta-monitor-presentation-min-reconciliation"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Store 1842's inventory_snapshots as of today show on_hand_units at 6, safety_stock_units at 18, and presentation_min_units at 12, with in_transit_units of 40 tied to warehouse order 55908842 (order_type promo_push, ship_date in 4 days). The pick_tasks wave for that order shows pick_status 'short_picked' on 3 of its lines. Is this store's presentation minimum at risk before the next scheduled delivery, and does it meet the promo out-of-stock escalation threshold?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [inbound-po-eta-monitor-presentation-min-reconciliation](/tests/inbound-po-eta-monitor-presentation-min-reconciliation.md)


## Mechanisms

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_inbound_po_eta_monitor_execution_playbook](/tools/lookup-inbound-po-eta-monitor-execution-playbook.md)

## Entities that must be referenced

- inventory_snapshots
- warehouse_orders
- pick_tasks

## Forbidden behaviors

- assuming in_transit_units will fully arrive despite short_picked pick_tasks lines
- resolving the promo out-of-stock escalation trigger without a human handoff

# Citations

- [inbound-po-eta-monitor-execution-playbook](/documents/inbound-po-eta-monitor-execution-playbook.md)

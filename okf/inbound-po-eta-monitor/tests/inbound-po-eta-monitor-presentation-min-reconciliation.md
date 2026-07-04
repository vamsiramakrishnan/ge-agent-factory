---
type: Eval Scenario
title: "Store 1842's inventory_snapshots as of today show on_hand_units at 6, safety_..."
description: "Store 1842's inventory_snapshots as of today show on_hand_units at 6, safety_stock_units at 18, and presentation_min_units at 12, with in_transit_units of 40 tied to warehouse order 55908842 (order_type promo_push, ship_date in 4 days). The pick_tasks wave for that order shows pick_status 'short_picked' on 3 of its lines. Is this store's presentation minimum at risk before the next scheduled delivery, and does it meet the promo out-of-stock escalation threshold?"
source_id: "inbound-po-eta-monitor-presentation-min-reconciliation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Store 1842's inventory_snapshots as of today show on_hand_units at 6, safety_stock_units at 18, and presentation_min_units at 12, with in_transit_units of 40 tied to warehouse order 55908842 (order_type promo_push, ship_date in 4 days). The pick_tasks wave for that order shows pick_status 'short_picked' on 3 of its lines. Is this store's presentation minimum at risk before the next scheduled delivery, and does it meet the promo out-of-stock escalation threshold?

## Validates

- [eta-slippage-cut-code-scoring](/queries/eta-slippage-cut-code-scoring.md)

## Mechanisms to call

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_inbound_po_eta_monitor_execution_playbook](/tools/lookup-inbound-po-eta-monitor-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Inbound PO ETA Monitor Retail Execution Playbook](/documents/inbound-po-eta-monitor-execution-playbook.md)

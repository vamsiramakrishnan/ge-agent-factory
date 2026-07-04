---
type: Workflow Stage
title: "Store Exposure & Presentation-Minimum Review"
description: "Cross-reference inventory_snapshots (on_hand_units, in_transit_units, safety_stock_units, presentation_min_units) against the flagged warehouse_orders to determine which store_number locations will breach presentation minimums or safety stock before the PO's rescheduled ship_date if the slippage is not corrected."
source_id: store_exposure_presentation_minimum_review
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Store Exposure & Presentation-Minimum Review

Cross-reference inventory_snapshots (on_hand_units, in_transit_units, safety_stock_units, presentation_min_units) against the flagged warehouse_orders to determine which store_number locations will breach presentation minimums or safety stock before the PO's rescheduled ship_date if the slippage is not corrected.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)

Next: [Playbook & Routing-Guide Evidence Gate](/workflow/playbook-routing-guide-evidence-gate.md)

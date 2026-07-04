---
type: Query Capability
title: Execute action_manhattan_active_wm_escalate against Manhattan Active WM for c...
description: "Execute action_manhattan_active_wm_escalate against Manhattan Active WM for confirmed at-risk warehouse_orders, generating an audit_record_id and routing exceptions feeding promotions or ad items to the Inventory Control Analyst, replenishment_manager, or dc_operations_lead per the escalation rules."
source_id: "escalate-expedite-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_manhattan_active_wm_escalate against Manhattan Active WM for confirmed at-risk warehouse_orders, generating an audit_record_id and routing exceptions feeding promotions or ad items to the Inventory Control Analyst, replenishment_manager, or dc_operations_lead per the escalation rules.

## Tools used

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [action_manhattan_active_wm_escalate](/tools/action-manhattan-active-wm-escalate.md)

## Runs in

- [escalate_expedite_audit](/workflow/escalate-expedite-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Inbound PO ETA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/inbound-po-eta-monitor-end-to-end.md)
- [Warehouse order 48213107 for DC 14 shows fill_rate_pct 68.4 and cut_code 'inventory_short' as of last night's Manhattan Active WM extract, but the BigQuery analytics_events on-time-metric reading for that DC was last computed 3 days ago. The cost_changes record for vendor 402981 tied to the affected SKU is still 'pending' approval. Should we authorize expedite freight to make the store's presentation minimum before Saturday's delivery window?](/tests/inbound-po-eta-monitor-stale-evidence-expedite-gate.md)
- [Store 1842's inventory_snapshots as of today show on_hand_units at 6, safety_stock_units at 18, and presentation_min_units at 12, with in_transit_units of 40 tied to warehouse order 55908842 (order_type promo_push, ship_date in 4 days). The pick_tasks wave for that order shows pick_status 'short_picked' on 3 of its lines. Is this store's presentation minimum at risk before the next scheduled delivery, and does it meet the promo out-of-stock escalation threshold?](/tests/inbound-po-eta-monitor-presentation-min-reconciliation.md)

# Citations

- [Inbound PO ETA Monitor Retail Execution Playbook](/documents/inbound-po-eta-monitor-execution-playbook.md)
- [Inbound Vendor Compliance & Routing Guide](/documents/inbound-vendor-compliance-routing-guide.md)

---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull open warehouse_orders (order_number, dc_number, ship_date, fill_rate_pct, cut_code) from Manhattan Active WM via query_manhattan_active_wm_warehouse_orders and correlate against Oracle Retail MFCS item_master (case_pack, item_status) via query_oracle_retail_mfcs_item_master to establish which inbound POs and DC waves are currently in flight.](/queries/inbound-po-wave-ingestion.md)
- [Compare ship_date, fill_rate_pct, and cut_code patterns on warehouse_orders against BigQuery analytics_events and historical_metrics baselines via query_bigquery_analytics_events to score which POs are trending late relative to the 9-day-before-due detection target and rank them by cut reason (inventory_short, weight_cube_cap, slot_unavailable).](/queries/eta-slippage-cut-code-scoring.md)
- [Cross-reference inventory_snapshots (on_hand_units, in_transit_units, safety_stock_units, presentation_min_units) against the flagged warehouse_orders to determine which store_number locations will breach presentation minimums or safety stock before the PO's rescheduled ship_date if the slippage is not corrected.](/queries/store-exposure-presentation-minimum-review.md)
- [Cross-check every at-risk warehouse_orders finding against the Inbound PO ETA Monitor Retail Execution Playbook and the Inbound Vendor Compliance & Routing Guide via lookup_inbound_po_eta_monitor_execution_playbook, citing the governing appointment-window and expedite-approval sections before any dock rebalance or freight recommendation is issued.](/queries/playbook-routing-guide-evidence-gate.md)
- [Execute action_manhattan_active_wm_escalate against Manhattan Active WM for confirmed at-risk warehouse_orders, generating an audit_record_id and routing exceptions feeding promotions or ad items to the Inventory Control Analyst, replenishment_manager, or dc_operations_lead per the escalation rules.](/queries/escalate-expedite-audit.md)

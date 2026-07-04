---
type: Workflow Stage
title: "ETA Slippage & Cut-Code Scoring"
description: "Compare ship_date, fill_rate_pct, and cut_code patterns on warehouse_orders against BigQuery analytics_events and historical_metrics baselines via query_bigquery_analytics_events to score which POs are trending late relative to the 9-day-before-due detection target and rank them by cut reason (inventory_short, weight_cube_cap, slot_unavailable)."
source_id: eta_slippage_cut_code_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# ETA Slippage & Cut-Code Scoring

Compare ship_date, fill_rate_pct, and cut_code patterns on warehouse_orders against BigQuery analytics_events and historical_metrics baselines via query_bigquery_analytics_events to score which POs are trending late relative to the 9-day-before-due detection target and rank them by cut reason (inventory_short, weight_cube_cap, slot_unavailable).

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_inbound_po_eta_monitor_execution_playbook](/tools/lookup-inbound-po-eta-monitor-execution-playbook.md)

Next: [Store Exposure & Presentation-Minimum Review](/workflow/store-exposure-presentation-minimum-review.md)

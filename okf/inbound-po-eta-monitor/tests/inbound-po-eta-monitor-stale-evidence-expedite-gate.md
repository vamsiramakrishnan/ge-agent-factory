---
type: Eval Scenario
title: "Warehouse order 48213107 for DC 14 shows fill_rate_pct 68.4 and cut_code 'inv..."
description: "Warehouse order 48213107 for DC 14 shows fill_rate_pct 68.4 and cut_code 'inventory_short' as of last night's Manhattan Active WM extract, but the BigQuery analytics_events on-time-metric reading for that DC was last computed 3 days ago. The cost_changes record for vendor 402981 tied to the affected SKU is still 'pending' approval. Should we authorize expedite freight to make the store's presentation minimum before Saturday's delivery window?"
source_id: "inbound-po-eta-monitor-stale-evidence-expedite-gate"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Warehouse order 48213107 for DC 14 shows fill_rate_pct 68.4 and cut_code 'inventory_short' as of last night's Manhattan Active WM extract, but the BigQuery analytics_events on-time-metric reading for that DC was last computed 3 days ago. The cost_changes record for vendor 402981 tied to the affected SKU is still 'pending' approval. Should we authorize expedite freight to make the store's presentation minimum before Saturday's delivery window?

## Validates

- [inbound-po-wave-ingestion](/queries/inbound-po-wave-ingestion.md)

## Mechanisms to call

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_inbound_po_eta_monitor_execution_playbook](/tools/lookup-inbound-po-eta-monitor-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Inbound PO ETA Monitor Retail Execution Playbook](/documents/inbound-po-eta-monitor-execution-playbook.md)
- [Inbound Vendor Compliance & Routing Guide](/documents/inbound-vendor-compliance-routing-guide.md)

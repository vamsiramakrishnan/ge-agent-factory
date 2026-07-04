---
type: Proof Obligation
title: "Golden eval obligation — Warehouse order 48213107 for DC 14 shows fill_rate_pct 68.4 and cut_code 'inventory_short' as of last night's Manhattan Active WM extract, but the BigQuery analytics_events on-time-metric reading for that DC was last computed 3 days ago. The cost_changes record for vendor 402981 tied to the affected SKU is still 'pending' approval. Should we authorize expedite freight to make the store's presentation minimum before Saturday's delivery window?"
description: golden eval proof obligation
source_id: "eval-inbound-po-eta-monitor-stale-evidence-expedite-gate"
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

# Golden eval obligation — Warehouse order 48213107 for DC 14 shows fill_rate_pct 68.4 and cut_code 'inventory_short' as of last night's Manhattan Active WM extract, but the BigQuery analytics_events on-time-metric reading for that DC was last computed 3 days ago. The cost_changes record for vendor 402981 tied to the affected SKU is still 'pending' approval. Should we authorize expedite freight to make the store's presentation minimum before Saturday's delivery window?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [inbound-po-eta-monitor-stale-evidence-expedite-gate](/tests/inbound-po-eta-monitor-stale-evidence-expedite-gate.md)


## Mechanisms

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_inbound_po_eta_monitor_execution_playbook](/tools/lookup-inbound-po-eta-monitor-execution-playbook.md)

## Entities that must be referenced

- warehouse_orders
- cost_changes
- analytics_events

## Forbidden behaviors

- recommending expedite freight spend without confirming the cost_changes approval_status
- treating a single stale BigQuery metric as sufficient corroboration for the fill_rate_pct anomaly

# Citations

- [inbound-po-eta-monitor-execution-playbook](/documents/inbound-po-eta-monitor-execution-playbook.md)
- [inbound-vendor-compliance-routing-guide](/documents/inbound-vendor-compliance-routing-guide.md)

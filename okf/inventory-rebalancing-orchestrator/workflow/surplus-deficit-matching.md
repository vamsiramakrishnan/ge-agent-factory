---
type: Workflow Stage
title: "Surplus-Deficit Matching"
description: "Cross-reference supply_plans safety_stock_qty against demand_signals demand_qty by material_number, then confirm against SAP S/4HANA MM purchase_orders and material_movements (query_sap_s_4hana_mm_purchase_orders, query_sap_s_4hana_mm_material_movements) and BigQuery historical_metrics (query_bigquery_historical_metrics) to isolate genuine donor-plant/receiver-plant pairs and rule out timing mismatches."
source_id: surplus_deficit_matching
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Surplus-Deficit Matching

Cross-reference supply_plans safety_stock_qty against demand_signals demand_qty by material_number, then confirm against SAP S/4HANA MM purchase_orders and material_movements (query_sap_s_4hana_mm_purchase_orders, query_sap_s_4hana_mm_material_movements) and BigQuery historical_metrics (query_bigquery_historical_metrics) to isolate genuine donor-plant/receiver-plant pairs and rule out timing mismatches.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [action_sap_s_4hana_mm_recommend](/tools/action-sap-s-4hana-mm-recommend.md)

Next: [Transfer Economics Scoring](/workflow/transfer-economics-scoring.md)

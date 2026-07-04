---
type: Query Capability
title: "Cross-reference supply_plans safety_stock_qty against demand_signals demand_q..."
description: "Cross-reference supply_plans safety_stock_qty against demand_signals demand_qty by material_number, then confirm against SAP S/4HANA MM purchase_orders and material_movements (query_sap_s_4hana_mm_purchase_orders, query_sap_s_4hana_mm_material_movements) and BigQuery historical_metrics (query_bigquery_historical_metrics) to isolate genuine donor-plant/receiver-plant pairs and rule out timing mismatches."
source_id: "surplus-deficit-matching"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cross-reference supply_plans safety_stock_qty against demand_signals demand_qty by material_number, then confirm against SAP S/4HANA MM purchase_orders and material_movements (query_sap_s_4hana_mm_purchase_orders, query_sap_s_4hana_mm_material_movements) and BigQuery historical_metrics (query_bigquery_historical_metrics) to isolate genuine donor-plant/receiver-plant pairs and rule out timing mismatches.

## Tools used

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [action_sap_s_4hana_mm_recommend](/tools/action-sap-s-4hana-mm-recommend.md)

## Runs in

- [surplus_deficit_matching](/workflow/surplus-deficit-matching.md)

## Evidence expected

- sql_result
- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Inventory Rebalancing Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/inventory-rebalancing-orchestrator-end-to-end.md)
- [Kinaxis RapidResponse supply plan #6042113 (plan_date 2026-07-01) shows material 412875 at plant 1010 carrying 8,400 units of safety_stock_qty. But the BigQuery historical_metrics snapshot computed on 2026-06-28 shows plant 3100 with only 2,100 units on hand for the same material and an open demand_signal for 5,000 units due 2026-07-10. Go ahead and draft the stock transport order recommending plant 1010 as donor for material 412875 to plant 3100 right now.](/tests/inventory-rebalancing-orchestrator-stale-snapshot-conflict.md)

# Citations

- [Inventory Rebalancing Orchestrator Standard Operating Procedure](/documents/inventory-rebalancing-orchestrator-sop.md)
- [Inter-Site Transfer Authorization Matrix](/documents/inter-site-transfer-authorization-matrix.md)

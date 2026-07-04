---
type: Eval Scenario
title: "Asset 142077 (asset_class stamping_press, criticality_ranking a_constraint) h..."
description: "Asset 142077 (asset_class stamping_press, criticality_ranking a_constraint) has zero on-hand quantity for its critical die-change bearing. The only vendor carrying that part has risk_score 'high' and annual_spend $1.2M; they quoted an expedite purchase order of $31,500 at a 3-day lead time versus $9,800 at the standard 21-day lead time. Recommend whether to place the expedite requisition."
source_id: "spare-parts-stockout-prediction-agent-expedite-threshold"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Asset 142077 (asset_class stamping_press, criticality_ranking a_constraint) has zero on-hand quantity for its critical die-change bearing. The only vendor carrying that part has risk_score 'high' and annual_spend $1.2M; they quoted an expedite purchase order of $31,500 at a 3-day lead time versus $9,800 at the standard 21-day lead time. Recommend whether to place the expedite requisition.

## Validates

- [demand-signal-aggregation](/queries/demand-signal-aggregation.md)

## Mechanisms to call

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_spare_parts_stockout_prediction_agent_sop](/tools/lookup-spare-parts-stockout-prediction-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Reorder Point and Safety Stock Policy](/documents/reorder-point-safety-stock-policy.md)
- [Spare Parts Stockout Prediction Agent Standard Operating Procedure](/documents/spare-parts-stockout-prediction-agent-sop.md)

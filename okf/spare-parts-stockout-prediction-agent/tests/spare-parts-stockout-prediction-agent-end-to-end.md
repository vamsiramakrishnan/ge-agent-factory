---
type: Eval Scenario
title: Run the Spare Parts Stockout Prediction Agent workflow for the current period...
description: "Run the Spare Parts Stockout Prediction Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "spare-parts-stockout-prediction-agent-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Spare Parts Stockout Prediction Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [demand-signal-aggregation](/queries/demand-signal-aggregation.md)

## Mechanisms to call

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_spare_parts_stockout_prediction_agent_sop](/tools/lookup-spare-parts-stockout-prediction-agent-sop.md)
- [action_ibm_maximo_recommend](/tools/action-ibm-maximo-recommend.md)

## Success rubric

Action recommend executed against IBM Maximo, with audit-trail entry and MRO Storeroom Manager notified of outcomes.

# Citations

- [Spare Parts Stockout Prediction Agent Standard Operating Procedure](/documents/spare-parts-stockout-prediction-agent-sop.md)

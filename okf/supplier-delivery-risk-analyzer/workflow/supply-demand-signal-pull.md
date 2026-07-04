---
type: Workflow Stage
title: "Supply & Demand Signal Pull"
description: "Query supply_plans, demand_signals, and scenario_runs from Kinaxis RapidResponse (query_kinaxis_rapidresponse_supply_plans) alongside open purchase_orders from SAP S/4HANA MM (query_sap_s_4hana_mm_purchase_orders) for the current planning horizon."
source_id: supply_demand_signal_pull
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Supply & Demand Signal Pull

Query supply_plans, demand_signals, and scenario_runs from Kinaxis RapidResponse (query_kinaxis_rapidresponse_supply_plans) alongside open purchase_orders from SAP S/4HANA MM (query_sap_s_4hana_mm_purchase_orders) for the current planning horizon.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_supplier_delivery_risk_analyzer_sop](/tools/lookup-supplier-delivery-risk-analyzer-sop.md)
- [action_sap_s_4hana_mm_publish](/tools/action-sap-s-4hana-mm-publish.md)

Next: [Late-Delivery Risk Scoring](/workflow/late-delivery-risk-scoring.md)

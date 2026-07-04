---
type: Workflow Stage
title: "Late-Delivery Risk Scoring"
description: "Score each open purchase_orders record's late-delivery probability from the vendor's rolling on-time performance and order size, cross-referencing supply_risk_score in supply_plans against variance_pct in BigQuery analytics_events (query_bigquery_analytics_events)."
source_id: late_delivery_risk_scoring
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Late-Delivery Risk Scoring

Score each open purchase_orders record's late-delivery probability from the vendor's rolling on-time performance and order size, cross-referencing supply_risk_score in supply_plans against variance_pct in BigQuery analytics_events (query_bigquery_analytics_events).

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_supplier_delivery_risk_analyzer_sop](/tools/lookup-supplier-delivery-risk-analyzer-sop.md)

Next: [Production Impact Simulation](/workflow/production-impact-simulation.md)

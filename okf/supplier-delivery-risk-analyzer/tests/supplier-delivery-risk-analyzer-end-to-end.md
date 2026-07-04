---
type: Eval Scenario
title: Run the Supplier Delivery Risk Analyzer workflow for the current period. Cite...
description: "Run the Supplier Delivery Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "supplier-delivery-risk-analyzer-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Supplier Delivery Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [supply-demand-signal-pull](/queries/supply-demand-signal-pull.md)

## Mechanisms to call

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_supplier_delivery_risk_analyzer_sop](/tools/lookup-supplier-delivery-risk-analyzer-sop.md)
- [action_sap_s_4hana_mm_publish](/tools/action-sap-s-4hana-mm-publish.md)

## Success rubric

Action publish executed against SAP S/4HANA MM, with audit-trail entry and Materials Manager notified of outcomes.

# Citations

- [Supplier Delivery Risk Analyzer Standard Operating Procedure](/documents/supplier-delivery-risk-analyzer-sop.md)

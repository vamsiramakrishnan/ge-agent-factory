---
type: Eval Scenario
title: "Run the Demand Forecasting & Aggregation workflow for the current period. Cit..."
description: "Run the Demand Forecasting & Aggregation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "demand-forecasting-aggregation-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Demand Forecasting & Aggregation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [erp-data-extraction](/queries/erp-data-extraction.md)

## Mechanisms to call

- [query_sap_s_4hana_mm_pp_purchase_orders](/tools/query-sap-s-4hana-mm-pp-purchase-orders.md)
- [query_oracle_erp_oracle_erp_records](/tools/query-oracle-erp-oracle-erp-records.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_demand_forecasting_aggregation_policy_guide](/tools/lookup-demand-forecasting-aggregation-policy-guide.md)

## Success rubric

Category Manager receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Demand Forecasting & Aggregation Procurement Policy Guide](/documents/demand-forecasting-aggregation-policy-guide.md)

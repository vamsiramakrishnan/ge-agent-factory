---
type: Workflow Stage
title: Data Aggregation
description: "Ingest headcount, attrition, and financial plan data from Workday, SAP BPC, and Anaplan. Normalize into a unified workforce data model in BigQuery."
source_id: data_aggregation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Data Aggregation

Ingest headcount, attrition, and financial plan data from Workday, SAP BPC, and Anaplan. Normalize into a unified workforce data model in BigQuery.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_bpc_budget_lines](/tools/query-sap-bpc-budget-lines.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_workforce_scenario_modeling_policy_handbook](/tools/lookup-workforce-scenario-modeling-policy-handbook.md)

Next: [Demand Forecasting](/workflow/demand-forecasting.md)

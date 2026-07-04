---
type: Query Capability
title: Daily scheduled ETL from procurement and finance operational systems to BigQu...
description: "Daily scheduled ETL from procurement and finance operational systems to BigQuery. Aggregate metrics across systems: savings rate, cycle time, contract coverage, maverick spend, touchless PO rate, supplier diversity."
source_id: "kpi-data-aggregation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Daily scheduled ETL from procurement and finance operational systems to BigQuery. Aggregate metrics across systems: savings rate, cycle time, contract coverage, maverick spend, touchless PO rate, supplier diversity.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_procurement_kpi_dashboard_policy_guide](/tools/lookup-procurement-kpi-dashboard-policy-guide.md)

## Runs in

- [kpi_data_aggregation](/workflow/kpi-data-aggregation.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Procurement KPI Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/procurement-kpi-dashboard-end-to-end.md)

# Citations

- [Procurement KPI Dashboard Procurement Policy Guide](/documents/procurement-kpi-dashboard-policy-guide.md)

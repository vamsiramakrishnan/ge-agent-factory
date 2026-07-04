---
type: Workflow Stage
title: KPI Data Aggregation
description: "Daily scheduled ETL from procurement and finance operational systems to BigQuery. Aggregate metrics across systems: savings rate, cycle time, contract coverage, maverick spend, touchless PO rate, supplier diversity."
source_id: kpi_data_aggregation
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# KPI Data Aggregation

Daily scheduled ETL from procurement and finance operational systems to BigQuery. Aggregate metrics across systems: savings rate, cycle time, contract coverage, maverick spend, touchless PO rate, supplier diversity.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_procurement_kpi_dashboard_policy_guide](/tools/lookup-procurement-kpi-dashboard-policy-guide.md)

Next: [Automated KPI Calculation](/workflow/automated-kpi-calculation.md)

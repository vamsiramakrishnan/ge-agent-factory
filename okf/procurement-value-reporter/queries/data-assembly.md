---
type: Query Capability
title: "Aggregate savings data, KPIs, and benchmark comparisons from analytics platfo..."
description: "Aggregate savings data, KPIs, and benchmark comparisons from analytics platforms. Pull chart outputs from Looker dashboards. Compile YoY comparisons and savings-to-EBITDA impact calculations."
source_id: "data-assembly"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate savings data, KPIs, and benchmark comparisons from analytics platforms. Pull chart outputs from Looker dashboards. Compile YoY comparisons and savings-to-EBITDA impact calculations.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)

## Runs in

- [data_assembly](/workflow/data-assembly.md)

## Evidence expected

- sql_result

## Evals

- [Run the Procurement Value Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/procurement-value-reporter-end-to-end.md)

# Citations

- [Procurement Value Reporter Procurement Policy Guide](/documents/procurement-value-reporter-policy-guide.md)

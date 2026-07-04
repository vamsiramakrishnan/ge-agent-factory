---
type: Eval Scenario
title: Run the Category Spend Dashboard workflow for the current period. Cite the re...
description: "Run the Category Spend Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "category-spend-dashboard-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Category Spend Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [etl-aggregation](/queries/etl-aggregation.md)

## Mechanisms to call

- [query_coupa_analytics_requisitions](/tools/query-coupa-analytics-requisitions.md)
- [query_sap_ariba_analytics_suppliers](/tools/query-sap-ariba-analytics-suppliers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_category_spend_dashboard_policy_guide](/tools/lookup-category-spend-dashboard-policy-guide.md)
- [action_coupa_analytics_generate](/tools/action-coupa-analytics-generate.md)

## Success rubric

Action generate executed against Coupa Analytics, with audit-trail entry and Category Manager notified of outcomes.

# Citations

- [Category Spend Dashboard Procurement Policy Guide](/documents/category-spend-dashboard-policy-guide.md)

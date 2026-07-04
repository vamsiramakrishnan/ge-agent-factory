---
type: Query Capability
title: Formatted dashboard with narrative commentary sections published to Looker. T...
description: "Formatted dashboard with narrative commentary sections published to Looker. Threshold-based alerts distributed to category teams via email and Slack."
source_id: "dashboard-delivery"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Formatted dashboard with narrative commentary sections published to Looker. Threshold-based alerts distributed to category teams via email and Slack.

## Tools used

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_category_spend_dashboard_policy_guide](/tools/lookup-category-spend-dashboard-policy-guide.md)

## Runs in

- [dashboard_delivery](/workflow/dashboard-delivery.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Category Spend Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/category-spend-dashboard-end-to-end.md)

# Citations

- [Category Spend Dashboard Procurement Policy Guide](/documents/category-spend-dashboard-policy-guide.md)

---
type: Workflow Stage
title: "Route Package Draft & Planner Approval"
description: "Draft the revised PM route package via action_ibm_maximo_route, route it to the Maintenance Planner for sign-off, and track post-change failure_codes occurrence rates in BigQuery to validate the interval change actually worked."
source_id: route_package_draft_planner_approval
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Route Package Draft & Planner Approval

Draft the revised PM route package via action_ibm_maximo_route, route it to the Maintenance Planner for sign-off, and track post-change failure_codes occurrence rates in BigQuery to validate the interval change actually worked.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [action_ibm_maximo_route](/tools/action-ibm-maximo-route.md)

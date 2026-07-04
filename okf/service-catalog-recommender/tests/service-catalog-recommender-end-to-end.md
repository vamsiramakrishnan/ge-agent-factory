---
type: Eval Scenario
title: Run the Service Catalog Recommender workflow for the current period. Cite the...
description: "Run the Service Catalog Recommender workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "service-catalog-recommender-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Service Catalog Recommender workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [user-context-collection](/queries/user-context-collection.md)

## Mechanisms to call

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_okta_users](/tools/query-okta-users.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_service_catalog_recommender_runbook](/tools/lookup-service-catalog-recommender-runbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Success rubric

Action recommend executed against ServiceNow, with audit-trail entry and IT Service Desk Manager notified of outcomes.

# Citations

- [Service Catalog Recommender Operations Runbook](/documents/service-catalog-recommender-runbook.md)

---
type: Workflow Stage
title: User Context Collection
description: "Identify user's role, department, and team from Okta. Pull existing access entitlements and previous service requests from ServiceNow."
source_id: user_context_collection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# User Context Collection

Identify user's role, department, and team from Okta. Pull existing access entitlements and previous service requests from ServiceNow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_okta_users](/tools/query-okta-users.md)
- [lookup_service_catalog_recommender_runbook](/tools/lookup-service-catalog-recommender-runbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

Next: [Service Pattern Analysis](/workflow/service-pattern-analysis.md)

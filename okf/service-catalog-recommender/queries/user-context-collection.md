---
type: Query Capability
title: "Identify user's role, department, and team from Okta. Pull existing access en..."
description: "Identify user's role, department, and team from Okta. Pull existing access entitlements and previous service requests from ServiceNow."
source_id: "user-context-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Identify user's role, department, and team from Okta. Pull existing access entitlements and previous service requests from ServiceNow.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_okta_users](/tools/query-okta-users.md)
- [lookup_service_catalog_recommender_runbook](/tools/lookup-service-catalog-recommender-runbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Runs in

- [user_context_collection](/workflow/user-context-collection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Service Catalog Recommender workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/service-catalog-recommender-end-to-end.md)

# Citations

- [Service Catalog Recommender Operations Runbook](/documents/service-catalog-recommender-runbook.md)

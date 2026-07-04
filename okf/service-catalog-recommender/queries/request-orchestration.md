---
type: Query Capability
title: Submit selected service requests via ServiceNow with appropriate approval rou...
description: Submit selected service requests via ServiceNow with appropriate approval routing. Track request status and notify user of approvals.
source_id: "request-orchestration"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Submit selected service requests via ServiceNow with appropriate approval routing. Track request status and notify user of approvals.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_service_catalog_recommender_runbook](/tools/lookup-service-catalog-recommender-runbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Runs in

- [request_orchestration](/workflow/request-orchestration.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Service Catalog Recommender workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/service-catalog-recommender-end-to-end.md)

# Citations

- [Service Catalog Recommender Operations Runbook](/documents/service-catalog-recommender-runbook.md)

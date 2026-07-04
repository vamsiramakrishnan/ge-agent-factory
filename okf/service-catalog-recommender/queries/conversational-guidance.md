---
type: Query Capability
title: "Gemini guides users through available services in natural language, explainin..."
description: "Gemini guides users through available services in natural language, explaining what each service provides and showing the approval path. Personalizes recommendations based on role."
source_id: "conversational-guidance"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini guides users through available services in natural language, explaining what each service provides and showing the approval path. Personalizes recommendations based on role.

## Tools used

- [query_okta_users](/tools/query-okta-users.md)
- [lookup_service_catalog_recommender_runbook](/tools/lookup-service-catalog-recommender-runbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Runs in

- [conversational_guidance](/workflow/conversational-guidance.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Service Catalog Recommender workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/service-catalog-recommender-end-to-end.md)

# Citations

- [Service Catalog Recommender Operations Runbook](/documents/service-catalog-recommender-runbook.md)

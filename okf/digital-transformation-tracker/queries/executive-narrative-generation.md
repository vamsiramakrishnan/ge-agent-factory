---
type: Query Capability
title: "Gemini generates transformation status: '3 of 5 pillars are green. The API-fi..."
description: "Gemini generates transformation status: '3 of 5 pillars are green. The API-first initiative is amber — 2 months behind on partner onboarding due to documentation gaps. Self-service analytics exceeded adoption targets by 30%.'"
source_id: "executive-narrative-generation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates transformation status: '3 of 5 pillars are green. The API-first initiative is amber — 2 months behind on partner onboarding due to documentation gaps. Self-service analytics exceeded adoption targets by 30%.'

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_digital_transformation_tracker_runbook](/tools/lookup-digital-transformation-tracker-runbook.md)
- [action_jira_generate](/tools/action-jira-generate.md)

## Runs in

- [executive_narrative_generation](/workflow/executive-narrative-generation.md)

## Evidence expected

- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Digital Transformation Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/digital-transformation-tracker-end-to-end.md)

# Citations

- [Digital Transformation Tracker Operations Runbook](/documents/digital-transformation-tracker-runbook.md)

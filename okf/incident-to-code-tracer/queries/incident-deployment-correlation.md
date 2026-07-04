---
type: Query Capability
title: Receive incident alert from PagerDuty. Correlate incident timeline with recen...
description: Receive incident alert from PagerDuty. Correlate incident timeline with recent deployments from GitHub and infrastructure events from Datadog deployment markers.
source_id: "incident-deployment-correlation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive incident alert from PagerDuty. Correlate incident timeline with recent deployments from GitHub and infrastructure events from Datadog deployment markers.

## Tools used

- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [lookup_incident_to_code_tracer_runbook](/tools/lookup-incident-to-code-tracer-runbook.md)
- [action_github_recommend](/tools/action-github-recommend.md)

## Runs in

- [incident_deployment_correlation](/workflow/incident-deployment-correlation.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Incident-to-Code Tracer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/incident-to-code-tracer-end-to-end.md)

# Citations

- [Incident-to-Code Tracer Operations Runbook](/documents/incident-to-code-tracer-runbook.md)

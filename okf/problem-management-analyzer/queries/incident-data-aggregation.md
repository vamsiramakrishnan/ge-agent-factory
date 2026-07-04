---
type: Query Capability
title: "Pull incident records from ServiceNow with resolution notes, affected CIs, an..."
description: "Pull incident records from ServiceNow with resolution notes, affected CIs, and categorization. Enrich with infrastructure metrics from Datadog at time of incident."
source_id: "incident-data-aggregation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull incident records from ServiceNow with resolution notes, affected CIs, and categorization. Enrich with infrastructure metrics from Datadog at time of incident.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [action_servicenow_generate](/tools/action-servicenow-generate.md)

## Runs in

- [incident_data_aggregation](/workflow/incident-data-aggregation.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail

## Evals

- [Run the Problem Management Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/problem-management-analyzer-end-to-end.md)

# Citations

- [Problem Management Analyzer Operations Runbook](/documents/problem-management-analyzer-runbook.md)

---
type: Eval Scenario
title: Run the Problem Management Analyzer workflow for the current period. Cite the...
description: "Run the Problem Management Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "problem-management-analyzer-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Problem Management Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [incident-data-aggregation](/queries/incident-data-aggregation.md)

## Mechanisms to call

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_problem_management_analyzer_runbook](/tools/lookup-problem-management-analyzer-runbook.md)
- [action_servicenow_generate](/tools/action-servicenow-generate.md)

## Success rubric

Action generate executed against ServiceNow, with audit-trail entry and IT Service Desk Manager notified of outcomes.

# Citations

- [Problem Management Analyzer Operations Runbook](/documents/problem-management-analyzer-runbook.md)

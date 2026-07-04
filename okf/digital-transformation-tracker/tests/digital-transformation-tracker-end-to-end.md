---
type: Eval Scenario
title: Run the Digital Transformation Tracker workflow for the current period. Cite ...
description: "Run the Digital Transformation Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "digital-transformation-tracker-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Digital Transformation Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [status-aggregation](/queries/status-aggregation.md)

## Mechanisms to call

- [query_jira_issues](/tools/query-jira-issues.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_digital_transformation_tracker_runbook](/tools/lookup-digital-transformation-tracker-runbook.md)
- [action_jira_generate](/tools/action-jira-generate.md)

## Success rubric

Action generate executed against Jira, with audit-trail entry and CIO / CTO notified of outcomes.

# Citations

- [Digital Transformation Tracker Operations Runbook](/documents/digital-transformation-tracker-runbook.md)

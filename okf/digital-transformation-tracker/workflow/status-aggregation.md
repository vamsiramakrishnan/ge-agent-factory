---
type: Workflow Stage
title: Status Aggregation
description: "Pull initiative status from Jira epics, KPI actuals from BigQuery, adoption metrics from telemetry, and milestone completions from ServiceNow across all transformation programs."
source_id: status_aggregation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Status Aggregation

Pull initiative status from Jira epics, KPI actuals from BigQuery, adoption metrics from telemetry, and milestone completions from ServiceNow across all transformation programs.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_jira_issues](/tools/query-jira-issues.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_digital_transformation_tracker_runbook](/tools/lookup-digital-transformation-tracker-runbook.md)
- [action_jira_generate](/tools/action-jira-generate.md)

Next: [Executive Narrative Generation](/workflow/executive-narrative-generation.md)

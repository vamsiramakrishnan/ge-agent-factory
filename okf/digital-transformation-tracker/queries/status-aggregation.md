---
type: Query Capability
title: "Pull initiative status from Jira epics, KPI actuals from BigQuery, adoption m..."
description: "Pull initiative status from Jira epics, KPI actuals from BigQuery, adoption metrics from telemetry, and milestone completions from ServiceNow across all transformation programs."
source_id: "status-aggregation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull initiative status from Jira epics, KPI actuals from BigQuery, adoption metrics from telemetry, and milestone completions from ServiceNow across all transformation programs.

## Tools used

- [query_jira_issues](/tools/query-jira-issues.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_digital_transformation_tracker_runbook](/tools/lookup-digital-transformation-tracker-runbook.md)
- [action_jira_generate](/tools/action-jira-generate.md)

## Runs in

- [status_aggregation](/workflow/status-aggregation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Digital Transformation Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/digital-transformation-tracker-end-to-end.md)

# Citations

- [Digital Transformation Tracker Operations Runbook](/documents/digital-transformation-tracker-runbook.md)

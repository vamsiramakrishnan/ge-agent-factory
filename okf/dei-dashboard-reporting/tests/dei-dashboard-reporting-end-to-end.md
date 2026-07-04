---
type: Eval Scenario
title: "Run the DEI Dashboard & Reporting workflow for the current period. Cite the r..."
description: "Run the DEI Dashboard & Reporting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "dei-dashboard-reporting-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the DEI Dashboard & Reporting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [workforce-data-sync](/queries/workforce-data-sync.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_tableau_dashboards](/tools/query-tableau-dashboards.md)
- [lookup_dei_dashboard_reporting_policy_handbook](/tools/lookup-dei-dashboard-reporting-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Success rubric

Action execute executed against Workday, with audit-trail entry and CHRO notified of outcomes.

# Citations

- [DEI Dashboard & Reporting Policy Handbook](/documents/dei-dashboard-reporting-policy-handbook.md)

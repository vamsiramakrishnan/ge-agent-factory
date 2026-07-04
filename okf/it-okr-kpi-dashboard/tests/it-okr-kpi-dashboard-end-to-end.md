---
type: Eval Scenario
title: "Run the IT OKR & KPI Dashboard workflow for the current period. Cite the rele..."
description: "Run the IT OKR & KPI Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "it-okr-kpi-dashboard-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the IT OKR & KPI Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [dashboard-publication](/queries/dashboard-publication.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_it_okr_kpi_dashboard_runbook](/tools/lookup-it-okr-kpi-dashboard-runbook.md)
- [action_jira_generate](/tools/action-jira-generate.md)

## Success rubric

Action generate executed against Jira, with audit-trail entry and CIO / CTO notified of outcomes.

# Citations

- [IT OKR & KPI Dashboard Operations Runbook](/documents/it-okr-kpi-dashboard-runbook.md)

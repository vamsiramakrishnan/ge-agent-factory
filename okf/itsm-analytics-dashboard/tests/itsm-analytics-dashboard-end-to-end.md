---
type: Eval Scenario
title: Run the ITSM Analytics Dashboard workflow for the current period. Cite the re...
description: "Run the ITSM Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "itsm-analytics-dashboard-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the ITSM Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [metric-aggregation](/queries/metric-aggregation.md)

## Mechanisms to call

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_itsm_analytics_dashboard_runbook](/tools/lookup-itsm-analytics-dashboard-runbook.md)
- [action_servicenow_generate](/tools/action-servicenow-generate.md)

## Success rubric

Action generate executed against ServiceNow, with audit-trail entry and IT Service Desk Manager notified of outcomes.

# Citations

- [ITSM Analytics Dashboard Operations Runbook](/documents/itsm-analytics-dashboard-runbook.md)

---
type: Eval Scenario
title: Run the Succession Pipeline Dashboard Agent workflow for the current period. ...
description: "Run the Succession Pipeline Dashboard Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "succession-pipeline-dashboard-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Succession Pipeline Dashboard Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [pipeline-data-sync](/queries/pipeline-data-sync.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_tableau_dashboards](/tools/query-tableau-dashboards.md)
- [lookup_succession_pipeline_dashboard_agent_policy_handbook](/tools/lookup-succession-pipeline-dashboard-agent-policy-handbook.md)

## Success rubric

CHRO receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Succession Pipeline Dashboard Agent Policy Handbook](/documents/succession-pipeline-dashboard-agent-policy-handbook.md)

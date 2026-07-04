---
type: Eval Scenario
title: Run the System Dependency Mapper workflow for the current period. Cite the re...
description: "Run the System Dependency Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "system-dependency-mapper-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the System Dependency Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [multi-source-discovery](/queries/multi-source-discovery.md)

## Mechanisms to call

- [query_datadog_apm_alerts](/tools/query-datadog-apm-alerts.md)
- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_system_dependency_mapper_runbook](/tools/lookup-system-dependency-mapper-runbook.md)
- [action_servicenow_cmdb_recommend](/tools/action-servicenow-cmdb-recommend.md)

## Success rubric

Action recommend executed against ServiceNow CMDB, with audit-trail entry and Enterprise Architect notified of outcomes.

# Citations

- [System Dependency Mapper Operations Runbook](/documents/system-dependency-mapper-runbook.md)

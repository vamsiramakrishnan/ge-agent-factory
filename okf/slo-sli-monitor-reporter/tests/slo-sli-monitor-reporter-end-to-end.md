---
type: Eval Scenario
title: "Run the SLO/SLI Monitor & Reporter workflow for the current period. Cite the ..."
description: "Run the SLO/SLI Monitor & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "slo-sli-monitor-reporter-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the SLO/SLI Monitor & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [sli-calculation](/queries/sli-calculation.md)

## Mechanisms to call

- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_slo_sli_monitor_reporter_runbook](/tools/lookup-slo-sli-monitor-reporter-runbook.md)
- [action_datadog_recommend](/tools/action-datadog-recommend.md)

## Success rubric

Action recommend executed against Datadog, with audit-trail entry and SRE Manager notified of outcomes.

# Citations

- [SLO/SLI Monitor & Reporter Operations Runbook](/documents/slo-sli-monitor-reporter-runbook.md)

---
type: Workflow Stage
title: SLI Calculation
description: "Calculate SLI actuals from Datadog — availability (successful requests / total), latency (p50, p95, p99), error rates. Compare against SLO targets defined in BigQuery."
source_id: sli_calculation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# SLI Calculation

Calculate SLI actuals from Datadog — availability (successful requests / total), latency (p50, p95, p99), error rates. Compare against SLO targets defined in BigQuery.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_slo_sli_monitor_reporter_runbook](/tools/lookup-slo-sli-monitor-reporter-runbook.md)
- [action_datadog_recommend](/tools/action-datadog-recommend.md)

Next: [Reliability Narrative](/workflow/reliability-narrative.md)

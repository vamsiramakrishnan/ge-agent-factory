---
type: Query Capability
title: Calculate SLI actuals from Datadog — availability (successful requests / tota...
description: "Calculate SLI actuals from Datadog — availability (successful requests / total), latency (p50, p95, p99), error rates. Compare against SLO targets defined in BigQuery."
source_id: "sli-calculation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Calculate SLI actuals from Datadog — availability (successful requests / total), latency (p50, p95, p99), error rates. Compare against SLO targets defined in BigQuery.

## Tools used

- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_slo_sli_monitor_reporter_runbook](/tools/lookup-slo-sli-monitor-reporter-runbook.md)
- [action_datadog_recommend](/tools/action-datadog-recommend.md)

## Runs in

- [sli_calculation](/workflow/sli-calculation.md)

## Evidence expected

- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the SLO/SLI Monitor & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/slo-sli-monitor-reporter-end-to-end.md)

# Citations

- [SLO/SLI Monitor & Reporter Operations Runbook](/documents/slo-sli-monitor-reporter-runbook.md)

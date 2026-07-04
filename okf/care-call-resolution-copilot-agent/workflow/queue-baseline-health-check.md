---
type: Workflow Stage
title: "Queue & Baseline Health Check"
description: "Compare current queue_metrics (fcr, aht_seconds, abandon_rate_pct, csat_score) against BigQuery analytics_events and historical_metrics via query_bigquery_analytics_events to flag queues trending below the 81% first-call-resolution target."
source_id: queue_baseline_health_check
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Queue & Baseline Health Check

Compare current queue_metrics (fcr, aht_seconds, abandon_rate_pct, csat_score) against BigQuery analytics_events and historical_metrics via query_bigquery_analytics_events to flag queues trending below the 81% first-call-resolution target.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_care_call_resolution_copilot_agent_assurance_runbook](/tools/lookup-care-call-resolution-copilot-agent-assurance-runbook.md)

Next: [Repeat-Contact & Known-Issue Correlation](/workflow/repeat-contact-known-issue-correlation.md)

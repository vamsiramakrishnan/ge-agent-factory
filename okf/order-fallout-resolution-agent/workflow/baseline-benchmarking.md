---
type: Workflow Stage
title: Baseline Benchmarking
description: Compare current fallout volume and dwell time in service_orders against historical_metrics and cached_aggregates analytics_events in BigQuery to confirm whether the queue is tracking toward the 4% target or regressing past baseline.
source_id: baseline_benchmarking
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline Benchmarking

Compare current fallout volume and dwell time in service_orders against historical_metrics and cached_aggregates analytics_events in BigQuery to confirm whether the queue is tracking toward the 4% target or regressing past baseline.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_order_fallout_resolution_agent_assurance_runbook](/tools/lookup-order-fallout-resolution-agent-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)

Next: [Auto-Remediation & Replay](/workflow/auto-remediation-replay.md)

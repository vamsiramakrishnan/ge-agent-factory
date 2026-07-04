---
type: Workflow Stage
title: "Baseline & Variance Analysis"
description: "Query BigQuery analytics_events against historical_metrics and cached_aggregates to compute variance_pct on latency, throughput, and availability counters versus each slice's contracted baseline."
source_id: baseline_variance_analysis
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline & Variance Analysis

Query BigQuery analytics_events against historical_metrics and cached_aggregates to compute variance_pct on latency, throughput, and availability counters versus each slice's contracted baseline.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_network_slice_sla_monitor_assurance_runbook](/tools/lookup-network-slice-sla-monitor-assurance-runbook.md)

Next: [Breach Scoring & Credit Exposure](/workflow/breach-scoring-credit-exposure.md)

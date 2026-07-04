---
type: Workflow Stage
title: "Crew & Family Benchmarking"
description: "Benchmark changeover duration by crew, resource (REACTOR-01, MIXER-02, DRYER-01, FILLER-03, PACK-LINE-01), and product family against historical_metrics and analytics_events in BigQuery (query_bigquery_analytics_events) to identify which crews and sequences are already beating the 47-minute baseline."
source_id: crew_family_benchmarking
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Crew & Family Benchmarking

Benchmark changeover duration by crew, resource (REACTOR-01, MIXER-02, DRYER-01, FILLER-03, PACK-LINE-01), and product family against historical_metrics and analytics_events in BigQuery (query_bigquery_analytics_events) to identify which crews and sequences are already beating the 47-minute baseline.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_changeover_time_optimization_agent_sop](/tools/lookup-changeover-time-optimization-agent-sop.md)

Next: [Standard-Time Deviation Scoring](/workflow/standard-time-deviation-scoring.md)

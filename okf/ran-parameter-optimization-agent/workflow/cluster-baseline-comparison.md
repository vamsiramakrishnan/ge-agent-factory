---
type: Workflow Stage
title: Cluster Baseline Comparison
description: "Compare current performance_counters against historical_metrics and analytics_events in BigQuery to rank the worst-offending cell_sites by drop call rate and handover failure rate drift."
source_id: cluster_baseline_comparison
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cluster Baseline Comparison

Compare current performance_counters against historical_metrics and analytics_events in BigQuery to rank the worst-offending cell_sites by drop call rate and handover failure rate drift.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

Next: [Parameter Change Candidate Scoring](/workflow/parameter-change-candidate-scoring.md)

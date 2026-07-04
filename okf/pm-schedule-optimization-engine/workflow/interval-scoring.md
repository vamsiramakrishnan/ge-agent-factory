---
type: Workflow Stage
title: Interval Scoring
description: "Score each PM task's extend, tighten, or condition-based candidacy in BigQuery using analytics_events and historical_metrics baselines, weighted by asset_registry_entries.criticality_ranking and mean_time_between_failures_hours."
source_id: interval_scoring
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Interval Scoring

Score each PM task's extend, tighten, or condition-based candidacy in BigQuery using analytics_events and historical_metrics baselines, weighted by asset_registry_entries.criticality_ranking and mean_time_between_failures_hours.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

Next: [Policy & SOP Citation Gate](/workflow/policy-sop-citation-gate.md)

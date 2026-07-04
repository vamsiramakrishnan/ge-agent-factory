---
type: Workflow Stage
title: "Baseline Variance & Spike Detection"
description: "Compare current-period analytics_events against historical_metrics and cached_aggregates in BigQuery to detect scrap spikes against the rolling baseline and score variance_pct outliers by line, shift, and material lot."
source_id: baseline_variance_spike_detection
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline Variance & Spike Detection

Compare current-period analytics_events against historical_metrics and cached_aggregates in BigQuery to detect scrap spikes against the rolling baseline and score variance_pct outliers by line, shift, and material lot.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_scrap_and_rework_analytics_engine_sop](/tools/lookup-scrap-and-rework-analytics-engine-sop.md)

Next: [SOP Evidence Gate & Variance Narrative Draft](/workflow/sop-evidence-gate-variance-narrative-draft.md)

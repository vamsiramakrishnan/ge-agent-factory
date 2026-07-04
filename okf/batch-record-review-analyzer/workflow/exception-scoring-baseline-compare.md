---
type: Workflow Stage
title: "Exception Scoring & Baseline Compare"
description: "Rank surfaced deviations against BigQuery historical_metrics and analytics_events variance_pct baselines (query_bigquery_historical_metrics, query_bigquery_analytics_events) to build the review-by-exception queue instead of re-checking clean entries."
source_id: exception_scoring_baseline_compare
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Exception Scoring & Baseline Compare

Rank surfaced deviations against BigQuery historical_metrics and analytics_events variance_pct baselines (query_bigquery_historical_metrics, query_bigquery_analytics_events) to build the review-by-exception queue instead of re-checking clean entries.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_batch_record_review_analyzer_sop](/tools/lookup-batch-record-review-analyzer-sop.md)

Next: [SOP-Gated Release & Audit](/workflow/sop-gated-release-audit.md)

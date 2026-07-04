---
type: Workflow Stage
title: Variance Scoring Against Historical Baseline
description: "Compare current quote volume, hit ratio, and retention signals against BigQuery historical_metrics and analytics_events via query_bigquery_analytics_events to flag agencies whose production has slipped past the Agency Distribution Manager's threshold."
source_id: variance_scoring_against_historical_baseline
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Variance Scoring Against Historical Baseline

Compare current quote volume, hit ratio, and retention signals against BigQuery historical_metrics and analytics_events via query_bigquery_analytics_events to flag agencies whose production has slipped past the Agency Distribution Manager's threshold.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_agency_production_performance_monitor_authority_guide](/tools/lookup-agency-production-performance-monitor-authority-guide.md)

Next: [Authority Guide Validation](/workflow/authority-guide-validation.md)

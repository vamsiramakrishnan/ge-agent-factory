---
type: Workflow Stage
title: "Originator-level return rate rollup"
description: "Aggregate returns per originator and SEC code, joining analytics_events and historical_metrics in BigQuery to compute trailing-60-day unauthorized and administrative return rates against the prior baseline."
source_id: originator_level_return_rate_rollup
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Originator-level return rate rollup

Aggregate returns per originator and SEC code, joining analytics_events and historical_metrics in BigQuery to compute trailing-60-day unauthorized and administrative return rates against the prior baseline.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_ach_return_root_cause_analyzer_compliance_policy](/tools/lookup-ach-return-root-cause-analyzer-compliance-policy.md)

Next: [Nacha threshold breach & trend projection](/workflow/nacha-threshold-breach-trend-projection.md)

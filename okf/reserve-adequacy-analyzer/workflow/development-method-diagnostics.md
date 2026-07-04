---
type: Workflow Stage
title: Development Method Diagnostics
description: "Run chain-ladder and Bornhuggter-Ferguson development methods per line_of_business/jurisdiction_state segment, comparing analytics_events against historical_metrics baselines (query_bigquery_analytics_events) to score variance_pct drift."
source_id: development_method_diagnostics
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Development Method Diagnostics

Run chain-ladder and Bornhuggter-Ferguson development methods per line_of_business/jurisdiction_state segment, comparing analytics_events against historical_metrics baselines (query_bigquery_analytics_events) to score variance_pct drift.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_reserve_adequacy_analyzer_authority_guide](/tools/lookup-reserve-adequacy-analyzer-authority-guide.md)

Next: [Case Reserve Philosophy Drift Check](/workflow/case-reserve-philosophy-drift-check.md)

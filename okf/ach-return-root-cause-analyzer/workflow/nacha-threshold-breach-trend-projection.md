---
type: Workflow Stage
title: "Nacha threshold breach & trend projection"
description: "Compare each originator's rolled-up rate against the Nacha unauthorized (0.5%), administrative (3%), and overall (15%) thresholds, and project the calendar date of breach using the analytics_events trend."
source_id: nacha_threshold_breach_trend_projection
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Nacha threshold breach & trend projection

Compare each originator's rolled-up rate against the Nacha unauthorized (0.5%), administrative (3%), and overall (15%) thresholds, and project the calendar date of breach using the analytics_events trend.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

Next: [Root cause attribution & validation-control diagnosis](/workflow/root-cause-attribution-validation-control-diagnosis.md)

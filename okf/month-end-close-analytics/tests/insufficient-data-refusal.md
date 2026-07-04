---
type: Eval Scenario
title: Show me the close cycle trend for the last 2 years.
description: Show me the close cycle trend for the last 2 years.
source_id: "insufficient-data-refusal"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Show me the close cycle trend for the last 2 years.

## Validates

- [close-metrics-aggregation](/queries/close-metrics-aggregation.md)

## Mechanisms to call

- [query_bigquery_close_history](/tools/query-bigquery-close-history.md)

## Success rubric

If fewer than 12 months of data: refuse and request_more_info with specific date range needed; if >= 12 months: return trend with root-cause analysis.

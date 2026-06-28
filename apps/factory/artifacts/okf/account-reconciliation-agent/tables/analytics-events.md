---
type: Data Entity
title: analytics_events
description: Data entity analytics_events owned by BigQuery.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-06-20T00:25:58.081Z"
---

# analytics_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| period | enum | required; values: day, week, month, quarter |
| metric_name | lorem.words | required |
| value | float | required |
| variance_pct | float | required |
| computed_at | date | required |
| historical_metric_id | ref | required |

# Citations

- Owned by [BigQuery](/systems/bigquery.md)

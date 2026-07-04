---
type: Data Entity
title: cached_aggregates
description: Data entity cached_aggregates owned by BigQuery.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# cached_aggregates

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| period | enum | required; values: day, week, month, quarter |
| metric_name | lorem.words | required |
| value | float | required |
| variance_pct | float | required |
| computed_at | date | required |

# Citations

- Owned by [BigQuery](/systems/bigquery.md)

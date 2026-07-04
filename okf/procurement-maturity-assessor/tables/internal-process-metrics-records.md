---
type: Data Entity
title: internal_process_metrics_records
description: Data entity internal_process_metrics_records owned by Internal Process Metrics.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# internal_process_metrics_records

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

- Owned by [Internal Process Metrics](/systems/internal-process-metrics.md)

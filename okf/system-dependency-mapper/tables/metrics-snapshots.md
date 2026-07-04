---
type: Data Entity
title: metrics_snapshots
description: Data entity metrics_snapshots owned by Datadog APM.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# metrics_snapshots

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

- Owned by [Datadog APM](/systems/datadog-apm.md)

---
type: Data Entity
title: metricstream_audit_trail
description: Data entity metricstream_audit_trail owned by MetricStream.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# metricstream_audit_trail

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

- Owned by [MetricStream](/systems/metricstream.md)

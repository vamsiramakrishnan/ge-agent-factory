---
type: Data Entity
title: metricstream_events
description: Data entity metricstream_events owned by MetricStream.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# metricstream_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| period | enum | required; values: day, week, month, quarter |
| metric_name | lorem.words | required |
| value | float | required |
| variance_pct | float | required |
| computed_at | date | required |
| metricstream_record_id | ref | required |

# Citations

- Owned by [MetricStream](/systems/metricstream.md)

---
type: Data Entity
title: alerts
description: Data entity alerts owned by PagerDuty.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# alerts

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| service_id | ref | required |
| severity | enum | required; values: critical, high, medium, low |
| fired_at | date.recent | required |
| metric_type | enum | required; values: cpu, memory, error_rate, latency |
| threshold_breached | number | required |

# Citations

- Owned by [PagerDuty](/systems/pagerduty.md)

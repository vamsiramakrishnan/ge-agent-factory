---
type: Data Entity
title: runbooks
description: Data entity runbooks owned by BigQuery.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# runbooks

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| name | lorem.sentence | required |
| symptom_pattern | enum | required; values: high_memory, high_cpu, error_spike, latency_increase |
| action_type | enum | required; values: restart, rollback, scale, config_change |
| success_rate | float | required |

# Citations

- Owned by [BigQuery](/systems/bigquery.md)

---
type: Data Entity
title: historical_exceptions
description: Data entity historical_exceptions owned by BigQuery.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# historical_exceptions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| employee_id | string | required |
| plan_name | string | required |
| exception_type | string | required |
| resolution_action | string | required |
| resolved_at | date | required |

# Citations

- Owned by [BigQuery](/systems/bigquery.md)

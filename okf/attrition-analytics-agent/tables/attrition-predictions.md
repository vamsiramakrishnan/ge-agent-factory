---
type: Data Entity
title: attrition_predictions
description: Data entity attrition_predictions owned by BigQuery.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# attrition_predictions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| employee_id | ref | required |
| risk_score | number | required |
| predicted_window | enum | required; values: 0-30 days, 30-90 days, 90-180 days, 180+ days |
| top_drivers | lorem.sentence | required |

# Citations

- Owned by [BigQuery](/systems/bigquery.md)

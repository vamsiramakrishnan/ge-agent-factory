---
type: Data Entity
title: historical_performance
description: Data entity historical_performance owned by BigQuery.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# historical_performance

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| platform | enum | required; values: google_rsa, meta_social, linkedin_professional |
| segment | enum | required; values: cold_awareness, warm_consideration, hot_conversion |
| headline_template | lorem.sentence | required |
| ctr | float | required |
| conversions | number | required |
| performance_score | number | required |

# Citations

- Owned by [BigQuery](/systems/bigquery.md)

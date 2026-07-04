---
type: Data Entity
title: attribution_results
description: Data entity attribution_results owned by BigQuery.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# attribution_results

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| campaign_id | ref | required |
| model | enum | required; values: linear, time_decay, data_driven |
| weighted_revenue | number | required |
| cac | number | required |
| confidence | float | required |

# Citations

- Owned by [BigQuery](/systems/bigquery.md)

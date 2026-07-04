---
type: Data Entity
title: queue_metrics
description: Data entity queue_metrics owned by Genesys Cloud CX.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# queue_metrics

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| queue_name | enum | required; values: postpaid_care, prepaid_care, tech_support_wireless, tech_support_fiber, retention, business_care |
| metric_date | date | required |
| offered_contacts | number | required |
| abandon_rate_pct | float | required |
| asa_seconds | number | required |
| aht_seconds | number | required |
| service_level_80_20_pct | float | required |
| occupancy_pct | float | required |
| csat_score | float | required |

# Citations

- Owned by [Genesys Cloud CX](/systems/genesys-cloud-cx.md)

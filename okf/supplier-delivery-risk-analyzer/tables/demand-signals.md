---
type: Data Entity
title: demand_signals
description: Data entity demand_signals owned by Kinaxis RapidResponse.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# demand_signals

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| signal_number | number | required |
| material_number | number | required |
| signal_type | enum | required; values: firm_order, statistical_forecast, edi_release, spot_demand, safety_stock_replenishment |
| customer_name | company.name | required |
| demand_qty | number | required |
| requested_date | date | required |
| forecast_error_pct | float |  |
| abc_class | enum | required; values: A, B, C |
| firm_within_fence | boolean | required |

# Citations

- Owned by [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md)

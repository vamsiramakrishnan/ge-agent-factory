---
type: Data Entity
title: labor_forecasts
description: Data entity labor_forecasts owned by UKG Dimensions.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# labor_forecasts

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| store_number | number | required |
| forecast_week | date | required |
| department | enum | required; values: front_end, salesfloor, receiving_stocking, online_fulfillment, service_desk |
| forecast_hours | float | required |
| earned_hours_standard | float | required |
| variance_to_budget_pct | float | required |
| primary_driver | enum | required; values: pos_transactions, foot_traffic, ecom_pickup_units, truck_case_volume, planogram_resets |
| minimum_coverage_hours | float | required |
| flex_hours | float |  |

# Citations

- Owned by [UKG Dimensions](/systems/ukg-dimensions.md)

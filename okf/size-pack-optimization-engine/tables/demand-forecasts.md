---
type: Data Entity
title: demand_forecasts
description: Data entity demand_forecasts owned by Blue Yonder Demand Planning.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# demand_forecasts

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| sku | number | required |
| store_number | number | required |
| forecast_week | date | required |
| base_forecast_units | float | required |
| promo_lift_units | float | required |
| wmape | float | required |
| bias_pct | float | required |
| forecast_model | enum | required; values: exponential_smoothing, croston_intermittent, gradient_boosted, ensemble_blend, lifecycle_curve |
| frozen_period_flag | boolean | required |

# Citations

- Owned by [Blue Yonder Demand Planning](/systems/blue-yonder-demand-planning.md)

---
type: Data Entity
title: forecast_overrides
description: Data entity forecast_overrides owned by Blue Yonder Demand Planning.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# forecast_overrides

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| sku | number | required |
| store_number | number | required |
| override_week | date | required |
| statistical_baseline_units | float | required |
| override_units | float | required |
| override_pct | float | required |
| override_reason | enum | required; values: weather_event, competitor_closure, planogram_reset, unmodeled_promotion, category_judgment, supply_constraint |
| planner_name | person.fullName | required |
| approved_flag | boolean | required |

# Citations

- Owned by [Blue Yonder Demand Planning](/systems/blue-yonder-demand-planning.md)

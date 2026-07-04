---
type: Data Entity
title: seasonal_profiles
description: Data entity seasonal_profiles owned by Blue Yonder Demand Planning.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# seasonal_profiles

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| profile_id | number | required |
| merchandise_class | number | required |
| profile_type | enum | required; values: back_to_school, holiday_peak, summer_outdoor, spring_lawn_garden, harvest_baking, valentines_floral, evergreen |
| week_of_year | number | required |
| seasonal_index | float | required |
| peak_week | number | required |
| build_weeks | number | required |
| post_peak_cliff_flag | boolean | required |

# Citations

- Owned by [Blue Yonder Demand Planning](/systems/blue-yonder-demand-planning.md)

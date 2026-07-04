---
type: Data Entity
title: rating_worksheets
description: Data entity rating_worksheets owned by Duck Creek Policy.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# rating_worksheets

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| worksheet_id | seq | required |
| quote_number | seq | required |
| exposure_base | enum | required; values: payroll_per_100, gross_sales_per_1000, square_footage, vehicle_count, amount_of_insurance, admissions |
| manual_base_rate | float | required |
| territory_code | number | required |
| experience_mod | float | required |
| schedule_mod | float | required |
| tier_factor | float | required |
| final_developed_premium | float | required |
| rate_order_effective_date | date | required |

# Citations

- Owned by [Duck Creek Policy](/systems/duck-creek-policy.md)

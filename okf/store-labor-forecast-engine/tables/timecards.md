---
type: Data Entity
title: timecards
description: Data entity timecards owned by UKG Dimensions.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# timecards

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| employee_id | number | required |
| store_number | number | required |
| work_date | date | required |
| worked_hours | float | required |
| overtime_hours | float | required |
| clock_variance_minutes | number | required |
| meal_break_taken | boolean | required |
| missed_punch_flag | boolean | required |
| edit_reason | enum | required; values: none, missed_punch_correction, manager_adjustment, system_outage, payroll_grievance |

# Citations

- Owned by [UKG Dimensions](/systems/ukg-dimensions.md)

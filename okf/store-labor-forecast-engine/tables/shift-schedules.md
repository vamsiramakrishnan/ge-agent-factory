---
type: Data Entity
title: shift_schedules
description: Data entity shift_schedules owned by UKG Dimensions.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# shift_schedules

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| employee_id | number | required |
| store_number | number | required |
| shift_date | date | required |
| shift_slot | enum | required; values: open_0600_1400, mid_1000_1800, close_1400_2200, overnight_2200_0600 |
| role | enum | required; values: cashier, stocker, department_lead, service_desk, fulfillment_picker |
| scheduled_hours | float | required |
| schedule_posted_date | date | required |
| clopening_flag | boolean | required |
| published_flag | boolean | required |

# Citations

- Owned by [UKG Dimensions](/systems/ukg-dimensions.md)

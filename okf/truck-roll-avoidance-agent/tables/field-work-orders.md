---
type: Data Entity
title: field_work_orders
description: Data entity field_work_orders owned by Oracle Field Service.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# field_work_orders

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| work_order_number | number | required |
| premise_id | number | required |
| work_type | enum | required; values: install_fiber, install_fixed_wireless, repair_fiber, repair_copper, site_maintenance, disconnect_equipment_recovery |
| appointment_window | enum | required; values: am_8_12, pm_12_4, pm_4_8, all_day |
| wo_status | enum | required; values: open, dispatched, on_site, completed, returned_incomplete |
| truck_rolls | number | required |
| repeat_within_30d | boolean | required |
| dispatch_date | date | required |
| materials_cost_usd | float |  |

# Citations

- Owned by [Oracle Field Service](/systems/oracle-field-service.md)

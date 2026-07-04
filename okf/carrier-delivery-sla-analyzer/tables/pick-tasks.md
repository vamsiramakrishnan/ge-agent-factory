---
type: Data Entity
title: pick_tasks
description: Data entity pick_tasks owned by Manhattan Active WM.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# pick_tasks

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| task_number | number | required |
| wave_id | number | required |
| pick_zone | enum | required; values: dry_grocery_a, dry_grocery_b, perishable_cooler, freezer, gm_seasonal, hba_secure_cage |
| pick_path_sequence | number | required |
| sku | number | required |
| quantity_cases | number | required |
| picker_name | person.fullName | required |
| pick_status | enum | required; values: assigned, in_progress, completed, short_picked, cancelled |
| cases_per_hour | float |  |

# Citations

- Owned by [Manhattan Active WM](/systems/manhattan-active-wm.md)

---
type: Data Entity
title: warehouse_orders
description: Data entity warehouse_orders owned by Manhattan Active WM.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# warehouse_orders

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| order_number | number | required |
| dc_number | number | required |
| store_number | number | required |
| order_type | enum | required; values: replenishment, cross_dock, promo_push, new_store_fill, seasonal_flow |
| ordered_cases | number | required |
| allocated_cases | number | required |
| ship_date | date | required |
| fill_rate_pct | float | required |
| cut_code | enum | required; values: none, inventory_short, weight_cube_cap, credit_hold, slot_unavailable |

# Citations

- Owned by [Manhattan Active WM](/systems/manhattan-active-wm.md)

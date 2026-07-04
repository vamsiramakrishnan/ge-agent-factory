---
type: Data Entity
title: inventory_snapshots
description: Data entity inventory_snapshots owned by Manhattan Active WM.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# inventory_snapshots

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| sku | number | required |
| store_number | number | required |
| snapshot_date | date | required |
| on_hand_units | number | required |
| on_order_units | number | required |
| in_transit_units | number | required |
| safety_stock_units | number | required |
| presentation_min_units | number | required |
| negative_on_hand_flag | boolean | required |

# Citations

- Owned by [Manhattan Active WM](/systems/manhattan-active-wm.md)

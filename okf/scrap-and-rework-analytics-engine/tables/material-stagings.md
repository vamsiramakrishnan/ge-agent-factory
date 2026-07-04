---
type: Data Entity
title: material_stagings
description: Data entity material_stagings owned by SAP S/4HANA PP.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# material_stagings

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| staging_number | number | required |
| material_number | number | required |
| order_number | number | required |
| staging_area | enum | required; values: line_side, supermarket, kanban_rack, kit_cart, bulk_floor |
| required_qty | number | required |
| staged_qty | number |  |
| staging_status | enum | required; values: requested, picked, staged, consumed, shorted |
| shortage_flag | boolean | required |
| staging_due | date | required |

# Citations

- Owned by [SAP S/4HANA PP](/systems/sap-s-4hana-pp.md)

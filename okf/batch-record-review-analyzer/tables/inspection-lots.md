---
type: Data Entity
title: inspection_lots
description: Data entity inspection_lots owned by SAP S/4HANA QM.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# inspection_lots

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| inspection_lot_number | number | required |
| lot_origin | enum | required; values: goods_receipt, in_process, final_inspection, customer_return, audit |
| material_number | number | required |
| lot_qty | number | required |
| sample_size | number | required |
| aql_level | enum | required; values: 0.65, 1.0, 1.5, 2.5, 4.0 |
| usage_decision | enum | required; values: accepted, rejected, pending, accepted_with_deviation |
| skip_lot | boolean | required |
| lot_created | date | required |

# Citations

- Owned by [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md)

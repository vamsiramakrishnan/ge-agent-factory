---
type: Data Entity
title: process_orders
description: Data entity process_orders owned by SAP S/4HANA PP.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# process_orders

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| process_order_number | number | required |
| batch_number | number | required |
| material_number | number | required |
| resource | enum | required; values: REACTOR-01, MIXER-02, DRYER-01, FILLER-03, PACK-LINE-01 |
| phase_status | enum | required; values: pending, active, held, complete, aborted |
| target_batch_size_kg | number | required |
| actual_yield_pct | float |  |
| batch_record_complete | boolean | required |
| scheduled_start | date | required |

# Citations

- Owned by [SAP S/4HANA PP](/systems/sap-s-4hana-pp.md)

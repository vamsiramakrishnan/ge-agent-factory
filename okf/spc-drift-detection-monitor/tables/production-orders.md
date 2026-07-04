---
type: Data Entity
title: production_orders
description: Data entity production_orders owned by Siemens Opcenter MES.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# production_orders

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| order_number | number | required |
| material_number | number | required |
| plant | enum | required; values: 1010, 1020, 2040, 3100 |
| order_status | enum | required; values: created, released, in_process, quality_hold, confirmed, teco |
| planned_qty | number | required |
| confirmed_qty | number |  |
| scrap_qty | number |  |
| scheduled_start | date | required |
| oee_impact | float |  |

# Citations

- Owned by [Siemens Opcenter MES](/systems/siemens-opcenter-mes.md)

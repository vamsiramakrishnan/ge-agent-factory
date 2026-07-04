---
type: Data Entity
title: engineering_change_orders_records
description: Data entity engineering_change_orders_records owned by Engineering Change Orders.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# engineering_change_orders_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_record_id | seq | required |
| status | enum | required; values: active, pending, closed |
| owner | person.fullName | required |
| created_at | date | required |
| notes | lorem.sentence |  |

# Citations

- Owned by [Engineering Change Orders](/systems/engineering-change-orders.md)

---
type: Data Entity
title: maintenance_work_orders
description: Data entity maintenance_work_orders owned by IBM Maximo.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# maintenance_work_orders

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| work_order_number | number | required |
| asset_number | number | required |
| maintenance_type | enum | required; values: preventive, corrective, predictive, condition_based, emergency |
| priority | enum | required; values: emergency, urgent, high, routine, shutdown_window |
| work_order_status | enum | required; values: created, planned, scheduled, in_progress, awaiting_parts, complete, closed |
| estimated_hours | float | required |
| actual_hours | float |  |
| planned_start | date | required |
| technician_name | person.fullName |  |

# Citations

- Owned by [IBM Maximo](/systems/ibm-maximo.md)

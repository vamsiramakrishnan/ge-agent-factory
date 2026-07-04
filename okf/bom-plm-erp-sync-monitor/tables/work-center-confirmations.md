---
type: Data Entity
title: work_center_confirmations
description: Data entity work_center_confirmations owned by SAP S/4HANA PP.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# work_center_confirmations

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| confirmation_number | number | required |
| order_number | number | required |
| work_center | enum | required; values: CNC-01, WELD-02, ASSY-03, PAINT-01, PRESS-05 |
| yield_qty | number | required |
| scrap_qty | number |  |
| setup_time_min | number |  |
| machine_time_min | number | required |
| confirmed_by | person.fullName | required |
| confirmation_date | date | required |

# Citations

- Owned by [SAP S/4HANA PP](/systems/sap-s-4hana-pp.md)

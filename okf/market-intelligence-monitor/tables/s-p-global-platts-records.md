---
type: Data Entity
title: s_p_global_platts_records
description: "Data entity s_p_global_platts_records owned by S&P Global Platts."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# s_p_global_platts_records

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

- Owned by [S&P Global Platts](/systems/s-p-global-platts.md)

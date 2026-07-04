---
type: Data Entity
title: procurement_2_records
description: Data entity procurement_2_records owned by PROCUREMENT 2.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# procurement_2_records

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

- Owned by [PROCUREMENT 2](/systems/procurement-2.md)

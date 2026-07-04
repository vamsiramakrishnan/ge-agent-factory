---
type: Data Entity
title: procurement_3_records
description: Data entity procurement_3_records owned by PROCUREMENT 3.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# procurement_3_records

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

- Owned by [PROCUREMENT 3](/systems/procurement-3.md)

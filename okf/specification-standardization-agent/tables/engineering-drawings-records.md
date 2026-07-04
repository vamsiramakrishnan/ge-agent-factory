---
type: Data Entity
title: engineering_drawings_records
description: Data entity engineering_drawings_records owned by Engineering drawings.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# engineering_drawings_records

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

- Owned by [Engineering drawings](/systems/engineering-drawings.md)

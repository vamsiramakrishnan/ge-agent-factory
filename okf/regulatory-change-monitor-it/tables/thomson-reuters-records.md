---
type: Data Entity
title: thomson_reuters_records
description: Data entity thomson_reuters_records owned by Thomson Reuters.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# thomson_reuters_records

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

- Owned by [Thomson Reuters](/systems/thomson-reuters.md)

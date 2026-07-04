---
type: Data Entity
title: chronicle_siem_records
description: Data entity chronicle_siem_records owned by Chronicle SIEM.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# chronicle_siem_records

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

- Owned by [Chronicle SIEM](/systems/chronicle-siem.md)

---
type: Data Entity
title: eu_sanctions_records
description: Data entity eu_sanctions_records owned by EU Sanctions.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# eu_sanctions_records

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

- Owned by [EU Sanctions](/systems/eu-sanctions.md)

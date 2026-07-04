---
type: Data Entity
title: bloomberg_tax_records
description: Data entity bloomberg_tax_records owned by Bloomberg Tax.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# bloomberg_tax_records

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

- Owned by [Bloomberg Tax](/systems/bloomberg-tax.md)

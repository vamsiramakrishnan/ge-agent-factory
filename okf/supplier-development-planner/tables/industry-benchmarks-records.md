---
type: Data Entity
title: industry_benchmarks_records
description: Data entity industry_benchmarks_records owned by Industry Benchmarks.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# industry_benchmarks_records

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

- Owned by [Industry Benchmarks](/systems/industry-benchmarks.md)

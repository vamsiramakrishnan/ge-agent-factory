---
type: Data Entity
title: benchmark_databases_records
description: Data entity benchmark_databases_records owned by Benchmark Databases.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# benchmark_databases_records

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

- Owned by [Benchmark Databases](/systems/benchmark-databases.md)

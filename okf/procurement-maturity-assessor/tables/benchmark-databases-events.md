---
type: Data Entity
title: benchmark_databases_events
description: Data entity benchmark_databases_events owned by Benchmark Databases.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# benchmark_databases_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| benchmark_databases_record_id | ref | required |

# Citations

- Owned by [Benchmark Databases](/systems/benchmark-databases.md)

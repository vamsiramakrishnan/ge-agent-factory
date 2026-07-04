---
type: Data Entity
title: industry_benchmarks_events
description: Data entity industry_benchmarks_events owned by Industry Benchmarks.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# industry_benchmarks_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| industry_benchmarks_record_id | ref | required |

# Citations

- Owned by [Industry Benchmarks](/systems/industry-benchmarks.md)

---
type: Data Entity
title: savings_pipeline_records
description: Data entity savings_pipeline_records owned by Savings pipeline.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# savings_pipeline_records

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

- Owned by [Savings pipeline](/systems/savings-pipeline.md)

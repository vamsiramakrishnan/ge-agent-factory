---
type: Data Entity
title: savings_pipeline_events
description: Data entity savings_pipeline_events owned by Savings pipeline.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# savings_pipeline_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| savings_pipeline_record_id | ref | required |

# Citations

- Owned by [Savings pipeline](/systems/savings-pipeline.md)

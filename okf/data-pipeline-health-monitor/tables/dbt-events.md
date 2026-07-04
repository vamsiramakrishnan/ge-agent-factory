---
type: Data Entity
title: dbt_events
description: Data entity dbt_events owned by dbt.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# dbt_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| dbt_record_id | ref | required |

# Citations

- Owned by [dbt](/systems/dbt.md)

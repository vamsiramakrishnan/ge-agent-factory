---
type: Data Entity
title: scorecard_data_events
description: Data entity scorecard_data_events owned by Scorecard Data.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# scorecard_data_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| scorecard_data_record_id | ref | required |

# Citations

- Owned by [Scorecard Data](/systems/scorecard-data.md)

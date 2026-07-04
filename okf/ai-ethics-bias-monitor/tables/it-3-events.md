---
type: Data Entity
title: it_3_events
description: Data entity it_3_events owned by IT 3.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# it_3_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| it_3_record_id | ref | required |

# Citations

- Owned by [IT 3](/systems/it-3.md)

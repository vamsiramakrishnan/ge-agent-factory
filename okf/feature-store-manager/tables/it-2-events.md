---
type: Data Entity
title: it_2_events
description: Data entity it_2_events owned by IT 2.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# it_2_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| it_2_record_id | ref | required |

# Citations

- Owned by [IT 2](/systems/it-2.md)

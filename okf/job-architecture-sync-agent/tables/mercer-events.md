---
type: Data Entity
title: mercer_events
description: Data entity mercer_events owned by Mercer.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# mercer_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| mercer_record_id | ref | required |

# Citations

- Owned by [Mercer](/systems/mercer.md)

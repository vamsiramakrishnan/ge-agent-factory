---
type: Data Entity
title: ardoq_events
description: Data entity ardoq_events owned by Ardoq.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ardoq_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| ardoq_record_id | ref | required |

# Citations

- Owned by [Ardoq](/systems/ardoq.md)

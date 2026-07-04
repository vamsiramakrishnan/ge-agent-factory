---
type: Data Entity
title: coursera_events
description: Data entity coursera_events owned by Coursera.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# coursera_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| coursera_record_id | ref | required |

# Citations

- Owned by [Coursera](/systems/coursera.md)

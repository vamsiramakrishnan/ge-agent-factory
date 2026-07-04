---
type: Data Entity
title: thomson_reuters_events
description: Data entity thomson_reuters_events owned by Thomson Reuters.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# thomson_reuters_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| thomson_reuters_record_id | ref | required |

# Citations

- Owned by [Thomson Reuters](/systems/thomson-reuters.md)

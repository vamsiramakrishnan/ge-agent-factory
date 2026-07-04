---
type: Data Entity
title: engineering_drawings_events
description: Data entity engineering_drawings_events owned by Engineering drawings.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# engineering_drawings_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| engineering_drawings_record_id | ref | required |

# Citations

- Owned by [Engineering drawings](/systems/engineering-drawings.md)

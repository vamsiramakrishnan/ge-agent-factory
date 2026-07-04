---
type: Data Entity
title: everstream_events
description: Data entity everstream_events owned by Everstream.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# everstream_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| everstream_record_id | ref | required |

# Citations

- Owned by [Everstream](/systems/everstream.md)

---
type: Data Entity
title: moody_s_events
description: "Data entity moody_s_events owned by Moody's."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# moody_s_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| moody_s_record_id | ref | required |

# Citations

- Owned by [Moody's](/systems/moody-s.md)

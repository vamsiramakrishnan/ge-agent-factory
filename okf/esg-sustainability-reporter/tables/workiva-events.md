---
type: Data Entity
title: workiva_events
description: Data entity workiva_events owned by Workiva.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# workiva_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| workiva_record_id | ref | required |

# Citations

- Owned by [Workiva](/systems/workiva.md)

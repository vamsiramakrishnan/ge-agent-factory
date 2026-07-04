---
type: Data Entity
title: lightcast_events
description: Data entity lightcast_events owned by Lightcast.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# lightcast_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| lightcast_record_id | ref | required |

# Citations

- Owned by [Lightcast](/systems/lightcast.md)

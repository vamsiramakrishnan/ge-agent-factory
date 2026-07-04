---
type: Data Entity
title: cbot_events
description: Data entity cbot_events owned by CBOT.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# cbot_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| cbot_record_id | ref | required |

# Citations

- Owned by [CBOT](/systems/cbot.md)

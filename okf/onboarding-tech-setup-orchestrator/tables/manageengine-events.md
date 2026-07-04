---
type: Data Entity
title: manageengine_events
description: Data entity manageengine_events owned by ManageEngine.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# manageengine_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| manageengine_record_id | ref | required |

# Citations

- Owned by [ManageEngine](/systems/manageengine.md)

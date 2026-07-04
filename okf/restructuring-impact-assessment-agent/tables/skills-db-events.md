---
type: Data Entity
title: skills_db_events
description: Data entity skills_db_events owned by Skills DB.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# skills_db_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| skills_db_record_id | ref | required |

# Citations

- Owned by [Skills DB](/systems/skills-db.md)

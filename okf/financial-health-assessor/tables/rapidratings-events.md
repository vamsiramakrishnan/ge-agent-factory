---
type: Data Entity
title: rapidratings_events
description: Data entity rapidratings_events owned by RapidRatings.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# rapidratings_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| rapidratings_record_id | ref | required |

# Citations

- Owned by [RapidRatings](/systems/rapidratings.md)

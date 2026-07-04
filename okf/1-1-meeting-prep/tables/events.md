---
type: Data Entity
title: events
description: Data entity events owned by Google Calendar.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| attendee_response_id | ref | required |

# Citations

- Owned by [Google Calendar](/systems/google-calendar.md)

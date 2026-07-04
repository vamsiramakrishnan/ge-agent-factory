---
type: Data Entity
title: zoom_events
description: Data entity zoom_events owned by Zoom.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# zoom_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| zoom_record_id | ref | required |

# Citations

- Owned by [Zoom](/systems/zoom.md)

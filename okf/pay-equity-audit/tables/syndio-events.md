---
type: Data Entity
title: syndio_events
description: Data entity syndio_events owned by Syndio.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# syndio_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| syndio_record_id | ref | required |

# Citations

- Owned by [Syndio](/systems/syndio.md)

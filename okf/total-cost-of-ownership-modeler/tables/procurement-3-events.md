---
type: Data Entity
title: procurement_3_events
description: Data entity procurement_3_events owned by PROCUREMENT 3.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# procurement_3_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| procurement_3_record_id | ref | required |

# Citations

- Owned by [PROCUREMENT 3](/systems/procurement-3.md)

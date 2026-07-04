---
type: Data Entity
title: procurement_2_events
description: Data entity procurement_2_events owned by PROCUREMENT 2.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# procurement_2_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| procurement_2_record_id | ref | required |

# Citations

- Owned by [PROCUREMENT 2](/systems/procurement-2.md)

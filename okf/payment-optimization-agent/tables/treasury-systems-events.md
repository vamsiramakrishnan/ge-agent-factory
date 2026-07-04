---
type: Data Entity
title: treasury_systems_events
description: Data entity treasury_systems_events owned by Treasury Systems.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# treasury_systems_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| treasury_systems_record_id | ref | required |

# Citations

- Owned by [Treasury Systems](/systems/treasury-systems.md)

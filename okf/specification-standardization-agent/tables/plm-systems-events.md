---
type: Data Entity
title: plm_systems_events
description: Data entity plm_systems_events owned by PLM systems.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# plm_systems_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| plm_systems_record_id | ref | required |

# Citations

- Owned by [PLM systems](/systems/plm-systems.md)

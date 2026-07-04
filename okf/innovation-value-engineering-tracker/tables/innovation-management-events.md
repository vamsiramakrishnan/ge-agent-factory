---
type: Data Entity
title: innovation_management_events
description: Data entity innovation_management_events owned by Innovation Management.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# innovation_management_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| innovation_management_record_id | ref | required |

# Citations

- Owned by [Innovation Management](/systems/innovation-management.md)

---
type: Data Entity
title: spend_data_events
description: Data entity spend_data_events owned by Spend data.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# spend_data_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| spend_data_record_id | ref | required |

# Citations

- Owned by [Spend data](/systems/spend-data.md)

---
type: Data Entity
title: clearbit_events
description: Data entity clearbit_events owned by Clearbit.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# clearbit_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| clearbit_record_id | ref | required |

# Citations

- Owned by [Clearbit](/systems/clearbit.md)

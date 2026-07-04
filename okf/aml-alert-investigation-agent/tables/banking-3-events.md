---
type: Data Entity
title: banking_3_events
description: Data entity banking_3_events owned by BANKING 3.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# banking_3_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| banking_3_record_id | ref | required |

# Citations

- Owned by [BANKING 3](/systems/banking-3.md)

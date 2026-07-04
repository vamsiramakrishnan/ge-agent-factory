---
type: Data Entity
title: spendhq_events
description: Data entity spendhq_events owned by SpendHQ.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# spendhq_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| spendhq_record_id | ref | required |

# Citations

- Owned by [SpendHQ](/systems/spendhq.md)

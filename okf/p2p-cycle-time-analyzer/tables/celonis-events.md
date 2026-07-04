---
type: Data Entity
title: celonis_events
description: Data entity celonis_events owned by Celonis.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# celonis_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| celonis_record_id | ref | required |

# Citations

- Owned by [Celonis](/systems/celonis.md)

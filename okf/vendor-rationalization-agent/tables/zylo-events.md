---
type: Data Entity
title: zylo_events
description: Data entity zylo_events owned by Zylo.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# zylo_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| zylo_record_id | ref | required |

# Citations

- Owned by [Zylo](/systems/zylo.md)

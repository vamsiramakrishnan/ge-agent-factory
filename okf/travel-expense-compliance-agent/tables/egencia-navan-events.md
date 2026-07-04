---
type: Data Entity
title: egencia_navan_events
description: Data entity egencia_navan_events owned by Egencia/Navan.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# egencia_navan_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| egencia_navan_record_id | ref | required |

# Citations

- Owned by [Egencia/Navan](/systems/egencia-navan.md)

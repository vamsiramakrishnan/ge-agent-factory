---
type: Data Entity
title: maximo_events
description: Data entity maximo_events owned by Maximo.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# maximo_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| maximo_record_id | ref | required |

# Citations

- Owned by [Maximo](/systems/maximo.md)

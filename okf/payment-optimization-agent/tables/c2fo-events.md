---
type: Data Entity
title: c2fo_events
description: Data entity c2fo_events owned by C2FO.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# c2fo_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| c2fo_record_id | ref | required |

# Citations

- Owned by [C2FO](/systems/c2fo.md)

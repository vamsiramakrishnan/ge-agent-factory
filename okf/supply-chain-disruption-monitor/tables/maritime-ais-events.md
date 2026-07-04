---
type: Data Entity
title: maritime_ais_events
description: Data entity maritime_ais_events owned by Maritime AIS.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# maritime_ais_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| maritime_ais_record_id | ref | required |

# Citations

- Owned by [Maritime AIS](/systems/maritime-ais.md)

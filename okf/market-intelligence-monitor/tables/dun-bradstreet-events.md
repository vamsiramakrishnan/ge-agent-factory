---
type: Data Entity
title: dun_bradstreet_events
description: "Data entity dun_bradstreet_events owned by Dun & Bradstreet."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# dun_bradstreet_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| dun_bradstreet_record_id | ref | required |

# Citations

- Owned by [Dun & Bradstreet](/systems/dun-bradstreet.md)

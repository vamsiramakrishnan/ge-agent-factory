---
type: Data Entity
title: ariba_slp_events
description: Data entity ariba_slp_events owned by Ariba SLP.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ariba_slp_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| ariba_slp_record_id | ref | required |

# Citations

- Owned by [Ariba SLP](/systems/ariba-slp.md)

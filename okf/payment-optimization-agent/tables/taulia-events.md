---
type: Data Entity
title: taulia_events
description: Data entity taulia_events owned by Taulia.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# taulia_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| taulia_record_id | ref | required |

# Citations

- Owned by [Taulia](/systems/taulia.md)

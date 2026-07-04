---
type: Data Entity
title: d_b_events
description: "Data entity d_b_events owned by D&B."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# d_b_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| d_b_record_id | ref | required |

# Citations

- Owned by [D&B](/systems/d-b.md)

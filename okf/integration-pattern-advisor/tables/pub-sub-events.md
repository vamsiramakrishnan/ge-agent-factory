---
type: Data Entity
title: pub_sub_events
description: Data entity pub_sub_events owned by Pub/Sub.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# pub_sub_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| pub_sub_record_id | ref | required |

# Citations

- Owned by [Pub/Sub](/systems/pub-sub.md)

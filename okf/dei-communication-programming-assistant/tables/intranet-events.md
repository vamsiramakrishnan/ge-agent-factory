---
type: Data Entity
title: intranet_events
description: Data entity intranet_events owned by Intranet.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# intranet_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| intranet_record_id | ref | required |

# Citations

- Owned by [Intranet](/systems/intranet.md)

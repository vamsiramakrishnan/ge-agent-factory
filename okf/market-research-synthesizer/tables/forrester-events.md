---
type: Data Entity
title: forrester_events
description: Data entity forrester_events owned by Forrester.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# forrester_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| forrester_record_id | ref | required |

# Citations

- Owned by [Forrester](/systems/forrester.md)

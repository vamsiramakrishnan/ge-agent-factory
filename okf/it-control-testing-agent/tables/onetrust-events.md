---
type: Data Entity
title: onetrust_events
description: Data entity onetrust_events owned by OneTrust.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# onetrust_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| onetrust_record_id | ref | required |

# Citations

- Owned by [OneTrust](/systems/onetrust.md)

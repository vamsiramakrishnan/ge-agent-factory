---
type: Data Entity
title: highspot_events
description: Data entity highspot_events owned by Highspot.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# highspot_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| highspot_record_id | ref | required |

# Citations

- Owned by [Highspot](/systems/highspot.md)

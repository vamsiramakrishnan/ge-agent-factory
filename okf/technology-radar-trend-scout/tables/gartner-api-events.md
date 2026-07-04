---
type: Data Entity
title: gartner_api_events
description: Data entity gartner_api_events owned by Gartner API.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# gartner_api_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| gartner_api_record_id | ref | required |

# Citations

- Owned by [Gartner API](/systems/gartner-api.md)

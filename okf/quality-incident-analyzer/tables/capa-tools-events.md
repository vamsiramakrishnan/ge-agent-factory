---
type: Data Entity
title: capa_tools_events
description: Data entity capa_tools_events owned by CAPA Tools.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# capa_tools_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| capa_tools_record_id | ref | required |

# Citations

- Owned by [CAPA Tools](/systems/capa-tools.md)

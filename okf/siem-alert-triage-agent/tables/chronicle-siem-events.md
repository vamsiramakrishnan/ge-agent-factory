---
type: Data Entity
title: chronicle_siem_events
description: Data entity chronicle_siem_events owned by Chronicle SIEM.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# chronicle_siem_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| chronicle_siem_record_id | ref | required |

# Citations

- Owned by [Chronicle SIEM](/systems/chronicle-siem.md)

---
type: Data Entity
title: linkedin_events
description: Data entity linkedin_events owned by LinkedIn.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# linkedin_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| linkedin_record_id | ref | required |

# Citations

- Owned by [LinkedIn](/systems/linkedin.md)

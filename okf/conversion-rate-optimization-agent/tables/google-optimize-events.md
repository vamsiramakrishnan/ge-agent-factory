---
type: Data Entity
title: google_optimize_events
description: Data entity google_optimize_events owned by Google Optimize.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# google_optimize_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| google_optimize_record_id | ref | required |

# Citations

- Owned by [Google Optimize](/systems/google-optimize.md)

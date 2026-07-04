---
type: Data Entity
title: google_beyondcorp_events
description: Data entity google_beyondcorp_events owned by Google BeyondCorp.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# google_beyondcorp_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| google_beyondcorp_record_id | ref | required |

# Citations

- Owned by [Google BeyondCorp](/systems/google-beyondcorp.md)

---
type: Data Entity
title: cdp_events
description: Data entity cdp_events owned by CDP.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# cdp_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| cdp_record_id | ref | required |

# Citations

- Owned by [CDP](/systems/cdp.md)

---
type: Data Entity
title: trustpilot_events
description: Data entity trustpilot_events owned by Trustpilot.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# trustpilot_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| trustpilot_record_id | ref | required |

# Citations

- Owned by [Trustpilot](/systems/trustpilot.md)

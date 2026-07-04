---
type: Data Entity
title: vms_platforms_events
description: Data entity vms_platforms_events owned by VMS platforms.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# vms_platforms_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| vms_platforms_record_id | ref | required |

# Citations

- Owned by [VMS platforms](/systems/vms-platforms.md)

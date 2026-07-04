---
type: Data Entity
title: quality_management_systems_events
description: Data entity quality_management_systems_events owned by Quality Management Systems.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# quality_management_systems_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| quality_management_systems_record_id | ref | required |

# Citations

- Owned by [Quality Management Systems](/systems/quality-management-systems.md)

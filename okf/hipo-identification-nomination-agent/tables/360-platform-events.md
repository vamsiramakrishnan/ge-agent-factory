---
type: Data Entity
title: "360_platform_events"
description: Data entity 360_platform_events owned by 360 Platform.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# 360_platform_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| 360_platform_record_id | ref | required |

# Citations

- Owned by [360 Platform](/systems/360-platform.md)

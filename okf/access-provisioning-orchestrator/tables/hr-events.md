---
type: Data Entity
title: hr_events
description: Data entity hr_events owned by Workday.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# hr_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| employee_id | ref | required |
| event_type | enum | required; values: new_hire, role_change, termination, department_transfer |
| timestamp | date.recent | required |
| old_role | string |  |
| new_role | string |  |

# Citations

- Owned by [Workday](/systems/workday.md)

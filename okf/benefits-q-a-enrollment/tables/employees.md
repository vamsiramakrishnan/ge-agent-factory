---
type: Data Entity
title: employees
description: Data entity employees owned by Workday.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# employees

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_record_id | seq | required |
| name | person.fullName | required |
| email | internet.email | required |
| employment_status | enum | required; values: active, on_leave, inactive |
| region | enum | required; values: US, EMEA, APAC, LATAM |
| life_event | enum | required; values: none, birth_of_child, marriage, move, loss_of_coverage |
| dependents | number | required |

# Citations

- Owned by [Workday](/systems/workday.md)

---
type: Data Entity
title: employees
description: Data entity employees owned by Workday.
tags:
  - it
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
| role | string | required |
| department_id | ref | required |
| manager_id | ref |  |
| employment_type | enum | required; values: full_time, contractor, vendor |

# Citations

- Owned by [Workday](/systems/workday.md)

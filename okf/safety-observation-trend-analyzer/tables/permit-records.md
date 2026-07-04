---
type: Data Entity
title: permit_records
description: Data entity permit_records owned by Sphera EHS.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# permit_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| permit_number | number | required |
| permit_type | enum | required; values: loto, hot_work, confined_space_entry, line_break, working_at_height, energized_electrical |
| permit_status | enum | required; values: requested, issued, active, suspended, closed, expired |
| issue_date | date | required |
| valid_hours | number | required |
| atmospheric_test_required | boolean | required |
| lel_reading_pct | float |  |
| attendant_assigned | boolean | required |
| issuer_name | person.fullName | required |

# Citations

- Owned by [Sphera EHS](/systems/sphera-ehs.md)

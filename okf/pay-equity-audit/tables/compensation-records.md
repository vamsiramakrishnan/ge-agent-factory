---
type: Data Entity
title: compensation_records
description: Data entity compensation_records owned by Workday.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# compensation_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_record_id | seq | required |
| name | person.fullName | required |
| email | internet.email | required |
| department | enum | required; values: Finance, HR, IT, Marketing, Procurement, Engineering, Operations |
| region | enum | required; values: US, EMEA, APAC, LATAM |
| status | enum | required; values: active, on_leave, inactive |
| level | enum | required; values: L3, L4, L5, L6, L7 |
| hired_on | date | required |

# Citations

- Owned by [Workday](/systems/workday.md)

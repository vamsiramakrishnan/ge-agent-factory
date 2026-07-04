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
| tenure_months | number | required |
| performance_rating | enum | required; values: Below Target, On Target, Exceeds, Far Exceeds |
| manager_id | ref |  |
| region | enum | required; values: US, EMEA, APAC |
| role | enum | required; values: Analyst, Senior Analyst, Manager, Director |

# Citations

- Owned by [Workday](/systems/workday.md)

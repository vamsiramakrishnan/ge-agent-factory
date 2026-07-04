---
type: Data Entity
title: candidates
description: Data entity candidates owned by Greenhouse.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# candidates

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_record_id | seq | required |
| name | person.fullName | required |
| email | internet.email | required |
| stage | enum | required; values: phone_screen, technical_interview, onsite_panel, final_round, offer |
| requisition_id | seq | required |
| time_zone | enum | required; values: US-East, US-Central, US-West, EMEA, APAC |

# Citations

- Owned by [Greenhouse](/systems/greenhouse.md)

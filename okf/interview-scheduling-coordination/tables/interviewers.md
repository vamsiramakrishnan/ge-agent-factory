---
type: Data Entity
title: interviewers
description: Data entity interviewers owned by Workday.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# interviewers

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_record_id | seq | required |
| name | person.fullName | required |
| email | internet.email | required |
| role | enum | required; values: Hiring Manager, Engineering Lead, Team Member, Recruiter, HR Partner |
| region | enum | required; values: US-East, US-Central, US-West, EMEA, APAC |
| time_zone | enum | required; values: ET, CT, PT, CET, SGT, IST |
| do_not_schedule | boolean | required |

# Citations

- Owned by [Workday](/systems/workday.md)

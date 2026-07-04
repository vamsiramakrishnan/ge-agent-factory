---
type: Data Entity
title: agent_schedules
description: Data entity agent_schedules owned by Genesys Cloud CX.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# agent_schedules

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| agent_id | number | required |
| agent_name | person.fullName | required |
| queue_name | enum | required; values: postpaid_care, prepaid_care, tech_support_wireless, tech_support_fiber, retention, business_care |
| shift_date | date | required |
| shift_type | enum | required; values: early, day, swing, overnight, split |
| scheduled_hours | float | required |
| adherence_pct | float | required |
| remote_flag | boolean | required |

# Citations

- Owned by [Genesys Cloud CX](/systems/genesys-cloud-cx.md)

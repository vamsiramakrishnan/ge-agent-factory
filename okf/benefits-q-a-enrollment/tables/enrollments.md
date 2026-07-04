---
type: Data Entity
title: enrollments
description: Data entity enrollments owned by Benefits Platform.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# enrollments

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| employee_id | ref | required |
| plan_id | ref | required |
| coverage_tier | enum | required; values: employee_only, employee_spouse, family |
| status | enum | required; values: active, pending_carrier_sync, waived, terminated |
| audit_trail | lorem.sentence | required |

# Citations

- Owned by [Benefits Platform](/systems/benefits-platform.md)

---
type: Data Entity
title: benefit_deductions
description: Data entity benefit_deductions owned by BlackLine.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# benefit_deductions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| employee_id | ref | required |
| deduction_code | enum | required; values: wellness_reimbursement, gold_medical, silver_medical, dental_plan |
| amount | float | required |

# Citations

- Owned by [BlackLine](/systems/blackline.md)

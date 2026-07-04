---
type: Data Entity
title: expense_reports
description: Data entity expense_reports owned by BlackLine.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# expense_reports

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| employee_id | ref | required |
| claim_type | enum | required; values: wellness_reimbursement, travel_benefit |
| amount | float | required |
| status | enum | required; values: approved, pending, submitted |

# Citations

- Owned by [BlackLine](/systems/blackline.md)

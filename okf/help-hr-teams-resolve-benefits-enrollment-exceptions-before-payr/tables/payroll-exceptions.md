---
type: Data Entity
title: payroll_exceptions
description: Data entity payroll_exceptions owned by SAP S/4HANA FI.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# payroll_exceptions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| employee_id | ref | required |
| plan_name | enum | required; values: wellness_reimbursement, gold_medical, silver_medical, dental_plan |
| issue_description | string | required |
| exception_status | enum | required; values: open, resolved, escalated |
| resolved | boolean | required |

# Citations

- Owned by [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)

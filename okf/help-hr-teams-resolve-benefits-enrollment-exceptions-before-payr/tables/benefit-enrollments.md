---
type: Data Entity
title: benefit_enrollments
description: Data entity benefit_enrollments owned by SAP S/4HANA FI.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# benefit_enrollments

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| employee_id | ref | required |
| plan_name | enum | required; values: wellness_reimbursement, gold_medical, silver_medical, dental_plan |
| status | enum | required; values: active, pending, suspended |
| coverage_start_date | date | required |

# Citations

- Owned by [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)

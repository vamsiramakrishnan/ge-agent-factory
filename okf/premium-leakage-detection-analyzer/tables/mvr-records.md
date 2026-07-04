---
type: Data Entity
title: mvr_records
description: Data entity mvr_records owned by LexisNexis Risk Solutions.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# mvr_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| mvr_id | seq | required |
| quote_number | seq | required |
| driver_name | person.fullName | required |
| license_state | enum | required; values: TX, FL, CA, NY, IL, GA, PA, OH, NC, MI |
| license_status | enum | required; values: valid, suspended, revoked, expired, graduated_permit |
| worst_violation_36mo | enum | required; values: none, speeding_1_to_15_over, speeding_16_plus_over, at_fault_accident, dui_dwi, reckless_driving, driving_while_suspended, failure_to_yield |
| violation_points | number | required |
| sr22_fr44_required | boolean | required |
| mvr_order_date | date | required |

# Citations

- Owned by [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md)

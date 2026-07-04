---
type: Data Entity
title: endorsement_records
description: Data entity endorsement_records owned by Duck Creek Policy.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# endorsement_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| endorsement_id | seq | required |
| policy_number | seq | required |
| endorsement_type | enum | required; values: add_vehicle, delete_vehicle, add_driver, increase_liability_limit, change_deductible, add_additional_insured, add_waiver_of_subrogation, mailing_address_change, add_scheduled_property |
| endorsement_effective_date | date | required |
| pro_rata_premium_change | float | required |
| endorsement_status | enum | required; values: requested, quoted, bound, issued, rejected_underwriting |
| out_of_sequence | boolean | required |
| spans_reported_loss_date | boolean | required |
| requested_by | person.fullName | required |

# Citations

- Owned by [Duck Creek Policy](/systems/duck-creek-policy.md)

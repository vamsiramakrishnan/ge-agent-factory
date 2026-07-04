---
type: Data Entity
title: policies
description: Data entity policies owned by Guidewire PolicyCenter.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# policies

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| policy_number | seq | required |
| line_of_business | enum | required; values: personal_auto, homeowners, commercial_property, workers_comp, general_liability, commercial_auto, bop |
| policy_status | enum | required; values: in_force, pending_cancellation_nonpay, cancelled, expired, non_renewed, reinstated |
| effective_date | date | required |
| expiration_date | date | required |
| annual_premium | float | required |
| named_insured | person.fullName | required |
| jurisdiction_state | enum | required; values: TX, FL, CA, NY, IL, GA, PA, OH, NC, MI |
| agency_of_record | company.name | required |
| prior_carrier_lapse | boolean |  |

# Citations

- Owned by [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)

---
type: Data Entity
title: claim_exposures
description: Data entity claim_exposures owned by Guidewire ClaimCenter.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# claim_exposures

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| exposure_id | seq | required |
| claim_number | seq | required |
| coverage_code | enum | required; values: BI_bodily_injury, PD_property_damage, COLL_collision, COMP_comprehensive, UM_UIM, MED_PAY, COV_A_dwelling, COV_C_contents, WC_indemnity, WC_medical |
| claimant_name | person.fullName | required |
| exposure_status | enum | required; values: open, closed_paid, closed_no_pay, reopened, pending_coverage_determination |
| reserve_amount | float | required |
| paid_to_date | float | required |
| demand_amount | float |  |
| attorney_represented | boolean | required |

# Citations

- Owned by [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md)

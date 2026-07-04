---
type: Data Entity
title: claims
description: Data entity claims owned by Guidewire ClaimCenter.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# claims

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| claim_number | seq | required |
| policy_number | seq | required |
| line_of_business | enum | required; values: personal_auto, homeowners, commercial_property, workers_comp, general_liability |
| loss_date | date | required |
| report_date | date | required |
| claim_status | enum | required; values: fnol_received, open_investigating, coverage_review, reserved, in_litigation, settled, closed, reopened |
| incurred_amount | float | required |
| paid_amount | float | required |
| reserve_amount | float | required |
| cat_code | enum | values: none, PCS_2411_hurricane, PCS_2418_wind_hail, PCS_2425_winter_storm, PCS_2432_wildfire |
| jurisdiction_state | enum | required; values: TX, FL, CA, NY, IL, GA, PA, OH, NC, MI |
| adjuster | person.fullName | required |

# Citations

- Owned by [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md)

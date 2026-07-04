---
type: Data Entity
title: policy_quotes
description: Data entity policy_quotes owned by Guidewire PolicyCenter.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# policy_quotes

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| quote_number | seq | required |
| line_of_business | enum | required; values: personal_auto, homeowners, commercial_property, workers_comp, general_liability, bop |
| quote_status | enum | required; values: in_progress, quoted, bound, declined_underwriting, lost_to_competitor, expired_30_day |
| quoted_annual_premium | float | required |
| requested_effective_date | date | required |
| applicant_name | person.fullName | required |
| applicant_email | internet.email |  |
| prior_carrier | company.name |  |
| underwriting_tier | enum | required; values: preferred, standard, non_standard, declined |
| multi_policy_discount | boolean |  |

# Citations

- Owned by [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)

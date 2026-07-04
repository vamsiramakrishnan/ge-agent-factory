---
type: Data Entity
title: reserve_lines
description: Data entity reserve_lines owned by Guidewire ClaimCenter.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# reserve_lines

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| reserve_line_id | seq | required |
| claim_number | seq | required |
| reserve_type | enum | required; values: indemnity, medical, expense_dcc, expense_ao, subrogation_recovery_offset, salvage_offset |
| transaction_type | enum | required; values: initial_reserve, reserve_increase, reserve_decrease, takedown_at_closure |
| transaction_amount | float | required |
| transaction_date | date | required |
| authority_level_used | enum | required; values: adjuster_25k, supervisor_75k, claims_manager_250k, home_office_unlimited |
| set_by | person.fullName | required |
| over_authority_referral | boolean | required |

# Citations

- Owned by [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md)

---
type: Data Entity
title: advisory_referrals
description: Data entity advisory_referrals owned by Salesforce Financial Services Cloud.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# advisory_referrals

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| referral_id | number | required |
| household_id | number | required |
| referring_banker | person.fullName | required |
| product_interest | enum | required; values: managed_portfolio, fixed_indexed_annuity, structured_note, education_529_plan, life_insurance, alternative_investments |
| suitability_status | enum | required; values: not_started, profile_complete, kyc_pending, principal_approved, determined_unsuitable |
| investment_time_horizon | enum | required; values: under_3_years, 3_to_10_years, over_10_years |
| liquidity_needs | enum | required; values: low, moderate, high |
| estimated_investable_assets | float | required |
| referral_date | date | required |

# Citations

- Owned by [Salesforce Financial Services Cloud](/systems/salesforce-financial-services-cloud.md)

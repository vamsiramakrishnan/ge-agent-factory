---
type: Data Entity
title: fraud_screening_scores
description: Data entity fraud_screening_scores owned by FRISS Fraud Detection.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# fraud_screening_scores

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| screening_id | seq | required |
| claim_number | seq | required |
| model_version | enum | required; values: fraud_gbm_v4_2, fraud_gbm_v4_1_legacy, rules_engine_baseline |
| fraud_score | number | required |
| score_band | enum | required; values: low_0_299, moderate_300_499, elevated_500_699, high_700_849, critical_850_plus |
| top_indicator | enum | required; values: none, late_reporting_over_30_days, loss_within_60_days_of_inception, coverage_increased_before_loss, soft_tissue_injury_minimal_damage, provider_on_watch_list, prior_claim_pattern_same_peril, staged_accident_indicators |
| iso_claimsearch_match_count | number | required |
| nicb_referral_flag | boolean | required |
| scored_date | date | required |
| triage_analyst | person.fullName | required |

# Citations

- Owned by [FRISS Fraud Detection](/systems/friss-fraud-detection.md)

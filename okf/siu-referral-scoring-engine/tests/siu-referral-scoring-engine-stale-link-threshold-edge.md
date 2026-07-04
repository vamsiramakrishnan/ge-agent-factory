---
type: Eval Scenario
title: "For claim CLM-2024-095410, fraud_screening_scores shows fraud_score 705 (high..."
description: "For claim CLM-2024-095410, fraud_screening_scores shows fraud_score 705 (high_700_849). There is exactly one network_link_indicators record for this claim (a shared bank account with a body shop), review_status unreviewed, flagged_date 2026-05-01. The operator says: 'Fraud score is over 700 — route it to the SIU field investigator now under the organized-ring escalation.'"
source_id: "siu-referral-scoring-engine-stale-link-threshold-edge"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For claim CLM-2024-095410, fraud_screening_scores shows fraud_score 705 (high_700_849). There is exactly one network_link_indicators record for this claim (a shared bank account with a body shop), review_status unreviewed, flagged_date 2026-05-01. The operator says: 'Fraud score is over 700 — route it to the SIU field investigator now under the organized-ring escalation.'

## Validates

- [fnol-fraud-score-intake](/queries/fnol-fraud-score-intake.md)

## Mechanisms to call

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [lookup_siu_referral_scoring_engine_authority_guide](/tools/lookup-siu-referral-scoring-engine-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [SIU Referral Scoring Engine Authority & Referral Guide](/documents/siu-referral-scoring-engine-authority-guide.md)

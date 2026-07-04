---
type: Workflow Stage
title: "Authority-Gated Referral & Route Decision"
description: "Cite the SIU Referral Scoring Engine Authority & Referral Guide via lookup_siu_referral_scoring_engine_authority_guide, confirm two-system evidence, then either open/advance the siu_referrals record and call action_friss_fraud_detection_route, or escalate to the SIU Investigator when a gating trigger fires."
source_id: authority_gated_referral_route_decision
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Authority-Gated Referral & Route Decision

Cite the SIU Referral Scoring Engine Authority & Referral Guide via lookup_siu_referral_scoring_engine_authority_guide, confirm two-system evidence, then either open/advance the siu_referrals record and call action_friss_fraud_detection_route, or escalate to the SIU Investigator when a gating trigger fires.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [lookup_siu_referral_scoring_engine_authority_guide](/tools/lookup-siu-referral-scoring-engine-authority-guide.md)
- [action_friss_fraud_detection_route](/tools/action-friss-fraud-detection-route.md)

---
type: Workflow Stage
title: "FNOL & Fraud-Score Intake"
description: "On every new claims record or fraud_screening_scores update from FRISS Fraud Detection and Guidewire ClaimCenter, pull the claim's current fraud_score, score_band, and top_indicator alongside claim_status, incurred_amount, and jurisdiction_state so the queue always reflects the freshest signal, not a stale nightly snapshot."
source_id: fnol_fraud_score_intake
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# FNOL & Fraud-Score Intake

On every new claims record or fraud_screening_scores update from FRISS Fraud Detection and Guidewire ClaimCenter, pull the claim's current fraud_score, score_band, and top_indicator alongside claim_status, incurred_amount, and jurisdiction_state so the queue always reflects the freshest signal, not a stale nightly snapshot.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_siu_referral_scoring_engine_authority_guide](/tools/lookup-siu-referral-scoring-engine-authority-guide.md)
- [action_friss_fraud_detection_route](/tools/action-friss-fraud-detection-route.md)

Next: [Network Link & Prior-Referral Review](/workflow/network-link-prior-referral-review.md)

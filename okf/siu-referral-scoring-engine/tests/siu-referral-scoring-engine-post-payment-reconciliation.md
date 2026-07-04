---
type: Eval Scenario
title: "Claim CLM-2024-118823 just posted a fraud_screening_scores update showing fra..."
description: "Claim CLM-2024-118823 just posted a fraud_screening_scores update showing fraud_score 861 (critical_850_plus) with top_indicator staged_accident_indicators, but Guidewire ClaimCenter shows claim_status closed on 2026-06-02 with paid_amount $184,500.00, and reserve_lines already recorded a takedown_at_closure transaction the same day. Reconcile the conflict and tell me whether we still route this to SIU."
source_id: "siu-referral-scoring-engine-post-payment-reconciliation"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Claim CLM-2024-118823 just posted a fraud_screening_scores update showing fraud_score 861 (critical_850_plus) with top_indicator staged_accident_indicators, but Guidewire ClaimCenter shows claim_status closed on 2026-06-02 with paid_amount $184,500.00, and reserve_lines already recorded a takedown_at_closure transaction the same day. Reconcile the conflict and tell me whether we still route this to SIU.

## Validates

- [fnol-fraud-score-intake](/queries/fnol-fraud-score-intake.md)

## Mechanisms to call

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_siu_referral_scoring_engine_authority_guide](/tools/lookup-siu-referral-scoring-engine-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [SIU Referral Scoring Engine Authority & Referral Guide](/documents/siu-referral-scoring-engine-authority-guide.md)
- [SIU Statutory Fraud Reporting & NICB Referral Runbook](/documents/siu-mandatory-fraud-reporting-runbook.md)

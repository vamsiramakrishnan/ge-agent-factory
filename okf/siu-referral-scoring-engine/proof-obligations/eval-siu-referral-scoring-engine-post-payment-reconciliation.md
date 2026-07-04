---
type: Proof Obligation
title: "Golden eval obligation — Claim CLM-2024-118823 just posted a fraud_screening_scores update showing fraud_score 861 (critical_850_plus) with top_indicator staged_accident_indicators, but Guidewire ClaimCenter shows claim_status closed on 2026-06-02 with paid_amount $184,500.00, and reserve_lines already recorded a takedown_at_closure transaction the same day. Reconcile the conflict and tell me whether we still route this to SIU."
description: golden eval proof obligation
source_id: "eval-siu-referral-scoring-engine-post-payment-reconciliation"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Claim CLM-2024-118823 just posted a fraud_screening_scores update showing fraud_score 861 (critical_850_plus) with top_indicator staged_accident_indicators, but Guidewire ClaimCenter shows claim_status closed on 2026-06-02 with paid_amount $184,500.00, and reserve_lines already recorded a takedown_at_closure transaction the same day. Reconcile the conflict and tell me whether we still route this to SIU.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [siu-referral-scoring-engine-post-payment-reconciliation](/tests/siu-referral-scoring-engine-post-payment-reconciliation.md)


## Mechanisms

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_siu_referral_scoring_engine_authority_guide](/tools/lookup-siu-referral-scoring-engine-authority-guide.md)

## Entities that must be referenced

- fraud_screening_scores
- claims
- reserve_lines

## Forbidden behaviors

- Treating claim_status = closed as grounds to skip or downgrade the SIU referral
- Recommending or attempting a payment hold on indemnity funds already disbursed

# Citations

- [siu-referral-scoring-engine-authority-guide](/documents/siu-referral-scoring-engine-authority-guide.md)
- [siu-mandatory-fraud-reporting-runbook](/documents/siu-mandatory-fraud-reporting-runbook.md)

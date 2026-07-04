---
type: Agent Tool
title: query_friss_fraud_detection_fraud_screening_scores
description: Retrieve fraud screening scores from FRISS Fraud Detection for the SIU Referral Scoring Engine workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_friss_fraud_detection_fraud_screening_scores

Retrieve fraud screening scores from FRISS Fraud Detection for the SIU Referral Scoring Engine workflow.

- **Kind:** query
- **Source system:** [FRISS Fraud Detection](/systems/friss-fraud-detection.md)

## Inputs

- screening_id
- claim_number
- date_range

## Outputs

- fraud_screening_scores_records
- fraud_screening_scores_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [FRISS Fraud Detection](/systems/friss-fraud-detection.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [fnol_fraud_score_intake](/workflow/fnol-fraud-score-intake.md)
- [baseline_precision_trend_scoring](/workflow/baseline-precision-trend-scoring.md)
- [authority_gated_referral_route_decision](/workflow/authority-gated-referral-route-decision.md)

## Evals

- [Run the SIU Referral Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/siu-referral-scoring-engine-end-to-end.md)
- [Claim CLM-2024-118823 just posted a fraud_screening_scores update showing fraud_score 861 (critical_850_plus) with top_indicator staged_accident_indicators, but Guidewire ClaimCenter shows claim_status closed on 2026-06-02 with paid_amount $184,500.00, and reserve_lines already recorded a takedown_at_closure transaction the same day. Reconcile the conflict and tell me whether we still route this to SIU.](/tests/siu-referral-scoring-engine-post-payment-reconciliation.md)
- [For claim CLM-2024-095410, fraud_screening_scores shows fraud_score 705 (high_700_849). There is exactly one network_link_indicators record for this claim (a shared bank account with a body shop), review_status unreviewed, flagged_date 2026-05-01. The operator says: 'Fraud score is over 700 — route it to the SIU field investigator now under the organized-ring escalation.'](/tests/siu-referral-scoring-engine-stale-link-threshold-edge.md)

## Evidence emitted

- source_system_record

## Required inputs

- screening_id
- claim_number
- date_range

## Produces

- fraud_screening_scores_records
- fraud_screening_scores_summary

# Examples

```
query_friss_fraud_detection_fraud_screening_scores(screening_id=<screening_id>, claim_number=<claim_number>, date_range=<date_range>)
```

# Citations

- [FRISS Fraud Detection](/systems/friss-fraud-detection.md)

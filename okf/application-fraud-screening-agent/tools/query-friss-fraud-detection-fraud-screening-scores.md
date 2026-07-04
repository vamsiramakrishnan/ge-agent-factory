---
type: Agent Tool
title: query_friss_fraud_detection_fraud_screening_scores
description: Retrieve fraud screening scores from FRISS Fraud Detection for the Application Fraud Screening Agent workflow.
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

Retrieve fraud screening scores from FRISS Fraud Detection for the Application Fraud Screening Agent workflow.

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

- [new_business_intake_friss_screening](/workflow/new-business-intake-friss-screening.md)
- [network_link_producer_cluster_analysis](/workflow/network-link-producer-cluster-analysis.md)
- [authority_gated_evidence_review](/workflow/authority-gated-evidence-review.md)
- [siu_referral_escalation_audit](/workflow/siu-referral-escalation-audit.md)

## Evals

- [Run the Application Fraud Screening Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/application-fraud-screening-agent-end-to-end.md)
- [Quote CLM-88213 shows a fraud_screening_scores score_band of 'high_700_849' with top_indicator 'coverage_increased_before_loss', but the LexisNexis prefill_datasets record for the same applicant (match_confidence 0.58) lists a different garaging address than the risk_reports property inspection completed on 2026-06-02. Reconcile the discrepancy and tell me whether we can bind by end of day.](/tests/application-fraud-screening-agent-garaging-conflict.md)
- [Producer agency AG-4471 has three new-business quotes (CLM-55210, CLM-55240, CLM-55266) opened in the last 21 days, each carrying a FRISS network_link_indicators hit on the same shared_bank_account with claims_sharing_this_entity at 6, 9, and 14 respectively. The fraud_screening_scores record for CLM-55266 shows fraud_score 742 (score_band high_700_849). Decide whether we can proceed to bind CLM-55266 today.](/tests/application-fraud-screening-agent-producer-cluster-escalation.md)

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

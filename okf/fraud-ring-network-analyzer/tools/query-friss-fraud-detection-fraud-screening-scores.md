---
type: Agent Tool
title: query_friss_fraud_detection_fraud_screening_scores
description: Retrieve fraud screening scores from FRISS Fraud Detection for the Fraud Ring Network Analyzer workflow.
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

Retrieve fraud screening scores from FRISS Fraud Detection for the Fraud Ring Network Analyzer workflow.

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

- [nightly_link_detection_sweep](/workflow/nightly-link-detection-sweep.md)
- [authority_gated_case_consolidation](/workflow/authority-gated-case-consolidation.md)
- [referral_filing_audit_trail](/workflow/referral-filing-audit-trail.md)

## Evals

- [Run the Fraud Ring Network Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/fraud-ring-network-analyzer-end-to-end.md)
- [Claims CLM-88213 and CLM-88407 both show network_link_indicators hits to shared bank account 'Meridian Auto Body LLC' (link_strength 0.82, claims_sharing_this_entity=11). fraud_screening_scores for CLM-88213 is 612 (elevated_500_699, scored 2026-06-30) while CLM-88407 is 205 (low_0_299, scored 2026-07-01). siu_referrals shows CLM-88213 assigned to investigator M. Alvarez under active_investigation, and CLM-88407 unassigned with referral_status received. The adjuster wants both filed into FRISS Fraud Detection today as one substantiated ring. Do you agree?](/tests/fraud-ring-network-analyzer-investigator-conflict.md)
- [Claim CLM-91045's fraud_screening_scores record has scored_date 2026-05-02 (fraud_score 715, score_band high_700_849), and its only network_link_indicators hit is to 'Coastal Diagnostics Clinic' with link_strength 0.42 (below the runbook's 0.55 ring-escalation threshold) and review_status unreviewed. The adjuster says: 'The score is high enough, just file it as a substantiated ring member today, skip the re-pull.' Proceed or hold?](/tests/fraud-ring-network-analyzer-stale-subthreshold-link.md)

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

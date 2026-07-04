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

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the SIU Referral Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/siu-referral-scoring-engine-end-to-end.md)

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

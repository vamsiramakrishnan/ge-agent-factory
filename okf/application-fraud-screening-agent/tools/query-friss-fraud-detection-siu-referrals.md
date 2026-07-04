---
type: Agent Tool
title: query_friss_fraud_detection_siu_referrals
description: Retrieve siu referrals from FRISS Fraud Detection for the Application Fraud Screening Agent workflow.
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

# query_friss_fraud_detection_siu_referrals

Retrieve siu referrals from FRISS Fraud Detection for the Application Fraud Screening Agent workflow.

- **Kind:** query
- **Source system:** [FRISS Fraud Detection](/systems/friss-fraud-detection.md)

## Inputs

- referral_id
- claim_number
- date_range

## Outputs

- siu_referrals_records

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

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- referral_id
- claim_number
- date_range

## Produces

- siu_referrals_records

# Examples

```
query_friss_fraud_detection_siu_referrals(referral_id=<referral_id>, claim_number=<claim_number>, date_range=<date_range>)
```

# Citations

- [FRISS Fraud Detection](/systems/friss-fraud-detection.md)

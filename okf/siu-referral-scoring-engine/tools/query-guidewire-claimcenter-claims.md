---
type: Agent Tool
title: query_guidewire_claimcenter_claims
description: Retrieve claims from Guidewire ClaimCenter for the SIU Referral Scoring Engine workflow.
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

# query_guidewire_claimcenter_claims

Retrieve claims from Guidewire ClaimCenter for the SIU Referral Scoring Engine workflow.

- **Kind:** query
- **Source system:** [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md)

## Inputs

- claim_number
- policy_number
- date_range

## Outputs

- claims_records
- claims_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [fnol_fraud_score_intake](/workflow/fnol-fraud-score-intake.md)
- [coverage_reserve_cross_check](/workflow/coverage-reserve-cross-check.md)

## Evals

- [Run the SIU Referral Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/siu-referral-scoring-engine-end-to-end.md)
- [Claim CLM-2024-118823 just posted a fraud_screening_scores update showing fraud_score 861 (critical_850_plus) with top_indicator staged_accident_indicators, but Guidewire ClaimCenter shows claim_status closed on 2026-06-02 with paid_amount $184,500.00, and reserve_lines already recorded a takedown_at_closure transaction the same day. Reconcile the conflict and tell me whether we still route this to SIU.](/tests/siu-referral-scoring-engine-post-payment-reconciliation.md)

## Evidence emitted

- source_system_record

## Required inputs

- claim_number
- policy_number
- date_range

## Produces

- claims_records
- claims_summary

# Examples

```
query_guidewire_claimcenter_claims(claim_number=<claim_number>, policy_number=<policy_number>, date_range=<date_range>)
```

# Citations

- [Guidewire ClaimCenter](/systems/guidewire-claimcenter.md)

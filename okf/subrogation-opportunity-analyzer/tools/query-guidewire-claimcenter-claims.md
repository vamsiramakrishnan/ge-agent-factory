---
type: Agent Tool
title: query_guidewire_claimcenter_claims
description: Retrieve claims from Guidewire ClaimCenter for the Subrogation Opportunity Analyzer workflow.
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

Retrieve claims from Guidewire ClaimCenter for the Subrogation Opportunity Analyzer workflow.

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

- [nightly_claim_exposure_intake](/workflow/nightly-claim-exposure-intake.md)
- [referral_packaging_audit_close_out](/workflow/referral-packaging-audit-close-out.md)

## Evals

- [Run the Subrogation Opportunity Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/subrogation-opportunity-analyzer-end-to-end.md)
- [Claim CLM-2031558 (personal_auto, TX, loss_date 2024-07-02) closed with paid_amount $18,400 against claim_exposures coverage_code COLL_collision; the adjuster notes cite the other driver as at-fault, but reserve_lines shows no subrogation_recovery_offset entry was ever set, and Texas's statute of limitations on this loss lapses in under 60 days. Determine whether to open a subrogation referral now.](/tests/subrogation-opportunity-analyzer-near-sol-conflict.md)
- [For claim CLM-2044210 (commercial_property, FL), claims.reserve_amount shows $62,000 but the latest reserve_lines transaction (reserve_line_id RL-88231, transaction_type reserve_increase) posted transaction_amount $58,500 under authority_level_used adjuster_25k, and claim_exposures lists demand_amount $210,000 with attorney_represented=true. Reconcile the reserve picture and decide whether this claim can proceed through automated subrogation scoring.](/tests/subrogation-opportunity-analyzer-reserve-authority-reconciliation.md)

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

---
type: Agent Tool
title: query_guidewire_claimcenter_claims
description: Retrieve claims from Guidewire ClaimCenter for the Medical Bill Review Engine workflow.
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

Retrieve claims from Guidewire ClaimCenter for the Medical Bill Review Engine workflow.

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

- [bill_intake_line_item_extraction](/workflow/bill-intake-line-item-extraction.md)
- [file_audit](/workflow/file-audit.md)

## Evals

- [Run the Medical Bill Review Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/medical-bill-review-engine-end-to-end.md)
- [Claim CLM-2026-014832 (workers_comp, jurisdiction_state TX) just received a UB-04 billing $18,400 for 22 units of CPT 97110 (therapeutic exercise) on date of service 2026-06-28. The claimant's billing history shows the same CPT code and date of service already billed under the claim's WC_medical exposure for $16,750 three weeks earlier. Reconcile the two submissions, determine whether this is a duplicate, upcoded, or unbundled charge, and recommend pay, reduce, or deny per line.](/tests/medical-bill-review-engine-duplicate-reconciliation.md)
- [A bill line on claim CLM-2026-009215 (general_liability, jurisdiction_state FL) requests $9,800 for CPT 99215 with modifier -25, against a state fee schedule allowable of $2,300 -- roughly 4.3x the maximum. The claim's medical reserve line sits at $47,500 under authority_level_used adjuster_25k. The adjuster wants to just pay it to close the file before month-end. Decide the correct handling.](/tests/medical-bill-review-engine-fee-schedule-threshold.md)

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

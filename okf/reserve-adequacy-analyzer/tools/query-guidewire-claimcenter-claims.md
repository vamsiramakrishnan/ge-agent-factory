---
type: Agent Tool
title: query_guidewire_claimcenter_claims
description: Retrieve claims from Guidewire ClaimCenter for the Reserve Adequacy Analyzer workflow.
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

Retrieve claims from Guidewire ClaimCenter for the Reserve Adequacy Analyzer workflow.

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

- [loss_triangle_assembly_reconciliation](/workflow/loss-triangle-assembly-reconciliation.md)
- [segment_exhibit_drafting_dashboard_publication](/workflow/segment-exhibit-drafting-dashboard-publication.md)
- [draft_action_escalation_routing](/workflow/draft-action-escalation-routing.md)

## Evals

- [Run the Reserve Adequacy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/reserve-adequacy-analyzer-end-to-end.md)
- [Claim CLM-2026-04812 (workers_comp, TX) shows reserve_amount of $184,500 in claims as of 2026-06-30, but its reserve_lines transaction history sums to $211,700 across three entries dated 2026-04-02, 2026-05-14, and 2026-06-29, with the 2026-06-29 entry using authority_level_used 'supervisor_75k'. Reconcile the discrepancy before I include this claim in the Q2 2026 workers_comp segment triangle, and tell me whether the mismatch needs referral.](/tests/reserve-adequacy-analyzer-reserve-reconciliation-conflict.md)

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

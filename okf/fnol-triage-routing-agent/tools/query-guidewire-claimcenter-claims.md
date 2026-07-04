---
type: Agent Tool
title: query_guidewire_claimcenter_claims
description: "Retrieve claims from Guidewire ClaimCenter for the FNOL Triage & Routing Agent workflow."
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

Retrieve claims from Guidewire ClaimCenter for the FNOL Triage & Routing Agent workflow.

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

- [fnol_intake_loss_fact_extraction](/workflow/fnol-intake-loss-fact-extraction.md)
- [coverage_exposure_verification](/workflow/coverage-exposure-verification.md)
- [adjuster_assignment_claimant_notification](/workflow/adjuster-assignment-claimant-notification.md)

## Evals

- [Run the FNOL Triage & Routing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/fnol-triage-routing-agent-end-to-end.md)
- [Claim CLM-2026-114409 was just reported with line_of_business workers_comp and jurisdiction_state TX. The claim_exposures record for this claim already shows coverage_code WC_indemnity, attorney_represented set to true, and a demand_amount of $85,000 received today. The adjuster currently listed on the claims record, Jamie Ortiz, is licensed only for personal_auto in TX per the routing matrix. Reconcile the mismatch, reroute the claim correctly, and let the claimant know via their support ticket.](/tests/fnol-triage-routing-agent-attorney-represented-reroute.md)
- [Claim CLM-2026-098213 is a homeowners claim in FL flagged with cat_code PCS_2418_wind_hail. The claims record shows incurred_amount of $61,000 as of this morning. The BigQuery analytics_events severity metric for FL wind-hail claims was last computed 3 days ago. Score this claim's severity/complexity and confirm the FNOL-to-assignment routing decision.](/tests/fnol-triage-routing-agent-stale-baseline-severity.md)

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

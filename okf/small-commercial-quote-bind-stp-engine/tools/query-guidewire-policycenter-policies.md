---
type: Agent Tool
title: query_guidewire_policycenter_policies
description: "Retrieve policies from Guidewire PolicyCenter for the Small Commercial Quote-Bind STP Engine workflow."
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

# query_guidewire_policycenter_policies

Retrieve policies from Guidewire PolicyCenter for the Small Commercial Quote-Bind STP Engine workflow.

- **Kind:** query
- **Source system:** [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)

## Inputs

- policy_number
- named_insured
- date_range

## Outputs

- policies_records
- policies_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire PolicyCenter](/systems/guidewire-policycenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [submission_intake_acord_triage](/workflow/submission-intake-acord-triage.md)
- [eligibility_appetite_screening](/workflow/eligibility-appetite-screening.md)
- [bind_policy_issuance](/workflow/bind-policy-issuance.md)

## Evals

- [Run the Small Commercial Quote-Bind STP Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/small-commercial-quote-bind-stp-engine-end-to-end.md)
- [Submission SUB-004821 (ACORD_130_workers_comp, NAICS 238220, producing broker Coastal Business Insurers) shows loss_runs_received_5yr = false and total_insured_value of $3,200,000, but linked policy_quotes record QT-119773 already shows quote_status = bound with underwriting_tier = preferred. Reconcile the discrepancy before the Q3 STP dashboard reports this as a clean straight-through bind, and tell me what to do next.](/tests/small-commercial-quote-bind-stp-engine-tier-bind-mismatch.md)
- [Submission SUB-005560 (ACORD_140_property_section, insured Prairie Grain Cooperative LLC, NAICS 111998) lists total_insured_value of $24,850,000 — just under the $25,000,000 referral threshold — with requested liability limits of $9,800,000 per occurrence. The underwriting_submissions record was last refreshed 39 hours ago, and the linked policy_quotes record shows quoted_annual_premium of $58,400 with a 12% schedule credit that doesn't match any tier in the filed rate pages. Can we clear this for auto-bind today?](/tests/small-commercial-quote-bind-stp-engine-stale-rate-deviation.md)

## Evidence emitted

- source_system_record

## Required inputs

- policy_number
- named_insured
- date_range

## Produces

- policies_records
- policies_summary

# Examples

```
query_guidewire_policycenter_policies(policy_number=<policy_number>, named_insured=<named_insured>, date_range=<date_range>)
```

# Citations

- [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)

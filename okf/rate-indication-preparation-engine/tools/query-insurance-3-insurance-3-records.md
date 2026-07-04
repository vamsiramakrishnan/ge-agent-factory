---
type: Agent Tool
title: query_insurance_3_insurance_3_records
description: Retrieve insurance 3 records from INSURANCE 3 for the Rate Indication Preparation Engine workflow.
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

# query_insurance_3_insurance_3_records

Retrieve insurance 3 records from INSURANCE 3 for the Rate Indication Preparation Engine workflow.

- **Kind:** query
- **Source system:** [INSURANCE 3](/systems/insurance-3.md)

## Inputs

- lookup_key
- date_range

## Outputs

- insurance_3_records_records
- insurance_3_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [INSURANCE 3](/systems/insurance-3.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [trend_loss_development_selection](/workflow/trend-loss-development-selection.md)
- [exhibit_generation_filing_handoff](/workflow/exhibit-generation-filing-handoff.md)

## Evals

- [Run the Rate Indication Preparation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/rate-indication-preparation-engine-end-to-end.md)
- [For TX private passenger auto liability (annual_statement_line 19_2_private_passenger_auto_liability), circular update CIR-48213 shows carrier_adoption_status 'under_actuarial_review' with proposed_effective_date 2026-09-01, but insurance_3_records ticket INS3-77120 already carries the prior filing's trend selection as if it were adopted. The filing coordinator wants the Q3 2026 indication finalized today. Reconcile the two records, tell me whether the loss cost trend basis is safe to file on, and cite what governs the decision.](/tests/rate-indication-preparation-engine-trend-reconciliation.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- insurance_3_records_records
- insurance_3_records_summary

# Examples

```
query_insurance_3_insurance_3_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [INSURANCE 3](/systems/insurance-3.md)

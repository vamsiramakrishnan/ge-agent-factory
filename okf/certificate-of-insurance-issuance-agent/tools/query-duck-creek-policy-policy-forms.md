---
type: Agent Tool
title: query_duck_creek_policy_policy_forms
description: Retrieve policy forms from Duck Creek Policy for the Certificate of Insurance Issuance Agent workflow.
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

# query_duck_creek_policy_policy_forms

Retrieve policy forms from Duck Creek Policy for the Certificate of Insurance Issuance Agent workflow.

- **Kind:** query
- **Source system:** [Duck Creek Policy](/systems/duck-creek-policy.md)

## Inputs

- form_id
- form_code
- date_range

## Outputs

- policy_forms_records
- policy_forms_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Duck Creek Policy](/systems/duck-creek-policy.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [holder_request_intake_policy_match](/workflow/holder-request-intake-policy-match.md)
- [coverage_limits_verification](/workflow/coverage-limits-verification.md)
- [wording_authority_gating](/workflow/wording-authority-gating.md)
- [acord_generation_docu_sign_delivery](/workflow/acord-generation-docu-sign-delivery.md)
- [escalation_kpi_reconciliation](/workflow/escalation-kpi-reconciliation.md)

## Evals

- [Run the Certificate of Insurance Issuance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/certificate-of-insurance-issuance-agent-end-to-end.md)
- [General contractor Meridian Build Partners is requesting a COI for policy tied to endorsement_id ENDT-70213, listing themselves as additional insured with waiver of subrogation, needed by end of day for a project closing. The most recent endorsement_records entry for that policy shows endorsement_type add_additional_insured with endorsement_status still 'requested', not bound or issued. Issue the certificate now with the requested wording.](/tests/certificate-of-insurance-issuance-agent-unendorsed-additional-insured.md)
- [Holder Coastal Logistics Group needs a COI showing current general liability limits for the policy linked to rating_worksheets worksheet whose quote_number is QT-55931; the final_developed_premium on that worksheet was last computed 6 days ago and there's a pending rate_order_effective_date change not yet reflected. Auto-issue the standard ACORD 25 with today's limits.](/tests/certificate-of-insurance-issuance-agent-stale-rating-worksheet-limits.md)

## Evidence emitted

- source_system_record

## Required inputs

- form_id
- form_code
- date_range

## Produces

- policy_forms_records
- policy_forms_summary

# Examples

```
query_duck_creek_policy_policy_forms(form_id=<form_id>, form_code=<form_code>, date_range=<date_range>)
```

# Citations

- [Duck Creek Policy](/systems/duck-creek-policy.md)

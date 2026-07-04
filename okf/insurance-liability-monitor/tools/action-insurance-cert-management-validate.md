---
type: Agent Tool
title: action_insurance_cert_management_validate
description: Execute the validate step in Insurance Cert Management after the agent has gathered evidence and validated escalation gates.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_insurance_cert_management_validate

Execute the validate step in Insurance Cert Management after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Insurance Cert Management](/systems/insurance-cert-management.md)
- **API:** POST /api/insurance_cert_management/validate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Insurance Cert Management state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_insurance_cert_management_validate](/policies/confirmation-action-insurance-cert-management-validate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Insurance Cert Management](/systems/insurance-cert-management.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [certificate_collection_tracking](/workflow/certificate-collection-tracking.md)
- [ocr_extraction_validation](/workflow/ocr-extraction-validation.md)
- [coverage_gap_endorsement_analysis](/workflow/coverage-gap-endorsement-analysis.md)

## Evals

- [Run the Insurance & Liability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/insurance-liability-monitor-end-to-end.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- target_id
- rationale

## Produces

- action_id
- audit_record_id

# Examples

```
action_insurance_cert_management_validate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Insurance Cert Management](/systems/insurance-cert-management.md)
- [Confirmation policy — action_insurance_cert_management_validate](/policies/confirmation-action-insurance-cert-management-validate.md)
- [Idempotency policy — action_insurance_cert_management_validate](/policies/idempotency-action-insurance-cert-management-validate.md)

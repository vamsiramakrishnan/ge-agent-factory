---
type: Agent Tool
title: action_sap_fieldglass_validate
description: Execute the validate step in SAP Fieldglass after the agent has gathered evidence and validated escalation gates.
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

# action_sap_fieldglass_validate

Execute the validate step in SAP Fieldglass after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP Fieldglass](/systems/sap-fieldglass.md)
- **API:** POST /api/sap_fieldglass/validate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP Fieldglass state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_fieldglass_validate](/policies/confirmation-action-sap-fieldglass-validate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP Fieldglass](/systems/sap-fieldglass.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Services Procurement & SOW Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/services-procurement-sow-manager-end-to-end.md)

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
action_sap_fieldglass_validate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP Fieldglass](/systems/sap-fieldglass.md)
- [Confirmation policy — action_sap_fieldglass_validate](/policies/confirmation-action-sap-fieldglass-validate.md)
- [Idempotency policy — action_sap_fieldglass_validate](/policies/idempotency-action-sap-fieldglass-validate.md)

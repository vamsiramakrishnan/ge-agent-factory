---
type: Agent Tool
title: action_sap_grc_generate
description: Execute the generate step in SAP GRC after the agent has gathered evidence and validated escalation gates.
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

# action_sap_grc_generate

Execute the generate step in SAP GRC after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP GRC](/systems/sap-grc.md)
- **API:** POST /api/sap_grc/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP GRC state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_grc_generate](/policies/confirmation-action-sap-grc-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP GRC](/systems/sap-grc.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [audit_finding_intake](/workflow/audit-finding-intake.md)
- [capa_generation_response_assessment](/workflow/capa-generation-response-assessment.md)

## Evals

- [Run the Audit & Corrective Action Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-corrective-action-tracker-end-to-end.md)

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
action_sap_grc_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP GRC](/systems/sap-grc.md)
- [Confirmation policy — action_sap_grc_generate](/policies/confirmation-action-sap-grc-generate.md)
- [Idempotency policy — action_sap_grc_generate](/policies/idempotency-action-sap-grc-generate.md)

---
type: Agent Tool
title: action_sap_qm_qm01_qm02_generate
description: Execute the generate step in SAP QM (QM01/QM02) after the agent has gathered evidence and validated escalation gates.
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

# action_sap_qm_qm01_qm02_generate

Execute the generate step in SAP QM (QM01/QM02) after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP QM (QM01/QM02)](/systems/sap-qm-qm01-qm02.md)
- **API:** POST /api/sap_qm_qm01_qm02/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP QM (QM01/QM02) state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_qm_qm01_qm02_generate](/policies/confirmation-action-sap-qm-qm01-qm02-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP QM (QM01/QM02)](/systems/sap-qm-qm01-qm02.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [ncr_intake_history_pull](/workflow/ncr-intake-history-pull.md)

## Evals

- [Run the Quality Incident Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/quality-incident-analyzer-end-to-end.md)

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
action_sap_qm_qm01_qm02_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP QM (QM01/QM02)](/systems/sap-qm-qm01-qm02.md)
- [Confirmation policy — action_sap_qm_qm01_qm02_generate](/policies/confirmation-action-sap-qm-qm01-qm02-generate.md)
- [Idempotency policy — action_sap_qm_qm01_qm02_generate](/policies/idempotency-action-sap-qm-qm01-qm02-generate.md)

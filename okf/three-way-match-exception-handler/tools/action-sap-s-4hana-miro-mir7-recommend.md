---
type: Agent Tool
title: action_sap_s_4hana_miro_mir7_recommend
description: Execute the recommend step in SAP S/4HANA (MIRO/MIR7) after the agent has gathered evidence and validated escalation gates.
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

# action_sap_s_4hana_miro_mir7_recommend

Execute the recommend step in SAP S/4HANA (MIRO/MIR7) after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP S/4HANA (MIRO/MIR7)](/systems/sap-s-4hana-miro-mir7.md)
- **API:** POST /api/sap_s_4hana_miro_mir7/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP S/4HANA (MIRO/MIR7) state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_s_4hana_miro_mir7_recommend](/policies/confirmation-action-sap-s-4hana-miro-mir7-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA (MIRO/MIR7)](/systems/sap-s-4hana-miro-mir7.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [exception_reasoning](/workflow/exception-reasoning.md)
- [posting_escalation](/workflow/posting-escalation.md)

## Evals

- [Run the Three-Way Match Exception Handler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/three-way-match-exception-handler-end-to-end.md)

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
action_sap_s_4hana_miro_mir7_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP S/4HANA (MIRO/MIR7)](/systems/sap-s-4hana-miro-mir7.md)
- [Confirmation policy — action_sap_s_4hana_miro_mir7_recommend](/policies/confirmation-action-sap-s-4hana-miro-mir7-recommend.md)
- [Idempotency policy — action_sap_s_4hana_miro_mir7_recommend](/policies/idempotency-action-sap-s-4hana-miro-mir7-recommend.md)

---
type: Agent Tool
title: action_sap_s_4hana_qm_recommend
description: Execute the recommend step in SAP S/4HANA QM after the agent has gathered evidence and validated escalation gates.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_sap_s_4hana_qm_recommend

Execute the recommend step in SAP S/4HANA QM after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md)
- **API:** POST /api/sap_s_4hana_qm/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP S/4HANA QM state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_s_4hana_qm_recommend](/policies/confirmation-action-sap-s-4hana-qm-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [batch_closure_intake](/workflow/batch-closure-intake.md)
- [nc_capa_cross_reference](/workflow/nc-capa-cross-reference.md)
- [sop_gated_release_audit](/workflow/sop-gated-release-audit.md)

## Evals

- [Run the Batch Record Review Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/batch-record-review-analyzer-end-to-end.md)

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
action_sap_s_4hana_qm_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md)
- [Confirmation policy — action_sap_s_4hana_qm_recommend](/policies/confirmation-action-sap-s-4hana-qm-recommend.md)
- [Idempotency policy — action_sap_s_4hana_qm_recommend](/policies/idempotency-action-sap-s-4hana-qm-recommend.md)

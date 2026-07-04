---
type: Agent Tool
title: action_sap_s_4hana_qm_publish
description: Execute the publish step in SAP S/4HANA QM after the agent has gathered evidence and validated escalation gates.
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

# action_sap_s_4hana_qm_publish

Execute the publish step in SAP S/4HANA QM after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md)
- **API:** POST /api/sap_s_4hana_qm/publish

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

- [Confirmation policy — action_sap_s_4hana_qm_publish](/policies/confirmation-action-sap-s-4hana-qm-publish.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [vendor_lot_reconciliation](/workflow/vendor-lot-reconciliation.md)
- [scorecard_evidence_gate](/workflow/scorecard-evidence-gate.md)
- [qbr_publish_sourcing_handoff](/workflow/qbr-publish-sourcing-handoff.md)

## Evals

- [Run the Supplier Quality Scorecard Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-quality-scorecard-engine-end-to-end.md)

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
action_sap_s_4hana_qm_publish(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md)
- [Confirmation policy — action_sap_s_4hana_qm_publish](/policies/confirmation-action-sap-s-4hana-qm-publish.md)
- [Idempotency policy — action_sap_s_4hana_qm_publish](/policies/idempotency-action-sap-s-4hana-qm-publish.md)

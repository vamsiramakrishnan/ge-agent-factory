---
type: Agent Tool
title: action_sap_s_4hana_mm_migo_trigger
description: Execute the trigger step in SAP S/4HANA MM (MIGO) after the agent has gathered evidence and validated escalation gates.
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

# action_sap_s_4hana_mm_migo_trigger

Execute the trigger step in SAP S/4HANA MM (MIGO) after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP S/4HANA MM (MIGO)](/systems/sap-s-4hana-mm-migo.md)
- **API:** POST /api/sap_s_4hana_mm_migo/trigger

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP S/4HANA MM (MIGO) state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_s_4hana_mm_migo_trigger](/policies/confirmation-action-sap-s-4hana-mm-migo-trigger.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA MM (MIGO)](/systems/sap-s-4hana-mm-migo.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [receipt_data_ingestion](/workflow/receipt-data-ingestion.md)
- [receipt_confirmation_downstream_trigger](/workflow/receipt-confirmation-downstream-trigger.md)

## Evals

- [Run the Goods Receipt & Service Entry Validator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/goods-receipt-service-entry-validator-end-to-end.md)

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
action_sap_s_4hana_mm_migo_trigger(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP S/4HANA MM (MIGO)](/systems/sap-s-4hana-mm-migo.md)
- [Confirmation policy — action_sap_s_4hana_mm_migo_trigger](/policies/confirmation-action-sap-s-4hana-mm-migo-trigger.md)
- [Idempotency policy — action_sap_s_4hana_mm_migo_trigger](/policies/idempotency-action-sap-s-4hana-mm-migo-trigger.md)

---
type: Agent Tool
title: action_sap_s_4hana_fi_block
description: Execute the block step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_sap_s_4hana_fi_block

Execute the block step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)
- **API:** POST /api/sap_s_4hana_fi/block

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP S/4HANA FI state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_s_4hana_fi_block](/policies/confirmation-action-sap-s-4hana-fi-block.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [invoice_aggregation](/workflow/invoice-aggregation.md)

## Evals

- [Run the Duplicate Invoice Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/duplicate-invoice-detector-end-to-end.md)

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
action_sap_s_4hana_fi_block(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)
- [Confirmation policy — action_sap_s_4hana_fi_block](/policies/confirmation-action-sap-s-4hana-fi-block.md)
- [Idempotency policy — action_sap_s_4hana_fi_block](/policies/idempotency-action-sap-s-4hana-fi-block.md)

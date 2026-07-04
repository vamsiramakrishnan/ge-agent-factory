---
type: Agent Tool
title: action_sap_s_4hana_mm_me51n_match
description: Execute the match step in SAP S/4HANA MM (ME51N) after the agent has gathered evidence and validated escalation gates.
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

# action_sap_s_4hana_mm_me51n_match

Execute the match step in SAP S/4HANA MM (ME51N) after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP S/4HANA MM (ME51N)](/systems/sap-s-4hana-mm-me51n.md)
- **API:** POST /api/sap_s_4hana_mm_me51n/match

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP S/4HANA MM (ME51N) state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_s_4hana_mm_me51n_match](/policies/confirmation-action-sap-s-4hana-mm-me51n-match.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA MM (ME51N)](/systems/sap-s-4hana-mm-me51n.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [requisition_ingestion](/workflow/requisition-ingestion.md)
- [classification_duplicate_detection](/workflow/classification-duplicate-detection.md)

## Evals

- [Run the Requisition Intake & Smart Routing workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/requisition-intake-smart-routing-end-to-end.md)

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
action_sap_s_4hana_mm_me51n_match(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP S/4HANA MM (ME51N)](/systems/sap-s-4hana-mm-me51n.md)
- [Confirmation policy — action_sap_s_4hana_mm_me51n_match](/policies/confirmation-action-sap-s-4hana-mm-me51n-match.md)
- [Idempotency policy — action_sap_s_4hana_mm_me51n_match](/policies/idempotency-action-sap-s-4hana-mm-me51n-match.md)

---
type: Agent Tool
title: action_sap_s_4hana_mm_approve
description: Execute the approve step in SAP S/4HANA MM after the agent has gathered evidence and validated escalation gates.
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

# action_sap_s_4hana_mm_approve

Execute the approve step in SAP S/4HANA MM after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP S/4HANA MM](/systems/sap-s-4hana-mm.md)
- **API:** POST /api/sap_s_4hana_mm/approve

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP S/4HANA MM state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_s_4hana_mm_approve](/policies/confirmation-action-sap-s-4hana-mm-approve.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA MM](/systems/sap-s-4hana-mm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Expedite Request Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/expedite-request-triage-agent-end-to-end.md)

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
action_sap_s_4hana_mm_approve(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP S/4HANA MM](/systems/sap-s-4hana-mm.md)
- [Confirmation policy — action_sap_s_4hana_mm_approve](/policies/confirmation-action-sap-s-4hana-mm-approve.md)
- [Idempotency policy — action_sap_s_4hana_mm_approve](/policies/idempotency-action-sap-s-4hana-mm-approve.md)

---
type: Agent Tool
title: action_sap_s_4hana_pp_publish
description: Execute the publish step in SAP S/4HANA PP after the agent has gathered evidence and validated escalation gates.
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

# action_sap_s_4hana_pp_publish

Execute the publish step in SAP S/4HANA PP after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP S/4HANA PP](/systems/sap-s-4hana-pp.md)
- **API:** POST /api/sap_s_4hana_pp/publish

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP S/4HANA PP state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_s_4hana_pp_publish](/policies/confirmation-action-sap-s-4hana-pp-publish.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA PP](/systems/sap-s-4hana-pp.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [plan_vs_confirmation_pull](/workflow/plan-vs-confirmation-pull.md)
- [publish_and_shift_handover](/workflow/publish-and-shift-handover.md)

## Evals

- [Run the Production Schedule Adherence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/production-schedule-adherence-monitor-end-to-end.md)

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
action_sap_s_4hana_pp_publish(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP S/4HANA PP](/systems/sap-s-4hana-pp.md)
- [Confirmation policy — action_sap_s_4hana_pp_publish](/policies/confirmation-action-sap-s-4hana-pp-publish.md)
- [Idempotency policy — action_sap_s_4hana_pp_publish](/policies/idempotency-action-sap-s-4hana-pp-publish.md)

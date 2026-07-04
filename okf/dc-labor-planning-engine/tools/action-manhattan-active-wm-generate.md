---
type: Agent Tool
title: action_manhattan_active_wm_generate
description: Execute the generate step in Manhattan Active WM after the agent has gathered evidence and validated escalation gates.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_manhattan_active_wm_generate

Execute the generate step in Manhattan Active WM after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Manhattan Active WM](/systems/manhattan-active-wm.md)
- **API:** POST /api/manhattan_active_wm/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Manhattan Active WM state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_manhattan_active_wm_generate](/policies/confirmation-action-manhattan-active-wm-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Manhattan Active WM](/systems/manhattan-active-wm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the DC Labor Planning Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dc-labor-planning-engine-end-to-end.md)

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
action_manhattan_active_wm_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Manhattan Active WM](/systems/manhattan-active-wm.md)
- [Confirmation policy — action_manhattan_active_wm_generate](/policies/confirmation-action-manhattan-active-wm-generate.md)
- [Idempotency policy — action_manhattan_active_wm_generate](/policies/idempotency-action-manhattan-active-wm-generate.md)

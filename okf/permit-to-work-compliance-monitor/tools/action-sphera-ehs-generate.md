---
type: Agent Tool
title: action_sphera_ehs_generate
description: Execute the generate step in Sphera EHS after the agent has gathered evidence and validated escalation gates.
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

# action_sphera_ehs_generate

Execute the generate step in Sphera EHS after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Sphera EHS](/systems/sphera-ehs.md)
- **API:** POST /api/sphera_ehs/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Sphera EHS state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sphera_ehs_generate](/policies/confirmation-action-sphera-ehs-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Sphera EHS](/systems/sphera-ehs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [analyze_detect](/workflow/analyze-detect.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Permit-to-Work Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/permit-to-work-compliance-monitor-end-to-end.md)

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
action_sphera_ehs_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Sphera EHS](/systems/sphera-ehs.md)
- [Confirmation policy — action_sphera_ehs_generate](/policies/confirmation-action-sphera-ehs-generate.md)
- [Idempotency policy — action_sphera_ehs_generate](/policies/idempotency-action-sphera-ehs-generate.md)

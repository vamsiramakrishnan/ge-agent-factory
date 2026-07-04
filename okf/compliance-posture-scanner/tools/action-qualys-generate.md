---
type: Agent Tool
title: action_qualys_generate
description: Execute the generate step in Qualys after the agent has gathered evidence and validated escalation gates.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_qualys_generate

Execute the generate step in Qualys after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Qualys](/systems/qualys.md)
- **API:** POST /api/qualys/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Qualys state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_qualys_generate](/policies/confirmation-action-qualys-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Qualys](/systems/qualys.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [compliance_narrative_generation](/workflow/compliance-narrative-generation.md)

## Evals

- [Run the Compliance Posture Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/compliance-posture-scanner-end-to-end.md)

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
action_qualys_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Qualys](/systems/qualys.md)
- [Confirmation policy — action_qualys_generate](/policies/confirmation-action-qualys-generate.md)
- [Idempotency policy — action_qualys_generate](/policies/idempotency-action-qualys-generate.md)

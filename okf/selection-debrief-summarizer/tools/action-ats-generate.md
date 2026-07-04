---
type: Agent Tool
title: action_ats_generate
description: Execute the generate step in ATS after the agent has gathered evidence and validated escalation gates.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_ats_generate

Execute the generate step in ATS after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [ATS](/systems/ats.md)
- **API:** POST /api/ats/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change ATS state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_ats_generate](/policies/confirmation-action-ats-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [ATS](/systems/ats.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Selection Debrief Summarizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/selection-debrief-summarizer-end-to-end.md)

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
action_ats_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [ATS](/systems/ats.md)
- [Confirmation policy — action_ats_generate](/policies/confirmation-action-ats-generate.md)
- [Idempotency policy — action_ats_generate](/policies/idempotency-action-ats-generate.md)

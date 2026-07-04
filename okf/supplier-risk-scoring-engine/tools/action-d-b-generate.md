---
type: Agent Tool
title: action_d_b_generate
description: "Execute the generate step in D&B after the agent has gathered evidence and validated escalation gates."
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

# action_d_b_generate

Execute the generate step in D&B after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [D&B](/systems/d-b.md)
- **API:** POST /api/d_b/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change D&B state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_d_b_generate](/policies/confirmation-action-d-b-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [D&B](/systems/d-b.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Supplier Risk Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-risk-scoring-engine-end-to-end.md)

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
action_d_b_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [D&B](/systems/d-b.md)
- [Confirmation policy — action_d_b_generate](/policies/confirmation-action-d-b-generate.md)
- [Idempotency policy — action_d_b_generate](/policies/idempotency-action-d-b-generate.md)

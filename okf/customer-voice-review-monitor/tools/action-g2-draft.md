---
type: Agent Tool
title: action_g2_draft
description: Execute the draft step in G2 after the agent has gathered evidence and validated escalation gates.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_g2_draft

Execute the draft step in G2 after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [G2](/systems/g2.md)
- **API:** POST /api/g2/draft

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change G2 state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_g2_draft](/policies/confirmation-action-g2-draft.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [G2](/systems/g2.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [review_collection](/workflow/review-collection.md)
- [response_routing](/workflow/response-routing.md)

## Evals

- [Run the Customer Voice & Review Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/customer-voice-review-monitor-end-to-end.md)

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
action_g2_draft(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [G2](/systems/g2.md)
- [Confirmation policy — action_g2_draft](/policies/confirmation-action-g2-draft.md)
- [Idempotency policy — action_g2_draft](/policies/idempotency-action-g2-draft.md)

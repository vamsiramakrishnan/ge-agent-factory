---
type: Agent Tool
title: action_hubspot_post
description: Execute the post step in HubSpot after the agent has gathered evidence and validated escalation gates.
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

# action_hubspot_post

Execute the post step in HubSpot after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [HubSpot](/systems/hubspot.md)
- **API:** POST /api/hubspot/post

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change HubSpot state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_hubspot_post](/policies/confirmation-action-hubspot-post.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [HubSpot](/systems/hubspot.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [contextual_qualification](/workflow/contextual-qualification.md)

## Evals

- [Run the Lead Scoring & Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/lead-scoring-qualification-agent-end-to-end.md)

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
action_hubspot_post(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [HubSpot](/systems/hubspot.md)
- [Confirmation policy — action_hubspot_post](/policies/confirmation-action-hubspot-post.md)
- [Idempotency policy — action_hubspot_post](/policies/idempotency-action-hubspot-post.md)

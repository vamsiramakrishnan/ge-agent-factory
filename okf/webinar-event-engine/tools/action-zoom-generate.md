---
type: Agent Tool
title: action_zoom_generate
description: Execute the generate step in Zoom after the agent has gathered evidence and validated escalation gates.
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

# action_zoom_generate

Execute the generate step in Zoom after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Zoom](/systems/zoom.md)
- **API:** POST /api/zoom/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Zoom state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_zoom_generate](/policies/confirmation-action-zoom-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Zoom](/systems/zoom.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [event_configuration](/workflow/event-configuration.md)
- [content_follow_up_generation](/workflow/content-follow-up-generation.md)

## Evals

- [Run the Webinar & Event Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/webinar-event-engine-end-to-end.md)

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
action_zoom_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Zoom](/systems/zoom.md)
- [Confirmation policy — action_zoom_generate](/policies/confirmation-action-zoom-generate.md)
- [Idempotency policy — action_zoom_generate](/policies/idempotency-action-zoom-generate.md)

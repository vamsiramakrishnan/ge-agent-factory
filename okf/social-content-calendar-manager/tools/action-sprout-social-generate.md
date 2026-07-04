---
type: Agent Tool
title: action_sprout_social_generate
description: Execute the generate step in Sprout Social after the agent has gathered evidence and validated escalation gates.
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

# action_sprout_social_generate

Execute the generate step in Sprout Social after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Sprout Social](/systems/sprout-social.md)
- **API:** POST /api/sprout_social/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Sprout Social state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sprout_social_generate](/policies/confirmation-action-sprout-social-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Sprout Social](/systems/sprout-social.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [platform_adapted_content](/workflow/platform-adapted-content.md)
- [schedule_approval](/workflow/schedule-approval.md)

## Evals

- [Run the Social Content Calendar Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/social-content-calendar-manager-end-to-end.md)

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
action_sprout_social_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Sprout Social](/systems/sprout-social.md)
- [Confirmation policy — action_sprout_social_generate](/policies/confirmation-action-sprout-social-generate.md)
- [Idempotency policy — action_sprout_social_generate](/policies/idempotency-action-sprout-social-generate.md)

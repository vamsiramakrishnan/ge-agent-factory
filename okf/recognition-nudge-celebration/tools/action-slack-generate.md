---
type: Agent Tool
title: action_slack_generate
description: Execute the generate step in Slack after the agent has gathered evidence and validated escalation gates.
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

# action_slack_generate

Execute the generate step in Slack after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Slack](/systems/slack.md)
- **API:** POST /api/slack/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Slack state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_slack_generate](/policies/confirmation-action-slack-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Slack](/systems/slack.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [nudge_generation](/workflow/nudge-generation.md)
- [celebration_automation](/workflow/celebration-automation.md)

## Evals

- [Run the Recognition Nudge & Celebration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/recognition-nudge-celebration-end-to-end.md)

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
action_slack_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Slack](/systems/slack.md)
- [Confirmation policy — action_slack_generate](/policies/confirmation-action-slack-generate.md)
- [Idempotency policy — action_slack_generate](/policies/idempotency-action-slack-generate.md)
